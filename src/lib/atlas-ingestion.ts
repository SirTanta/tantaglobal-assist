import { createHash, createHmac } from "node:crypto";

/**
 * Atlas CRM ingestion sender (server-only).
 *
 * Reads HOLDINGS_INGESTION_SECRET and CRM_INGESTION_ENDPOINT from the server
 * environment. Neither is NEXT_PUBLIC_-prefixed, so neither is inlined into a
 * client bundle. Import this module only from route handlers.
 */

export type AtlasEventType =
  | "employer.intake_received"
  | "placement.offer_created"
  | "placement.revenue_recorded";

export interface AtlasAttribution {
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
}

export interface AtlasIntakeData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  lifecycle_stage: "new";
}

export interface AtlasOfferData {
  offer_external_id: string;
  amount_cents: number;
  currency: string;
  status: string;
}

export interface AtlasRevenueData {
  amount_cents: number;
  currency: string;
  revenue_type: string;
  recognized_at?: string;
  offer_external_id?: string;
}

export interface AtlasEvent {
  event_id: string;
  event_type: AtlasEventType;
  occurred_at: string;
  source_system: "global_assist";
  lead_external_id: string;
  attribution?: AtlasAttribution;
  data: AtlasIntakeData | AtlasOfferData | AtlasRevenueData;
}

export type AtlasSendResult =
  | { delivered: true; status: number; duplicate: boolean }
  | { delivered: false; reason: string; status?: number };

const MAX_ATTEMPTS = 4;
const BASE_BACKOFF_MS = 300;
const REQUEST_TIMEOUT_MS = 5000;

