// Atlas CRM conversion mirror for Global Assist (server-only).
//
// Mirrors Global Assist conversion events (contact, candidate application, chat lead, newsletter,
// and the employer role brief) into the Atlas platform inbound integration control plane:
// POST <ATLAS_ASSIST_FORM_URL>, an Atlas "form" source ("Global Assist Site Conversions") on the
// tanta-holdings tenant. Atlas verifies an HMAC-SHA256 hex signature over the raw body
// (x-atlas-signature: sha256=<hex>), records the delivery under x-idempotency-key, and its cron
// maps the payload to a crm_contacts row ({name, email, phone, company, notes}). Extra fields
// (attribution, event kind) ride in the stored payload.
//
// Same rules as the Holdings mirror (tanta-holdings src/lib/atlas-crm.ts): serialize once, sign
// those exact bytes, deterministic idempotency key so a replay dedupes, and NEVER throw into the
// caller. A failure is logged (kind/status only, no personal data) and best-effort stored in
// crm_delivery_failures (THOS Supabase) so it can be replayed.
//
// Env (server-only): ATLAS_ASSIST_FORM_URL, ATLAS_ASSIST_FORM_SECRET. Unset -> no-op.

import { createHash, createHmac } from "node:crypto";
import { createAdminClient, logDbError, logDbException } from "@/lib/supabase-admin";

export const ATLAS_SIGNATURE_HEADER = "x-atlas-signature";
export const ATLAS_IDEMPOTENCY_HEADER = "x-idempotency-key";

const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "fbclid",
] as const;

const MAX_ATTEMPTS = 2;
const BACKOFF_MS = 300;
const TIMEOUT_MS = 4000;

export type AtlasCrmEvent = {
  /** Stable label for the conversion, e.g. "contact_message", "va_candidate_application". */
  kind: string;
  event_type: "lead.created" | "revenue.recorded";
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  /** Extra human-readable lines appended to the Atlas contact note. */
  details?: string[];
  attribution?: unknown;
  /** Business reference that makes this occurrence distinct (e.g. a database row id). */
  ref?: string;
  amount_cents?: number;
  currency?: string;
};

export type AtlasCrmResult =
  | { delivered: true; status: number; attempts: number }
  | { delivered: false; reason: "not_configured" | "permanent" | "exhausted"; status?: number; attempts: number };

