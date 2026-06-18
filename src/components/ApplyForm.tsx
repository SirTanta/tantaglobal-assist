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

export default function ApplyForm() {
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
      full_name: (data.get("full_name") as string).trim(),
      email: (data.get("email") as string).trim(),
      phone: ((data.get("phone") as string) ?? "").trim(),
      location: ((data.get("location") as string) ?? "").trim(),
      years_experience: ((data.get("years_experience") as string) ?? "").trim(),
      skills: ((data.get("skills") as string) ?? "").trim(),
      availability: ((data.get("availability") as string) ?? "").trim(),
      message: ((data.get("message") as string) ?? "").trim(),
    };

    // Guard — required fields
    if (!payload.full_name || !payload.email) {
      setState({ status: "error", errorMessage: "Please fill in all required fields." });
      return;
    }

    // Client-side email format check
    if (!EMAIL_RE.test(payload.email)) {
      setState({ status: "error", errorMessage: "Please enter a valid email address." });
      return;
    }

    setState({ status: "submitting", errorMessage: "" });

    try {
      const res = await fetch("/api/apply", {
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
          : "Something went wrong. Please try again or email apply@tantaglobal.com.";
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
          Your application has been received.
        </h3>
        <p className="text-sm" style={{ color: "#2D3748" }}>
          We&apos;ll be in touch within 3 business days.
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
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* Full name */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="full_name">
          Full Name <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="Jane Smith"
          required
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* Email */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="email">
          Email Address <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="jane@example.com"
          required
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="phone">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+1 (505) 000-0000"
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* Location */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="location">
          Location (City, Country)
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Manila, Philippines"
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* Years experience */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="years_experience">
          Years of Experience
        </label>
        <select
          id="years_experience"
          name="years_experience"
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={{ ...inputStyle, appearance: "auto" }}
        >
          <option value="">Select...</option>
          <option value="less-than-1">Less than 1 year</option>
          <option value="1-2">1-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5+">5+ years</option>
        </select>
      </div>

      {/* Availability */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="availability">
          Availability
        </label>
        <select
          id="availability"
          name="availability"
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={{ ...inputStyle, appearance: "auto" }}
        >
          <option value="">Select...</option>
          <option value="part-time">Part-time (under 20hrs/wk)</option>
          <option value="full-time">Full-time (20-40hrs/wk)</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>

      {/* Skills */}
      <div className="md:col-span-2">
        <label className={labelClass} style={labelStyle} htmlFor="skills">
          Skills &amp; Experience (VA work, tools, industries)
        </label>
        <textarea
          id="skills"
          name="skills"
          rows={4}
          placeholder="List your VA skills, tools you're proficient in (e.g. Asana, HubSpot, Canva), and any industries you've worked in..."
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing} resize-none`}
          style={inputStyle}
        />
      </div>

      {/* Message */}
      <div className="md:col-span-2">
        <label className={labelClass} style={labelStyle} htmlFor="message">
          Anything else you&apos;d like us to know
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Share anything else relevant — your goals, work history highlights, or questions for us..."
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing} resize-none`}
          style={inputStyle}
        />
      </div>

      {/* Error message */}
      {state.status === "error" && (
        <div
          className="md:col-span-2 rounded-lg px-5 py-4 text-sm"
          style={{
            backgroundColor: "#fff5f5",
            border: "1px solid rgba(229,62,62,0.3)",
            color: "#c53030",
          }}
        >
          {state.errorMessage}
        </div>
      )}

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#0D5C63" }}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
        <p className="text-xs mt-3" style={{ color: "#64748b" }}>
          Required fields marked <span style={{ color: "#e53e3e" }}>*</span>. We respond within 3
          business days.
        </p>
      </div>
    </form>
  );
}
