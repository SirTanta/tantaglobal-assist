import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
  buildEvent,
  signPayload,
  deterministicEventId,
  toIso8601Utc,
  sendEmployerIntake,
  sendPlacementOfferCreated,
  sendPlacementRevenueRecorded,
} from "../src/lib/atlas-ingestion";

// Read at call time inside the sender, so setting them after import is fine.
process.env.CRM_INGESTION_ENDPOINT = "https://crm.test.invalid/api/v1/integrations/global-assist";
process.env.HOLDINGS_INGESTION_SECRET = "test-secret-value";

const ENDPOINT = process.env.CRM_INGESTION_ENDPOINT;
const SECRET = process.env.HOLDINGS_INGESTION_SECRET;

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
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const INTAKE = {
  employerId: "emp_10023",
  occurredAt: "2026-08-01T12:00:00.000Z",
  attribution: {
    source: "google",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "va-hiring-q3",
    gclid: "Cj0KCQ-abc123",
  },
  data: {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@acme.com",
    phone: "+15055550123",
    lifecycle_stage: "new" as const,
  },
};

test("signPayload produces sha256=<hex> HMAC over the exact raw body", () => {
  const raw = '{"event_id":"abc","event_type":"employer.intake_received"}';
  const expected =
    "sha256=" + createHmac("sha256", SECRET!).update(raw, "utf8").digest("hex");

  assert.equal(signPayload(raw, SECRET!), expected);
  assert.match(signPayload(raw, SECRET!), /^sha256=[0-9a-f]{64}$/);
});

test("signPayload changes when the body changes by one byte", () => {
  const a = signPayload('{"amount_cents":1000}', SECRET!);
  const b = signPayload('{"amount_cents":1001}', SECRET!);
  assert.notEqual(a, b);
});

test("intake event has the exact envelope shape from the contract", () => {
  const event = buildEvent({
    eventType: "employer.intake_received",
    leadExternalId: INTAKE.employerId,
    attribution: INTAKE.attribution,
    data: INTAKE.data,
    eventId: "11111111-2222-3333-4444-555555555555",
    occurredAt: "2026-08-01T12:00:00.000Z",
  });

  assert.deepEqual(event, {
    event_id: "11111111-2222-3333-4444-555555555555",
    event_type: "employer.intake_received",
    occurred_at: "2026-08-01T12:00:00.000Z",
    source_system: "global_assist",
    lead_external_id: "emp_10023",
    attribution: {
      source: "google",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "va-hiring-q3",
      gclid: "Cj0KCQ-abc123",
    },
    data: {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@acme.com",
      phone: "+15055550123",
      lifecycle_stage: "new",
    },
  });
});

test("lead_external_id is the employer id, never the email", () => {
  const event = buildEvent({
    eventType: "employer.intake_received",
    leadExternalId: INTAKE.employerId,
    attribution: INTAKE.attribution,
    data: INTAKE.data,
    eventId: "11111111-2222-3333-4444-555555555555",
    occurredAt: INTAKE.occurredAt,
  });
  assert.equal(event.lead_external_id, "emp_10023");
  assert.notEqual(event.lead_external_id, INTAKE.data.email);
});

test("toIso8601Utc normalizes PostgREST timestamps to the Z/millisecond form", () => {
  // What PostgREST actually emits for a timestamptz.
  assert.equal(toIso8601Utc("2026-08-01T12:00:00.123456+00:00"), "2026-08-01T12:00:00.123Z");
  assert.equal(toIso8601Utc("2026-08-01T12:00:00+00:00"), "2026-08-01T12:00:00.000Z");
  assert.equal(toIso8601Utc("2026-08-01T07:00:00-05:00"), "2026-08-01T12:00:00.000Z");
  assert.equal(toIso8601Utc("2026-08-01T12:00:00.000Z"), "2026-08-01T12:00:00.000Z");

  // Absent or unparseable must fall back to now, never throw.
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  assert.match(toIso8601Utc(undefined), iso);
  assert.match(toIso8601Utc(null), iso);
  assert.match(toIso8601Utc("not-a-date"), iso);
});

test("deterministicEventId is stable, UUID-shaped, and input-sensitive", () => {
  const id = deterministicEventId(["global_assist", "employer.intake_received", "emp_10023"]);

  // The receiver validates event_id as a UUID; a raw hex digest is 422-rejected.
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(id, deterministicEventId(["global_assist", "employer.intake_received", "emp_10023"]));
  assert.notEqual(id, deterministicEventId(["global_assist", "employer.intake_received", "emp_9"]));
});

// The axis the original suite missed: idempotency ACROSS calls, not just across
// retries inside one send loop.
test("two separate intake calls for the same employer reuse the same event_id", async () => {
  stubFetch([{ status: 200 }]);
  await sendEmployerIntake(INTAKE);
  const first = JSON.parse(captured[0].body);

  captured = [];
  stubFetch([{ status: 200 }]);
  await sendEmployerIntake(INTAKE);
  const second = JSON.parse(captured[0].body);

  assert.equal(first.event_id, second.event_id);
  assert.equal(first.occurred_at, second.occurred_at);
});

test("different employers get different event_ids", async () => {
  stubFetch([{ status: 200 }]);
  await sendEmployerIntake(INTAKE);
  await sendEmployerIntake({ ...INTAKE, employerId: "emp_99999" });

  const ids = captured.map((c) => JSON.parse(c.body).event_id);
  assert.notEqual(ids[0], ids[1]);
});

