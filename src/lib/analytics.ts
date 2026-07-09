/**
 * GA4 analytics helpers for tantaglobal.com
 *
 * Safe to call even when gtag is not loaded (NEXT_PUBLIC_GA_ID unset) —
 * silently no-ops.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

/**
 * Fire a generic GA4 event.
 */
export function ga4Event(name: string, params?: Record<string, unknown>) {
  gtag("event", name, params);
}

/**
 * Fire a GA4 conversion event.
 */
export function ga4Conversion(params?: Record<string, unknown>) {
  gtag("event", "conversion", params);
}
