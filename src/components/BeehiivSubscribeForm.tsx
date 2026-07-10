"use client";

import { useId, useState, FormEvent } from "react";

interface Props {
  variant?: "inline" | "card" | "footer";
  placeholder?: string;
  buttonLabel?: string;
}

export default function BeehiivSubscribeForm({
  variant = "inline",
  placeholder = "your@email.com",
  buttonLabel = "Subscribe Free",
}: Props) {
  const inputId = useId();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    if (!email) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/beehiiv/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source_site: "tantaglobal.com",
          subscriber_role: "visitor",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're in — check your inbox.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="font-sans text-sm text-instruments-vellum/70">
        You&apos;re on the list — thanks.
      </p>
    );
  }

  if (variant === "footer") {
    return (
      <form method="post" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2" noValidate>
        <input
          id={`${inputId}-footer`}
          type="email"
          name="email"
          placeholder={placeholder}
          required
          disabled={status === "loading"}
          className="flex-1 min-w-0 rounded-full px-4 py-2 text-xs font-sans bg-instruments-ink text-instruments-vellum placeholder:text-instruments-vellum/30 border border-instruments-vellum/10 focus:outline-none focus:border-instruments-gold/60 transition-colors disabled:opacity-50"
          style={{ backgroundColor: "rgba(7,20,32,0.6)" }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-full px-5 py-2 text-xs font-sans font-semibold text-instruments-ink bg-instruments-gold hover:bg-instruments-gold-bright transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "..." : buttonLabel}
        </button>
        {status === "error" && (
          <p className="text-red-400 text-xs mt-1 sm:mt-0">{message}</p>
        )}
      </form>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-instruments-vellum/10 bg-instruments-forest/20 p-6 max-w-sm">
        <form method="post" onSubmit={handleSubmit} className="space-y-2.5">
          <input
            id={`${inputId}-card`}
            type="email"
            name="email"
            placeholder={placeholder}
            required
            disabled={status === "loading"}
            className="w-full rounded-full px-4 py-2 text-xs font-sans bg-instruments-ink/60 text-instruments-vellum placeholder:text-instruments-vellum/30 border border-instruments-vellum/10 focus:outline-none focus:border-instruments-gold/60 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full text-xs font-semibold text-instruments-ink bg-instruments-gold hover:bg-instruments-gold-bright transition-colors disabled:opacity-60 py-2"
          >
            {status === "loading" ? "Subscribing..." : buttonLabel}
          </button>
          {status === "error" && (
            <p className="text-red-400 text-xs">{message}</p>
          )}
        </form>
        <p className="text-instruments-vellum/20 text-[10px] mt-2.5">
          Free. No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Inline variant
  return (
    <form method="post" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        id={`${inputId}-inline`}
        type="email"
        name="email"
        placeholder={placeholder}
        required
        disabled={status === "loading"}
        className="flex-1 min-w-0 rounded-full px-4 py-2 text-xs font-sans bg-instruments-ink/60 text-instruments-vellum placeholder:text-instruments-vellum/30 border border-instruments-vellum/10 focus:outline-none focus:border-instruments-gold/60 transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full px-5 py-2 text-xs font-sans font-semibold text-instruments-ink bg-instruments-gold hover:bg-instruments-gold-bright transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "..." : buttonLabel}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-xs">{message}</p>
      )}
    </form>
  );
}