function uuidFromKey(key: string): string {
  const h = createHash("sha256").update(`assist-atlas-crm|${key}`).digest();
  const b = Buffer.from(h.subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const x = b.toString("hex");
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20, 32)}`;
}

export function atlasCrmKey(event: Pick<AtlasCrmEvent, "kind" | "event_type" | "email" | "ref">): string {
  const who = createHash("sha256").update(event.email.trim().toLowerCase()).digest("hex").slice(0, 32);
  return uuidFromKey([event.event_type, event.kind, event.ref ?? who, who].join("|"));
}

/** Allow-list of attribution keys. The client body is untrusted, so unknown keys are dropped. */
export function pickAttribution(raw: unknown): Record<string, string> {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : undefined;
  const out: Record<string, string> = {};
  for (const field of ATTRIBUTION_FIELDS) {
    const v = src?.[field];
    if (typeof v === "string" && v.trim()) out[field] = v.trim().slice(0, 500);
  }
  const source = src?.source;
  if (typeof source === "string" && source.trim()) out.source = source.trim().slice(0, 500);
  return out;
}

export function buildAtlasCrmPayload(event: AtlasCrmEvent, occurredAt = new Date().toISOString()) {
  const attribution = pickAttribution(event.attribution);
  const source = attribution.source ?? attribution.utm_source ?? "direct";
  const email = event.email.trim().toLowerCase();
  const name = event.name?.trim() || email;

  const channel = ATTRIBUTION_FIELDS.filter((f) => attribution[f]).map((f) => `${f}=${attribution[f]}`);
  const money =
    event.amount_cents != null
      ? `Amount: ${(event.amount_cents / 100).toFixed(2)} ${(event.currency ?? "usd").toUpperCase()}`
      : null;
  const notes = [
    `[Global Assist ${event.event_type}] ${event.kind}`,
    `Source: ${source}`,
    channel.length ? `Attribution: ${channel.join(" ")}` : "Attribution: none captured",
    money,
    event.ref ? `Ref: ${event.ref}` : null,
    ...(event.details ?? []),
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 2000);

  return {
    name: name.slice(0, 200),
    email,
    ...(event.phone ? { phone: event.phone.slice(0, 60) } : {}),
    ...(event.company ? { company: event.company.slice(0, 200) } : {}),
    notes,
    source_system: "global_assist",
    event_type: event.event_type,
    event_kind: event.kind,
    occurred_at: occurredAt,
    attribution: { source, ...attribution },
    ...(event.ref ? { external_ref: event.ref } : {}),
    ...(event.amount_cents != null
      ? { amount_cents: Math.round(event.amount_cents), currency: (event.currency ?? "usd").toUpperCase() }
      : {}),
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function recordFailure(
  kind: string,
  key: string,
  reason: string,
  status: number | undefined,
  body: string,
): Promise<void> {
  const url = process.env.THOS_SUPABASE_URL;
  const svc = process.env.THOS_SUPABASE_SERVICE_KEY;
  if (!url || !svc) return;
  try {
    const supabase = await createAdminClient(url, svc);
    const { error } = await supabase.from("crm_delivery_failures").upsert(
      {
        event_key: key,
        target: "atlas_form_assist",
        kind,
        reason,
        status_code: status ?? null,
        payload: JSON.parse(body),
      },
      { onConflict: "event_key" },
    );
    logDbError("atlas-crm", "crm_delivery_failures", "upsert", error);
  } catch (err) {
    logDbException("atlas-crm", "crm_delivery_failures", "upsert", err);
  }
}

/**
 * Delivers one conversion to Atlas. Never throws. 5xx / network errors retry once with the
 * same idempotency key; 4xx is permanent (a signing or payload bug) and is not retried.
 */
export async function sendAtlasCrmEvent(event: AtlasCrmEvent): Promise<AtlasCrmResult> {
  try {
    const url = process.env.ATLAS_ASSIST_FORM_URL;
    const secret = process.env.ATLAS_ASSIST_FORM_SECRET;
    if (!url || !secret) {
      console.warn(`[atlas-crm] ATLAS_ASSIST_FORM_URL/SECRET not set, skipping kind=${event.kind}`);
      return { delivered: false, reason: "not_configured", attempts: 0 };
    }
    if (!event.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.email)) {
      return { delivered: false, reason: "permanent", attempts: 0 };
    }

    const key = atlasCrmKey(event);
    const body = JSON.stringify(buildAtlasCrmPayload(event));
    const signature = `sha256=${createHmac("sha256", secret).update(body, "utf8").digest("hex")}`;

    let lastStatus: number | undefined;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [ATLAS_SIGNATURE_HEADER]: signature,
            [ATLAS_IDEMPOTENCY_HEADER]: key,
          },
          body,
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        lastStatus = res.status;
        if (res.ok) return { delivered: true, status: res.status, attempts: attempt };
        if (res.status < 500) {
          console.error(`[atlas-crm] permanent ${res.status} kind=${event.kind} key=${key}`);
          await recordFailure(event.kind, key, "permanent", res.status, body);
          return { delivered: false, reason: "permanent", status: res.status, attempts: attempt };
        }
      } catch (err) {
        console.error(
          `[atlas-crm] transport error attempt=${attempt} kind=${event.kind} message=${
            err instanceof Error ? err.message.slice(0, 120) : typeof err
          }`,
        );
      }
      if (attempt < MAX_ATTEMPTS) await sleep(BACKOFF_MS * attempt);
    }

    console.error(`[atlas-crm] giving up kind=${event.kind} key=${key} status=${lastStatus ?? "none"}`);
    await recordFailure(event.kind, key, "exhausted", lastStatus, body);
    return { delivered: false, reason: "exhausted", status: lastStatus, attempts: MAX_ATTEMPTS };
  } catch (err) {
    console.error(`[atlas-crm] unexpected error kind=${event.kind}`, err instanceof Error ? err.message : typeof err);
    return { delivered: false, reason: "exhausted", attempts: 0 };
  }
}

/** Convenience for form routes: a lead that arrived through a named conversion. */
export function sendAtlasLead(input: Omit<AtlasCrmEvent, "event_type">): Promise<AtlasCrmResult> {
  return sendAtlasCrmEvent({ ...input, event_type: "lead.created" });
}
