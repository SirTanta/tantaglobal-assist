export const PUBLIC_ASSISTANT_FAILURE_COPY =
  "The placement guide is temporarily unavailable. The rest of this page is still available.";

/**
 * A Vercel runtime identity token is not a public AI Gateway credential.
 * Treating it as one sent visitors into an upstream connection failure instead
 * of the deterministic, source-backed Tala fallback.
 */
export function hasPublicAssistantGateway(env: { AI_GATEWAY_API_KEY?: string | undefined }): boolean {
  return typeof env.AI_GATEWAY_API_KEY === "string" && env.AI_GATEWAY_API_KEY.trim().length > 0;
}

export function shouldClosePublicAssistant(open: boolean, key: string): boolean {
  return open && key === "Escape";
}

export function canRetryPublicAssistant(status: string): boolean {
  return status === "ready";
}
