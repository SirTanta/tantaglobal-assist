import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

import { POST } from "../src/app/api/hire/route";

const realFetch = globalThis.fetch;
const saved = { ...process.env };

beforeEach(() => {
  process.env.SUPABASE_URL = "https://db.example.test";
  process.env.SUPABASE_SERVICE_KEY = "svc";
  process.env.ATLAS_ASSIST_FORM_URL = "https://atlas.example.test/api/integrations/tanta-holdings/src";
  process.env.ATLAS_ASSIST_FORM_SECRET = "s3cret";
  delete process.env.ATLAS_FLEET_TICKETING_BRIDGE_URL;
  delete process.env.ATLAS_FLEET_TICKETING_BRIDGE_SECRET;
  delete process.env.DISCORD_WEBHOOK_OPS;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  process.env = { ...saved };
});

function req(body: unknown, ip: string) {
  return new NextRequest("https://tantaglobal.com/api/hire", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const brief = {
  employer_name: "Jane Smith",
  company_name: "ZZ-TEST-DELETE-ME Co",
  email: "zz-test@example.com",
  va_role: "Executive VA",
  attribution: { source: "newsletter", utm_source: "fb", utm_campaign: "oct" },
};

test("employer_leads insert never carries the attribution object, and the brief is mirrored to Atlas with UTM", async () => {
  const calls: Array<{ url: string; body: string }> = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), body: String(init.body) });
    if (String(url).includes("/rest/v1/employer_leads")) {
      return new Response(JSON.stringify([{ id: "11111111-1111-1111-1111-111111111111" }]), { status: 201 });
    }
    return new Response("{}", { status: 202 });
  }) as typeof fetch;

  const res = await POST(req(brief, "10.0.0.1"));
  assert.equal(res.status, 200);

  const insert = calls.find((c) => c.url.includes("/rest/v1/employer_leads"));
  assert.ok(insert);
  const row = JSON.parse(insert.body);
  assert.equal("attribution" in row, false);
  assert.equal(row.company_name, "ZZ-TEST-DELETE-ME Co");

  const atlas = calls.find((c) => c.url.includes("atlas.example.test"));
  assert.ok(atlas);
  const payload = JSON.parse(atlas.body);
  assert.equal(payload.event_kind, "employer_hire_brief");
  assert.equal(payload.source_system, "global_assist");
  assert.equal(payload.attribution.utm_source, "fb");
  assert.equal(payload.company, "ZZ-TEST-DELETE-ME Co");
});

test("a Supabase failure no longer drops the lead when Atlas captured it", async () => {
  globalThis.fetch = (async (url: string) => {
    if (String(url).includes("/rest/v1/employer_leads")) {
      return new Response(JSON.stringify({ code: "PGRST204", message: "col" }), { status: 400 });
    }
    return new Response("{}", { status: 202 });
  }) as typeof fetch;
  const res = await POST(req(brief, "10.0.0.2"));
  assert.equal(res.status, 200);
});

test("only when neither the database nor Atlas captured the brief does the user see an error", async () => {
  globalThis.fetch = (async () => new Response("down", { status: 500 })) as typeof fetch;
  const res = await POST(req(brief, "10.0.0.3"));
  assert.equal(res.status, 502);
});
