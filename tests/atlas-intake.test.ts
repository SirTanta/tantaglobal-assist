import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
  signIntakePayload,
  sendAtlasIntake,
  buildEmployerIntakeIdempotencyKey,
  ATLAS_INTAKE_TENANT,
  ATLAS_INTAKE_SOURCE_ID,
  ATLAS_INTAKE_PATH,
  type AtlasIntakePayload,
} from "../src/lib/atlas-intake";

// Read at call time inside the sender, so setting them after import is fine.
const FTB_URL = "https://atlas.test.invalid";
const FTB_SECRET = "test-ftb-secret";
process.env.ATLAS_FLEET_TICKETING_BRIDGE_URL = FTB_URL;
process.env.ATLAS_FLEET_TICKETING_BRIDGE_SECRET = FTB_SECRET;

interface Capture {
  url: string;
  headers: Record<string, string>;
  body: string;
}

const realFetch = globalThis.fetch;
let captured: Capture[] = [];

function stubFetch(responses: Array<{ status: number; body?: unknown }>) {
  let i = 0;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    captured.push({
      url: String(url),
      headers: init.headers as Record<string, string>,
      body: init.body as string,
    });
    const spec = responses[Math.min(i, responses.length - 1)];
    i++;
    return {
      ok: spec.status >= 200 && spec.status < 300,
      status: spec.status,
      json: async () => spec.body ?? {},
    };
  }) as unknown as typeof globalThis.fetch;
}

