import { createHmac, randomUUID } from "node:crypto";

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

/** Drops undefined/empty attribution fields so absent UTMs are not sent as empty strings. */
function compactAttribution(attribution: AtlasAttribution): AtlasAttribution {
  const entries = Object.entries(attribution).filter(
    ([, value]) => typeof value === "string" && value.length > 0
  );
  return Object.fromEntries(entries) as unknown as AtlasAttribution;
}

export function buildEvent(input: {
  eventType: AtlasEventType;
  leadExternalId: string;
  data: AtlasIntakeData | AtlasOfferData | AtlasRevenueData;
  attribution?: AtlasAttribution;
  eventId?: string;
  occurredAt?: string;
}): AtlasEvent {
  const event: AtlasEvent = {
    event_id: input.eventId ?? randomUUID(),
    event_type: input.eventType,
    occurred_at: input.occurredAt ?? new Date().toISOString(),
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

/** Event 1 — must arrive before any offer or revenue event for this employer. */
export function sendEmployerIntake(input: {
  employerId: string;
  attribution: AtlasAttribution;
  data: AtlasIntakeData;
  eventId?: string;
}): Promise<AtlasSendResult> {
  return sendAtlasEvent(
    buildEvent({
      eventType: "employer.intake_received",
      leadExternalId: input.employerId,
      attribution: input.attribution,
      data: input.data,
      eventId: input.eventId,
    })
  );
}

/** Event 2 — requires the employer intake event to have landed first. */
export function sendPlacementOfferCreated(input: {
  employerId: string;
  data: AtlasOfferData;
  eventId?: string;
}): Promise<AtlasSendResult> {
  return sendAtlasEvent(
    buildEvent({
      eventType: "placement.offer_created",
      leadExternalId: input.employerId,
      data: input.data,
      eventId: input.eventId,
    })
  );
}

/** Event 3 — include offer_external_id whenever the revenue traces to an offer. */
export function sendPlacementRevenueRecorded(input: {
  employerId: string;
  data: AtlasRevenueData;
  eventId?: string;
}): Promise<AtlasSendResult> {
  return sendAtlasEvent(
    buildEvent({
      eventType: "placement.revenue_recorded",
      leadExternalId: input.employerId,
      data: input.data,
      eventId: input.eventId,
    })
  );
}