test("different event types for one employer get different event_ids", async () => {
  stubFetch([{ status: 200 }]);
  await sendEmployerIntake(INTAKE);
  await sendPlacementOfferCreated({
    employerId: INTAKE.employerId,
    occurredAt: INTAKE.occurredAt,
    data: {
      offer_external_id: "offer_77",
      amount_cents: 250000,
      currency: "USD",
      status: "sent",
    },
  });

  const ids = captured.map((c) => JSON.parse(c.body).event_id);
  assert.notEqual(ids[0], ids[1]);
});

test("distinct revenue events for one employer do not collapse to one event_id", async () => {
  stubFetch([{ status: 200 }]);
  const base = {
    employerId: "emp_10023",
    occurredAt: INTAKE.occurredAt,
    data: {
      amount_cents: 250000,
      currency: "USD",
      revenue_type: "placement_fee",
      offer_external_id: "offer_77",
      recognized_at: "2026-08-01T00:00:00.000Z",
    },
  };
  await sendPlacementRevenueRecorded(base);
  await sendPlacementRevenueRecorded({
    ...base,
    data: { ...base.data, recognized_at: "2026-09-01T00:00:00.000Z" },
  });

  const ids = captured.map((c) => JSON.parse(c.body).event_id);
  assert.notEqual(ids[0], ids[1], "a second payment must not be swallowed as a duplicate");
});

test("sendEmployerIntake posts a correctly signed request to the configured endpoint", async () => {
  stubFetch([{ status: 200, body: { status: "ok" } }]);

  const result = await sendEmployerIntake(INTAKE);

  assert.equal(result.delivered, true);
  assert.equal(captured.length, 1);

  const req = captured[0];
  assert.equal(req.url, ENDPOINT);
  assert.equal(req.headers["Content-Type"], "application/json");

  // The signature must verify against the exact bytes that were sent.
  const expected =
    "sha256=" + createHmac("sha256", SECRET!).update(req.body, "utf8").digest("hex");
  assert.equal(req.headers["X-Tanta-Signature"], expected);

  const sent = JSON.parse(req.body);
  assert.equal(sent.event_type, "employer.intake_received");
  assert.equal(sent.source_system, "global_assist");
  assert.equal(sent.lead_external_id, "emp_10023");
  assert.equal(sent.attribution.source, "google");
  assert.equal(sent.data.lifecycle_stage, "new");
});

test("the raw secret never appears in the request", async () => {
  stubFetch([{ status: 200 }]);
  await sendEmployerIntake(INTAKE);

  const req = captured[0];
  assert.ok(!req.body.includes(SECRET!));
  assert.ok(!JSON.stringify(req.headers).includes(SECRET!));
});

test("5xx is retried with the same event_id reused on every attempt", async () => {
  stubFetch([{ status: 503 }, { status: 503 }, { status: 200, body: { status: "ok" } }]);

  const result = await sendEmployerIntake(INTAKE);

  assert.equal(result.delivered, true);
  assert.equal(captured.length, 3);

  const ids = captured.map((c) => JSON.parse(c.body).event_id);
  assert.equal(new Set(ids).size, 1, "retries must reuse the same event_id");

  // Identical bytes imply an identical signature, which is what lets the
  // receiver dedupe rather than create a second record.
  const sigs = captured.map((c) => c.headers["X-Tanta-Signature"]);
  assert.equal(new Set(sigs).size, 1);
});

test("a duplicate response is reported as delivered, not as a failure", async () => {
  stubFetch([{ status: 200, body: { status: "duplicate" } }]);
  const result = await sendEmployerIntake(INTAKE);
  assert.deepEqual(result, { delivered: true, status: 200, duplicate: true });
});

test("401 is not retried", async () => {
  stubFetch([{ status: 401 }]);
  const result = await sendEmployerIntake(INTAKE);
  assert.equal(result.delivered, false);
  assert.equal(captured.length, 1);
});

test("422 is not retried", async () => {
  stubFetch([{ status: 422 }]);
  const result = await sendEmployerIntake(INTAKE);
  assert.equal(result.delivered, false);
  assert.equal(captured.length, 1);
});

test("empty attribution values are dropped rather than sent as empty strings", async () => {
  stubFetch([{ status: 200 }]);
  await sendEmployerIntake({
    ...INTAKE,
    attribution: { source: "direct", utm_source: "", utm_medium: undefined },
  });

  const sent = JSON.parse(captured[0].body);
  assert.deepEqual(sent.attribution, { source: "direct" });
});

test("arbitrary client-supplied attribution keys are stripped", async () => {
  stubFetch([{ status: 200 }]);
  await sendEmployerIntake({
    ...INTAKE,
    attribution: {
      source: "google",
      utm_source: "google",
      // A caller can POST anything; none of it may reach the CRM.
      evil_key: "injected",
      __proto__: "polluted",
      lifecycle_stage: "customer",
    } as never,
  });

  const sent = JSON.parse(captured[0].body);
  assert.deepEqual(sent.attribution, { source: "google", utm_source: "google" });
});

test("revenue event carries offer_external_id and currency when present", async () => {
  stubFetch([{ status: 200 }]);
  await sendPlacementRevenueRecorded({
    employerId: "emp_10023",
    occurredAt: INTAKE.occurredAt,
    data: {
      amount_cents: 250000,
      currency: "USD",
      revenue_type: "placement_fee",
      offer_external_id: "offer_77",
      recognized_at: "2026-08-01T00:00:00.000Z",
    },
  });

  const sent = JSON.parse(captured[0].body);
  assert.equal(sent.event_type, "placement.revenue_recorded");
  assert.equal(sent.data.amount_cents, 250000);
  assert.equal(sent.data.currency, "USD");
  assert.equal(sent.data.offer_external_id, "offer_77");
});
