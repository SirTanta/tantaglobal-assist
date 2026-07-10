"use client";

import { useState } from "react";
import { site } from "@/lib/seo";

interface Props {
  variant?: "footer";
}

/**
 * NewsletterSubscribeForm — minimal email capture for the footer newsletter bar.
 * Currently decorative (not wired to beehiiv/resend).
 * HubSpot wiring: when HubSpot list ID is available, set NEXT_PUBLIC_HUBSPOT_LIST_ID.
 */
export default function NewsletterSubscribeForm({ variant = "footer" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const hubspotListId = process.env.NEXT_PUBLIC_HUBSPOT_LIST_ID;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      if (hubspotListId) {
        // HubSpot API route
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, listId: hubspotListId }),
        });
        if (!res.ok) throw new Error("Subscription failed");
      } else {
        // Fallback: mailto newsletter subscription
        window.location.href = `mailto:${site.emailGeneral}?subject=Newsletter subscription&body=${encodeURIComponent(email)}`;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="font-sans text-sm text-instruments-vellum/70">
        You&apos;re on the list — thanks.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2"
      noValidate
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === "submitting"}
        className="flex-1 min-w-0 rounded-full px-4 py-2 text-xs font-sans bg-instruments-ink text-instruments-vellum placeholder:text-instruments-vellum/30 border border-instruments-vellum/10 focus:outline-none focus:border-instruments-gold/60 transition-colors"
        style={{ backgroundColor: "rgba(7,20,32,0.6)" }}
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="shrink-0 rounded-full px-5 py-2 text-xs font-sans font-semibold text-instruments-ink bg-instruments-gold hover:bg-instruments-gold-bright transition-colors disabled:opacity-60"
        style={{}}
      >
        {status === "submitting" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1 sm:mt-0 sm:absolute sm:-bottom-4">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