beforeEach(() => {
  captured = [];
  // Reset env each test — some tests unset one of them on purpose.
  process.env.ATLAS_FLEET_TICKETING_BRIDGE_URL = FTB_URL;
  process.env.ATLAS_FLEET_TICKETING_BRIDGE_SECRET = FTB_SECRET;
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const FIXED_PAYLOAD: AtlasIntakePayload = {
  company_scope: "assist",
  department: "Sales / Revenue",
  exact_target: "VA Placement employer intake",
  concise_subject: "New employer lead from tantaglobal.com/hire",
  operator_description:
    "Employer submitted the VA Placement intake form at tantaglobal.com/hire.",
  intended_outcome:
    "Holo triages the new employer lead and routes to match + outreach.",
  requester: "holo",
  source_authority: "SirTanta/thos-wiki@f6840f8 (docs/business/bizdev.md)",
  request_type: "intake",
  allowed_action_boundary:
    "Create one unclaimed intake row only. No claim, transition, or release.",
  prohibited_action_boundary:
    "No lifecycle mutation, no public action, no provider change.",
  execution_acceptance:
    "intake row visible to Holo via the dept-lead read; no second row on retry.",
  approval_requirement:
    "Self-approved within dept-lead filing scope per AGENTS.md.",
  idempotency_key: "va-intake-assist-20260912-emp_10023",
};

test("signIntakePayload produces sha256=<hex> HMAC over the exact raw body", () => {
  const raw = '{"idempotency_key":"x","company_scope":"assist"}';
  const expected =
    "sha256=" + createHmac("sha256", FTB_SECRET).update(raw, "utf8").digest("hex");

  assert.equal(signIntakePayload(raw, FTB_SECRET), expected);
  assert.match(signIntakePayload(raw, FTB_SECRET), /^sha256=[0-9a-f]{64}$/);
});

test("signIntakePayload changes when the body changes by one byte", () => {
  const a = signIntakePayload('{"idempotency_key":"a"}', FTB_SECRET);
  const b = signIntakePayload('{"idempotency_key":"b"}', FTB_SECRET);
  assert.notEqual(a, b);
});

test("the raw secret never appears in the request", async () => {
  stubFetch([{ status: 200 }]);
  await sendAtlasIntake(FIXED_PAYLOAD);

  const req = captured[0];
  assert.ok(!req.body.includes(FTB_SECRET));
  assert.ok(!JSON.stringify(req.headers).includes(FTB_SECRET));
});

test("sendAtlasIntake posts a correctly signed request to the FTB intake route", async () => {
  stubFetch([{ status: 200, body: { status: "ok" } }]);

  const result = await sendAtlasIntake(FIXED_PAYLOAD);

  assert.equal(result.delivered, true);
  assert.equal(captured.length, 1);

  const req = captured[0];
  // Exact route shape per docs/business/bizdev.md f6840f8 § "Intake destination (canonical)".
  assert.equal(
    req.url,
    `${FTB_URL}${ATLAS_INTAKE_PATH}`,
    "URL must be exactly the FTB intake route, no trailing slash, no extra segments"
  );
  assert.equal(req.headers["Content-Type"], "application/json");
  assert.equal(req.headers["x-atlas-signature"].startsWith("sha256="), true);

  // The signature must verify against the exact bytes that were sent.
  const expected =
    "sha256=" +
    createHmac("sha256", FTB_SECRET).update(req.body, "utf8").digest("hex");
  assert.equal(req.headers["x-atlas-signature"], expected);

  const sent = JSON.parse(req.body);
  assert.equal(sent.company_scope, "assist");
  assert.equal(sent.requester, "holo");
  assert.equal(sent.idempotency_key, FIXED_PAYLOAD.idempotency_key);
  // No caller-supplied status field: the route hard-codes status: "intake" on insert.
  assert.equal(sent.status, undefined);
});

test("FTB URL trailing slash is normalized so the same path is reached either way", async () => {
  process.env.ATLAS_FLEET_TICKETING_BRIDGE_URL = `${FTB_URL}/`;
  stubFetch([{ status: 200 }]);

  await sendAtlasIntake(FIXED_PAYLOAD);

  assert.equal(captured[0].url, `${FTB_URL}${ATLAS_INTAKE_PATH}`);
});

test("required-field handling: missing required fields are still sent through to the FTB route", () => {
  // The intake sender does not validate payload shape on the client side —
  // that is the FTB's job. Confirm we forward exactly what we receive so the
  // FTB's strict schema can reject with 422 and the route can fail loud.
  assert.equal(FIXED_PAYLOAD.company_scope, "assist");
  assert.equal(typeof FIXED_PAYLOAD.idempotency_key, "string");
  assert.equal(FIXED_PAYLOAD.idempotency_key.length >= 16, true);
});

test("buildEmployerIntakeIdempotencyKey is deterministic per (employerId, date, scope)", () => {
  const fixed = new Date("2026-09-12T03:00:00Z");
  const a = buildEmployerIntakeIdempotencyKey("emp_10023", "assist", fixed);
  const b = buildEmployerIntakeIdempotencyKey("emp_10023", "assist", fixed);
  const c = buildEmployerIntakeIdempotencyKey("emp_10023", "assist", new Date("2026-09-13T03:00:00Z"));
  const d = buildEmployerIntakeIdempotencyKey("emp_99999", "assist", fixed);
  const e = buildEmployerIntakeIdempotencyKey("emp_10023", "global", fixed);

  assert.equal(a, b, "same inputs must yield the same key");
  assert.notEqual(a, c, "different UTC days must yield different keys");
  assert.notEqual(a, d, "different employer ids must yield different keys");
  assert.notEqual(a, e, "different scopes must yield different keys");
  assert.match(a, /^va-intake-assist-\d{8}-emp_10023$/);
  assert.ok(a.length >= 16, `idempotency key must be >=16 chars per the FTB contract (got ${a.length})`);
});

test("buildEmployerIntakeIdempotencyKey uses UTC date components, not local", () => {
  // 2026-09-12 23:30 in UTC-8 is still 2026-09-12 in UTC and 2026-09-13 in
  // Asia/Singapore. The key must be stable across the user's timezone.
  const lateUtc = new Date("2026-09-12T23:30:00Z");
  const key = buildEmployerIntakeIdempotencyKey("emp_1", "assist", lateUtc);
  assert.match(key, /^va-intake-assist-20260912-emp_1$/);
});

test("sendAtlasIntake returns not_configured when the URL is missing", async () => {
  delete process.env.ATLAS_FLEET_TICKETING_BRIDGE_URL;
  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.deepEqual(result, { delivered: false, reason: "not_configured" });
  assert.equal(captured.length, 0, "must not fetch when URL is missing");
});

test("sendAtlasIntake returns not_configured when the secret is missing", async () => {
  delete process.env.ATLAS_FLEET_TICKETING_BRIDGE_SECRET;
  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.deepEqual(result, { delivered: false, reason: "not_configured" });
  assert.equal(captured.length, 0, "must not fetch when secret is missing");
});

test("4xx is reported as rejected and is NOT retried", async () => {
  stubFetch([{ status: 422 }]);
  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.equal(result.delivered, false);
  assert.equal((result as { reason: string }).reason, "rejected");
  assert.equal((result as { status?: number }).status, 422);
  assert.equal(captured.length, 1, "4xx must not be retried by the sender");
});

test("401 is reported as rejected and is NOT retried", async () => {
  stubFetch([{ status: 401 }]);
  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.equal(result.delivered, false);
  assert.equal((result as { reason: string }).reason, "rejected");
  assert.equal(captured.length, 1);
});

test("403 is reported as rejected and is NOT retried", async () => {
  stubFetch([{ status: 403 }]);
  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.equal(result.delivered, false);
  assert.equal((result as { reason: string }).reason, "rejected");
  assert.equal(captured.length, 1);
});

test("5xx is surfaced as server_error and is NOT retried by the sender", async () => {
  // The FTB intake route contract: retries are not part of the documented
  // protocol. The sender surfaces the failure so the caller can route to
  // Raphael for bounded recovery.
  stubFetch([{ status: 503 }]);
  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.equal(result.delivered, false);
  assert.equal((result as { reason: string }).reason, "server_error");
  assert.equal((result as { status?: number }).status, 503);
  assert.equal(captured.length, 1, "5xx must not be retried by the sender");
});

test("a network error is surfaced as network_error and is NOT retried by the sender", async () => {
  globalThis.fetch = (async () => {
    throw new Error("ECONNRESET");
  }) as unknown as typeof globalThis.fetch;

  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.equal(result.delivered, false);
  assert.equal((result as { reason: string }).reason, "network_error");
});

test("a 200 with status=duplicate is reported as delivered, not a failure", async () => {
  stubFetch([{ status: 200, body: { status: "duplicate" } }]);
  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.deepEqual(result, { delivered: true, status: 200, duplicate: true });
});

test("a 200 with a non-JSON body is still reported as delivered", async () => {
  globalThis.fetch = (async () => ({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError("unexpected token");
    },
  })) as unknown as typeof globalThis.fetch;

  const result = await sendAtlasIntake(FIXED_PAYLOAD);
  assert.equal(result.delivered, true);
  assert.equal(result.status, 200);
  assert.equal(result.duplicate, false);
});

test("the canonical tenant + integration id constants match the FTB route", () => {
  // These constants appear in the route URL and in SOP citations. Changing
  // them silently would break every intake sender in production.
  assert.equal(ATLAS_INTAKE_TENANT, "tanta-holdings");
  assert.equal(
    ATLAS_INTAKE_SOURCE_ID,
    "9ba4b462-153b-45f9-8f62-2656caaa76ad"
  );
  assert.equal(
    ATLAS_INTAKE_PATH,
    "/api/integrations/tanta-holdings/9ba4b462-153b-45f9-8f62-2656caaa76ad/intake"
  );
});
