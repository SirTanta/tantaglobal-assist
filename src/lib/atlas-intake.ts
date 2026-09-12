import { createHmac } from "node:crypto";

/**
 * Atlas Fleet Ticketing Bridge intake sender (server-only).
 *
 * Posts a new unclaimed `intake` row to the Fleet Ticketing Bridge
 *   POST {ATLAS_FLEET_TICKETING_BRIDGE_URL}/api/integrations/tanta-holdings/9ba4b462-153b-45f9-8f62-2656caaa76ad/intake
 * signed with HMAC-SHA256 over the exact raw body
 *   header `x-atlas-signature: sha256=<hex>`
 * using ATLAS_FLEET_TICKETING_BRIDGE_SECRET.
 *
 * Per the wiki SOP at docs/business/bizdev.md (commit f6840f8), the VA
 * Placement intake (`tantaglobal.com/api/hire`) posts to this route, not to
 * the deprecated `automation-hub:4020/va-intake` HubSpot webhook. The intake
 * route can only create a new unclaimed `intake` row; it cannot claim,
 * transition, or release (Raphael-only lifecycle credential boundary).
 *
 * Import this module only from route handlers. Reads the FTB secret and URL
 * from the server environment at call time.
 */

// Strict enum matching the server-side `atlasAgentIntakeSchema` (see
// docs/procedures/holo-atlas-intake-workflow.md for the field-level contract;
// values must align with active `tenant_revenue_lanes` slugs).
export type AtlasIntakeCompanyScope =
  | "holdings"
  | "assist"
  | "academy"
  | "visa"
  | "pulse"
  | "global";

export type AtlasIntakePriorityWave =
  | "p0_control"
  | "p1_dependency_ready"
  | "p2_standard"
  | "p3_backlog";

export type AtlasIntakeDocumentationImpact = "not_applicable" | "required";

/**
 * The payload shape consumed by the Fleet Ticketing Bridge intake route. All
 * keys are server-emitted — no caller-supplied `status` (the route hard-codes
 * `status: "intake"` on insert; an unknown field there would be rejected as
 * a schema mismatch).
 */
export interface AtlasIntakePayload {
  company_scope: AtlasIntakeCompanyScope;
  department: string;
  exact_target: string;
  concise_subject: string;
  operator_description: string;
  intended_outcome: string;
  requester: string;
  source_authority: string;
  request_type: string;
  allowed_action_boundary: string;
  prohibited_action_boundary: string;
  execution_acceptance: string;
  approval_requirement: string;
  idempotency_key: string;
  priority_wave?: AtlasIntakePriorityWave;
  documentation_impact?: AtlasIntakeDocumentationImpact;
  wiki_target_canonical_url?: string;
  wiki_target_revision_sha256?: string;
  source_snapshot_sha256?: string;
  source_record_id?: string;
}

export type AtlasIntakeSendResult =
  | { delivered: true; status: number; duplicate: boolean }
  | { delivered: false; reason: string; status?: number };

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Sign the raw body bytes with HMAC-SHA256. The signature is computed over
 * the exact bytes that are sent; re-serializing before fetch would risk a
 * different key order and a signature the receiver cannot verify.
 */
export function signIntakePayload(rawBody: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`;
}

/**
 * Hard-coded tenant + integration source for tantaglobal-assist. The
 * canonical constants come from the wiki SOP at f6840f8; do not parameterize.
 */
export const ATLAS_INTAKE_TENANT = "tanta-holdings";
export const ATLAS_INTAKE_SOURCE_ID = "9ba4b462-153b-45f9-8f62-2656caaa76ad";
export const ATLAS_INTAKE_PATH = "/api/integrations/tanta-holdings/9ba4b462-153b-45f9-8f62-2656caaa76ad/intake";

/**
 * Post one intake payload to the Fleet Ticketing Bridge. Failures are
 * surfaced as a result; this function does not throw so the surrounding
 * route handler can decide how to surface a failed intake.
 *
 * `not_configured` means the secret or URL is missing in the server
 * environment. The 4xx/5xx split mirrors the wiki SOP: 4xx is a payload or
 * auth rejection and is not retried by the caller; 5xx and network errors
 * could be transient but, per the intake route's contract, retries are not
 * part of the documented protocol — surface to Raphael instead.
 */
export async function sendAtlasIntake(
  payload: AtlasIntakePayload
): Promise<AtlasIntakeSendResult> {
  const baseUrl = process.env.ATLAS_FLEET_TICKETING_BRIDGE_URL;
  const secret = process.env.ATLAS_FLEET_TICKETING_BRIDGE_SECRET;

  if (!baseUrl || !secret) {
    return { delivered: false, reason: "not_configured" };
  }

  // Strip the trailing slash from the URL host before joining so that a
  // caller passing either `https://atlas.x` or `https://atlas.x/` ends up at
  // the same path.
  const url = `${baseUrl.replace(/\/+$/, "")}${ATLAS_INTAKE_PATH}`;

  const rawBody = JSON.stringify(payload);
  const signature = signIntakePayload(rawBody, secret);

  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-atlas-signature": signature,
      },
      body: rawBody,
      signal: abort.signal,
    });

    if (res.ok) {
      const parsed = (await res.json().catch(() => null)) as
        | { status?: string }
        | null;
      return {
        delivered: true,
        status: res.status,
        duplicate: parsed?.status === "duplicate",
      };
    }

    console.error(
      `Atlas intake route returned ${res.status} for idempotency_key=${payload.idempotency_key}`
    );

    if (res.status >= 400 && res.status < 500) {
      // Auth or schema rejection — retrying will not help. The intake route
      // is strict-schema; unknown fields and missing required fields land
      // here. The wrapper's contract is fail-loud, not retry.
      return { delivered: false, reason: "rejected", status: res.status };
    }
    return { delivered: false, reason: "server_error", status: res.status };
  } catch (err) {
    console.error(
      `Atlas intake request failed for idempotency_key=${payload.idempotency_key}:`,
      err instanceof Error ? err.message : err
    );
    return { delivered: false, reason: "network_error" };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Build a deterministic idempotency key for the VA Placement intake path.
 * Same employer id → same key, so a retry or a double-submit lands on the
 * existing intake row instead of creating a second one.
 *
 * 16+ chars per the intake contract; format: `va-intake-<scope>-<YYYYMMDD>-<id>`.
 */
export function buildEmployerIntakeIdempotencyKey(
  employerId: string,
  companyScope: AtlasIntakeCompanyScope = "assist",
  now: Date = new Date()
): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `va-intake-${companyScope}-${y}${m}${d}-${employerId}`;
}