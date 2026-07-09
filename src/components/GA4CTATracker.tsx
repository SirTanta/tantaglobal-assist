"use client";

import { useEffect } from "react";
import { ga4Event } from "@/lib/analytics";

/**
 * GA4CTATracker — mounts once in RootLayout and observes all CTA clicks via event delegation.
 *
 * Usage — add data-ga4-action (required) and data-ga4-label (optional) to any clickable element:
 *   <a href="/hire" data-ga4-action="cta_hire_click" data-ga4-label="homepage" className="instr-btn-primary">
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
      const label = target.getAttribute("data-ga4-label") ?? undefined;
      if (action) {
        ga4Event(action, label ? { event_label: label } : undefined);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
