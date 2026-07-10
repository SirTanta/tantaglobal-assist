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
