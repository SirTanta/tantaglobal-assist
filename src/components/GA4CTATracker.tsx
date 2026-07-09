"use client";

import { useEffect } from "react";
import { ga4Event } from "@/lib/analytics";

/**
 * GA4CTATracker — mounts once in RootLayout and observes all CTA clicks via event delegation.
 *
 * Usage — add data-ga4-action (required) and optional tracking attributes to any clickable element:
 *   <a href="/hire" data-ga4-action="click_cta__global_assist__home"
 *      data-ga4-label="Hire a VA"
 *      data-ga4-destination="/hire"
 *      data-ga4-zone="Z1"
 *      data-ga4-page-type="HOME"
 *      data-ga4-ia-level="1"
 *      data-ga4-element-type="button"
 *      className="instr-btn-primary">
 *     Hire a VA
 *   </a>
 *
 * Every CTA on the site should be instrumented. The Tracker fires the event on click
 * and the browser's default navigation proceeds normally.
 */
export default function GA4CTATracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as Element).closest("[data-ga4-action]");
      if (!target) return;
      const action = target.getAttribute("data-ga4-action");
      if (!action) return;

      const params: Record<string, unknown> = {};
      const label = target.getAttribute("data-ga4-label");
      if (label) params.cta_label = label;
      const destination = target.getAttribute("data-ga4-destination");
      if (destination) params.cta_destination = destination;
      const zone = target.getAttribute("data-ga4-zone");
      if (zone) params.cta_zone = zone;
      const pageType = target.getAttribute("data-ga4-page-type");
      if (pageType) params.page_type = pageType;
      const iaLevel = target.getAttribute("data-ga4-ia-level");
      if (iaLevel) params.ia_level = Number(iaLevel);
      const elementType = target.getAttribute("data-ga4-element-type");
      if (elementType) params.element_type = elementType;

      ga4Event(action, Object.keys(params).length > 0 ? params : undefined);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
