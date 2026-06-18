"use client";

import { useState, useRef } from "react";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  errorMessage: string;
}

const inputClass =
  "rounded-lg px-4 py-3 text-sm border w-full transition-colors focus:outline-none focus:ring-2";
const inputStyle = {
  borderColor: "#cbd5e1",
  backgroundColor: "#F5FAFA",
  color: "#2D3748",
};
const inputFocusRing = "focus:ring-[#0D5C63] focus:border-[#0D5C63]";

const labelClass = "text-sm font-semibold block mb-1.5";
const labelStyle = { color: "#2D3748" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [state, setState] = useState<FormState>({
    status: "idle",
    errorMessage: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: (data.get("name") as string).trim(),
      email: (data.get("email") as string).trim(),
      message: (data.get("message") as string).trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setState({ status: "error", errorMessage: "Please fill in all required fields." });
      return;
    }

    if (!EMAIL_RE.test(payload.email)) {
      setState({ status: "error", errorMessage: "Please enter a valid email address." });
      return;
    }

    setState({ status: "submitting", errorMessage: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          (json as { error?: string }).error || "Submission failed. Please try again."
        );
      }

      setState({ status: "success", errorMessage: "" });
      formRef.current?.reset();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or email hello@tantaglobal.com.";
      setState({ status: "error", errorMessage: msg });
    }
  }

  if (state.status === "success") {
    return (
      <div
        className="rounded-xl px-8 py-10 text-center"
        style={{ backgroundColor: "#E0F5F5", border: "1px solid rgba(13,92,99,0.25)" }}
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#0D5C63" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "#0D5C63" }}>
          Thanks — your message is on its way.
        </h3>
        <p className="text-sm" style={{ color: "#2D3748" }}>
          We&apos;ll get back to you shortly at the email you provided.
        </p>
      </div>
    );
  }

  const isSubmitting = state.status === "submitting";

  return (
    <form method="post"
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} style={labelStyle} htmlFor="contact-name">
            Name <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            disabled={isSubmitting}
            className={`${inputClass} ${inputFocusRing}`}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={labelStyle} htmlFor="contact-email">
            Email <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={isSubmitting}
            className={`${inputClass} ${inputFocusRing}`}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle} htmlFor="contact-message">
          Message <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="What can we help you with?"
          required
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing} resize-none`}
          style={inputStyle}
        />
      </div>

      {state.status === "error" && (
        <div
          className="rounded-lg px-5 py-4 text-sm"
          style={{
            backgroundColor: "#fff5f5",
            border: "1px solid rgba(229,62,62,0.3)",
            color: "#c53030",
          }}
        >
          {state.errorMessage}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary self-start disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        <p className="text-xs mt-3" style={{ color: "#94a3b8" }}>
          Prefer email? Reach us directly at{" "}
          <a href="mailto:hello@tantaglobal.com" style={{ color: "#0D5C63" }}>
            hello@tantaglobal.com
          </a>
          .
        </p>
      </div>
    </form>
  );
}