export function signPayload(rawBody: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`;
}

/**
 * The only attribution keys ever forwarded. Attribution originates from an
 * untrusted client body, so this is an allow-list rather than a value filter:
 * unknown keys would otherwise ride through and draw a non-retryable 422.
 */
const ATTRIBUTION_KEYS = [
  "source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

/** Allow-lists known keys and drops empty ones so absent UTMs are not sent as "". */
function compactAttribution(attribution: AtlasAttribution): AtlasAttribution {
  const source = attribution as unknown as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) out[key] = value;
  }
  return out as unknown as AtlasAttribution;
}

/**
 * Derives a stable event_id from an event's logical identity.
 *
 * A random id per call is only idempotent for retries inside a single
 * sendAtlasEvent loop; a timeout, cold retry, double submit, or manual replay
 * would mint a new id and the receiver would create a duplicate record. Same
 * logical event must therefore always hash to the same id.
 *
 * The receiver validates event_id as a UUID, so a raw hex digest is rejected
 * with a non-retryable 422 — the digest is shaped into an RFC 4122 v5 layout.
 */
export function deterministicEventId(parts: string[]): string {
  const digest = createHash("sha256").update(parts.join("|"), "utf8").digest("hex");
  const nibbles = digest.slice(0, 32).split("");
  nibbles[12] = "5";
  nibbles[16] = ((parseInt(nibbles[16], 16) & 0x3) | 0x8).toString(16);
  const h = nibbles.join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/**
 * eventId and occurredAt are required, deliberately. A `?? randomUUID()` or
 * `?? new Date()` default would produce a different value on every call for
 * the same logical event, which is exactly the duplicate-record bug this
 * contract's dedupe is meant to prevent. Callers must supply stable values.
 */
export function buildEvent(input: {
  eventType: AtlasEventType;
  leadExternalId: string;
  data: AtlasIntakeData | AtlasOfferData | AtlasRevenueData;
  eventId: string;
  occurredAt: string;
  attribution?: AtlasAttribution;
}): AtlasEvent {
  const event: AtlasEvent = {
    event_id: input.eventId,
    event_type: input.eventType,
    occurred_at: input.occurredAt,
    source_system: "global_assist",
    lead_external_id: input.leadExternalId,
    data: input.data,
  };
  if (input.attribution) {
    event.attribution = compactAttribution(input.attribution);
  }
  return event;
}

/**
 * Delivers one event. The same event_id is reused across retries, so the
 * receiver dedupes a retried delivery into 200 {"status":"duplicate"} rather
 * than creating a second record.
 */
export async function sendAtlasEvent(event: AtlasEvent): Promise<AtlasSendResult> {
  const endpoint = process.env.CRM_INGESTION_ENDPOINT;
  const secret = process.env.HOLDINGS_INGESTION_SECRET;

  if (!endpoint || !secret) {
    return { delivered: false, reason: "not_configured" };
  }

  // Sign the exact bytes that are sent; re-serializing before fetch would risk
  // a different key order and a signature the receiver cannot verify.
  const rawBody = JSON.stringify(event);
  const signature = signPayload(rawBody, secret);

  let lastStatus: number | undefined;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, BASE_BACKOFF_MS * 2 ** (attempt - 1)));
    }

    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tanta-Signature": signature,
        },
        body: rawBody,
        signal: abort.signal,
      });

      lastStatus = res.status;

      if (res.ok) {
        const parsed = (await res.json().catch(() => null)) as { status?: string } | null;
        return { delivered: true, status: res.status, duplicate: parsed?.status === "duplicate" };
      }

      // Auth failure and schema rejection are terminal — retrying cannot fix either.
      if (res.status === 401 || res.status === 422) {
        console.error(
          `Atlas ingestion rejected ${event.event_type} (${res.status}); not retrying`
        );
        return { delivered: false, reason: "rejected", status: res.status };
      }

      if (res.status < 500) {
        console.error(`Atlas ingestion returned ${res.status} for ${event.event_type}`);
        return { delivered: false, reason: "client_error", status: res.status };
      }

      console.error(
        `Atlas ingestion ${res.status} for ${event.event_type}, attempt ${attempt + 1}/${MAX_ATTEMPTS}`
      );
    } catch (err) {
      console.error(
        `Atlas ingestion request failed for ${event.event_type}, attempt ${attempt + 1}/${MAX_ATTEMPTS}:`,
        err instanceof Error ? err.message : err
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  return { delivered: false, reason: "exhausted_retries", status: lastStatus };
}

/**
 * Event 1 — must arrive before any offer or revenue event for this employer.
 * One intake per employer, so the employer id alone is the stable identity.
 * Pass the lead row's created_at as occurredAt so a replay reuses it.
 */
export function sendEmployerIntake(input: {
  employerId: string;
  attribution: AtlasAttribution;
  data: AtlasIntakeData;
  occurredAt: string;
  eventId?: string;
}): Promise<AtlasSendResult> {
  return sendAtlasEvent(
    buildEvent({
      eventType: "employer.intake_received",
      leadExternalId: input.employerId,
      attribution: input.attribution,
      data: input.data,
      occurredAt: input.occurredAt,
      eventId:
        input.eventId ??
        deterministicEventId(["global_assist", "employer.intake_received", input.employerId]),
    })
  );
}

/** Event 2 — requires the employer intake event to have landed first. */
export function sendPlacementOfferCreated(input: {
  employerId: string;
  data: AtlasOfferData;
  occurredAt: string;
  eventId?: string;
}): Promise<AtlasSendResult> {
  return sendAtlasEvent(
    buildEvent({
      eventType: "placement.offer_created",
      leadExternalId: input.employerId,
      data: input.data,
      occurredAt: input.occurredAt,
      eventId:
        input.eventId ??
        deterministicEventId([
          "global_assist",
          "placement.offer_created",
          input.employerId,
          input.data.offer_external_id,
        ]),
    })
  );
}

/**
 * Event 3 — include offer_external_id whenever the revenue traces to an offer.
 *
 * An employer can legitimately have several revenue events, so the identity
 * includes the offer, type, recognition date, and amount. Keying on employer
 * alone would make a second payment hash to the first one's id and be silently
 * discarded as a duplicate — lost revenue. Pass eventId explicitly if the
 * source system has its own stable transaction id.
 */
export function sendPlacementRevenueRecorded(input: {
  employerId: string;
  data: AtlasRevenueData;
  occurredAt: string;
  eventId?: string;
}): Promise<AtlasSendResult> {
  return sendAtlasEvent(
    buildEvent({
      eventType: "placement.revenue_recorded",
      leadExternalId: input.employerId,
      data: input.data,
      occurredAt: input.occurredAt,
      eventId:
        input.eventId ??
        deterministicEventId([
          "global_assist",
          "placement.revenue_recorded",
          input.employerId,
          input.data.offer_external_id ?? "",
          input.data.revenue_type,
          input.data.recognized_at ?? "",
          String(input.data.amount_cents),
        ]),
    })
  );
}
