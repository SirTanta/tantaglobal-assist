import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
  atlasCrmKey,
  buildAtlasCrmPayload,
  pickAttribution,
  sendAtlasLead,
} from "../src/lib/atlas-crm";
import { __setClientFactoryForTests } from "../src/lib/supabase-admin";

const URL_ = "https://atlas.example.test/api/integrations/tanta-holdings/source-id";
const SECRET = "test-secret";
const realFetch = globalThis.fetch;
const saved = { ...process.env };

beforeEach(() => {
  process.env.ATLAS_ASSIST_FORM_URL = URL_;
  process.env.ATLAS_ASSIST_FORM_SECRET = SECRET;
  delete process.env.THOS_SUPABASE_URL;
  delete process.env.THOS_SUPABASE_SERVICE_KEY;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  __setClientFactoryForTests(null);
  process.env = { ...saved };
});

test("pickAttribution keeps allow-listed keys only and drops junk", () => {
  const out = pickAttribution({
    source: "newsletter",
    utm_source: "fb",
    utm_campaign: "oct",
    gclid: "g1",
    evil: "x",
    utm_medium: "",
    utm_term: 5,
  });
  assert.deepEqual(out, { source: "newsletter", utm_source: "fb", utm_campaign: "oct", gclid: "g1" });
  assert.deepEqual(pickAttribution(undefined), {});
  assert.deepEqual(pickAttribution("str"), {});
});

test("payload carries UTM into notes and attribution, and marks the source system", () => {
  const p = buildAtlasCrmPayload(
    {
      kind: "contact_message",
      event_type: "lead.created",
      email: " Jane@Example.com ",
      name: "Jane",
      attribution: { utm_source: "fb", utm_campaign: "oct", fbclid: "abc" },
    },
    "2026-10-06T00:00:00.000Z",
  );
  assert.equal(p.email, "jane@example.com");
  assert.equal(p.source_system, "global_assist");
  assert.equal((p.attribution as Record<string, string>).utm_source, "fb");
  assert.match(p.notes, /utm_campaign=oct/);
  assert.match(p.notes, /fbclid=abc/);
  assert.match(p.notes, /\[Global Assist lead\.created\] contact_message/);
});

test("idempotency key is deterministic, case-insensitive on email, and differs by kind and ref", () => {
  const a = atlasCrmKey({ kind: "contact_message", event_type: "lead.created", email: "A@x.com" });
  const b = atlasCrmKey({ kind: "contact_message", event_type: "lead.created", email: "a@x.com" });
  const c = atlasCrmKey({ kind: "va_candidate_application", event_type: "lead.created", email: "a@x.com" });
  const d = atlasCrmKey({ kind: "contact_message", event_type: "lead.created", email: "a@x.com", ref: "row-2" });
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.notEqual(a, d);
  assert.match(a, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test("signs the exact body bytes and sends the idempotency key", async () => {
  let seenInit: RequestInit | null = null;
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    seenInit = init;
    return new Response("{}", { status: 202 });
  }) as typeof fetch;

  const res = await sendAtlasLead({ kind: "contact_message", email: "jane@example.com", name: "Jane" });
  assert.equal(res.delivered, true);
  assert.ok(seenInit);
  const init = seenInit as RequestInit;
  const headers = init.headers as Record<string, string>;
  const expected = `sha256=${createHmac("sha256", SECRET).update(init.body as string, "utf8").digest("hex")}`;
  assert.equal(headers["x-atlas-signature"], expected);
  assert.match(headers["x-idempotency-key"], /^[0-9a-f-]{36}$/);
});

test("not configured is a silent no-op, never throws", async () => {
  delete process.env.ATLAS_ASSIST_FORM_URL;
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response("{}");
  }) as typeof fetch;
  const res = await sendAtlasLead({ kind: "k", email: "a@b.co" });
  assert.deepEqual(res, { delivered: false, reason: "not_configured", attempts: 0 });
  assert.equal(called, false);
});

test("invalid email is rejected without a network call", async () => {
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response("{}");
  }) as typeof fetch;
  const res = await sendAtlasLead({ kind: "k", email: "not-an-email" });
  assert.equal(res.delivered, false);
  assert.equal(called, false);
});

test("4xx is permanent, not retried, and is stored in crm_delivery_failures without throwing", async () => {
  process.env.THOS_SUPABASE_URL = "https://thos.example.test";
  process.env.THOS_SUPABASE_SERVICE_KEY = "svc";
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    return new Response("nope", { status: 401 });
  }) as typeof fetch;
  const upserts: Array<{ table: string; row: Record<string, unknown> }> = [];
  __setClientFactoryForTests(() => ({
    from: (table: string) => ({
      upsert: async (row: Record<string, unknown>) => {
        upserts.push({ table, row });
        return { error: null };
      },
    }),
  }));

  const res = await sendAtlasLead({ kind: "contact_message", email: "a@b.co" });
  assert.equal(res.delivered, false);
  assert.equal(calls, 1);
  assert.equal(upserts.length, 1);
  assert.equal(upserts[0].table, "crm_delivery_failures");
  assert.equal(upserts[0].row.reason, "permanent");
  assert.equal(upserts[0].row.target, "atlas_form_assist");
});

test("5xx retries once with the same key, then logs failure and still does not throw", async () => {
  const keys: string[] = [];
  globalThis.fetch = (async (_u: string, init: RequestInit) => {
    keys.push((init.headers as Record<string, string>)["x-idempotency-key"]);
    return new Response("boom", { status: 503 });
  }) as typeof fetch;
  const res = await sendAtlasLead({ kind: "contact_message", email: "a@b.co" });
  assert.equal(res.delivered, false);
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1]);
});

test("a thrown transport error never escapes", async () => {
  globalThis.fetch = (async () => {
    throw new Error("network down");
  }) as typeof fetch;
  const res = await sendAtlasLead({ kind: "contact_message", email: "a@b.co" });
  assert.equal(res.delivered, false);
});
