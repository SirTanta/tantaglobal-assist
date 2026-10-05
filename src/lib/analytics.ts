/**
 * GA4 analytics helpers for tantaglobal.com
 *
 * Calls window.gtag if available; silently no-ops otherwise.
 */

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag(...args);
  }
}

/**
 * Fire a generic GA4 event.
 */
export function ga4Event(name: string, params?: Record<string, unknown>) {
  gtag("event", name, params);
}

/**
 * GA4 recommended lead event. Fired next to the existing custom events (which are kept), because
 * `generate_lead` is the name GA4 reporting and key-event marking understand.
 */
export function trackLead(leadType: string, params?: Record<string, unknown>) {
  ga4Event("generate_lead", { lead_type: leadType, ...params });
}
