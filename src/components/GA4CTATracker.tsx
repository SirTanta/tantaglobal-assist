"use client";

import { useEffect } from "react";
import { ga4Event } from "@/lib/analytics";

/**
 * GA4CTATracker — mounts once in RootLayout and observes all CTA clicks.
 *
 * Uses event delegation so any element with [data-ga4-action] fires the
 * corresponding GA4 event automatically. No per-element onClick needed.
 *
 * Canonical event format:
 *   data-ga4-action  → event name (e.g. "click_cta__assist__home")
 *   data-ga4-label   → cta_label  (button text or aria-label)
 *   data-ga4-zone    → cta_zone   (Z1–Z8 from IA map)
 *   data-ga4-page    → page_type  (HOME / SECTION / FORM / etc.)
 *
 * Usage:
 *   <a href="/contact"
 *      data-ga4-action="click_cta__assist__contact"
 *      data-ga4-label="Get in Touch"
 *      data-ga4-zone="Z5"
 *      data-ga4-page="SECTION"
 *      className="btn-primary">
 *     Get in Touch
 *   </a>
 */
export default function GA4CTATracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as Element).closest("[data-ga4-action]");
      if (!target) return;
      const action = target.getAttribute("data-ga4-action");
      if (!action) return;

      const label     = target.getAttribute("data-ga4-label") ?? undefined;
      const zone      = target.getAttribute("data-ga4-zone") ?? undefined;
      const pageType  = target.getAttribute("data-ga4-page") ?? undefined;
      const dest      = (target as HTMLAnchorElement).href ?? undefined;

      const params: Record<string, unknown> = {};
      if (label)    params.cta_label      = label;
      if (zone)     params.cta_zone       = zone;
      if (pageType) params.page_type     = pageType;
      if (dest)     params.cta_destination = dest;

      ga4Event(action, Object.keys(params).length > 0 ? params : undefined);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
