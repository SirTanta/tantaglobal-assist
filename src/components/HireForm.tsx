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

export default function HireForm() {
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
      employer_name: (data.get("employer_name") as string).trim(),
      company_name: (data.get("company_name") as string).trim(),
      email: (data.get("email") as string).trim(),
      phone: ((data.get("phone") as string) ?? "").trim(),
      website: ((data.get("website") as string) ?? "").trim(),
      va_role: ((data.get("va_role") as string) ?? "").trim(),
      hours_per_week: ((data.get("hours_per_week") as string) ?? "").trim(),
      budget: ((data.get("budget") as string) ?? "").trim(),
      start_date: ((data.get("start_date") as string) ?? "").trim(),
      message: ((data.get("message") as string) ?? "").trim(),
    };

    // Guard — required fields
    if (!payload.employer_name || !payload.company_name || !payload.email) {
      setState({ status: "error", errorMessage: "Please fill in all required fields." });
      return;
    }

    // Client-side email format check (noValidate is set on the form)
    if (!EMAIL_RE.test(payload.email)) {
      setState({ status: "error", errorMessage: "Please enter a valid email address." });
      return;
    }

    setState({ status: "submitting", errorMessage: "" });

    try {
      const res = await fetch("/api/hire", {
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
          : "Something went wrong. Please try again or email hire@tantaglobal.com.";
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
          We received your request.
        </h3>
        <p className="text-sm" style={{ color: "#2D3748" }}>
          Our team will review your requirements and follow up within 1 business day. Check your
          inbox at the email you provided.
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
      {/* Employer name */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="employer_name">
          Your full name <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <input
          id="employer_name"
          name="employer_name"
          type="text"
          placeholder="Jane Smith"
          required
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* Company name */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="company_name">
          Company <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <input
          id="company_name"
          name="company_name"
          type="text"
          placeholder="Acme Inc."
          required
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* Email */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="email">
          Work email <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="jane@company.com"
          required
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="phone">
          Phone
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

      {/* Website */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="website">
          Company website
        </label>
        <input
          id="website"
          name="website"
          type="url"
          placeholder="https://yourcompany.com"
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* VA role */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="va_role">
          VA role needed
        </label>
        <input
          id="va_role"
          name="va_role"
          type="text"
          placeholder="Executive VA, Social Media VA, etc."
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>

      {/* Hours per week */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="hours_per_week">
          Hours per week
        </label>
        <select
          id="hours_per_week"
          name="hours_per_week"
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={{ ...inputStyle, appearance: "auto" }}
        >
          <option value="">Select...</option>
          <option value="10-20">10 to 20 hours</option>
          <option value="20-30">20 to 30 hours</option>
          <option value="30-40">30 to 40 hours</option>
          <option value="40+">Full time (40+)</option>
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="budget">
          Monthly budget
        </label>
        <select
          id="budget"
          name="budget"
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing}`}
          style={{ ...inputStyle, appearance: "auto" }}
        >
          <option value="">Select...</option>
          <option value="under-500">Under $500 / mo</option>
          <option value="500-1000">$500 to $1,000 / mo</option>
          <option value="1000-2000">$1,000 to $2,000 / mo</option>
          <option value="2000+">$2,000+ / mo</option>
        </select>
      </div>

      {/* Start date */}
      <div className="md:col-span-2">
        <label className={labelClass} style={labelStyle} htmlFor="start_date">
          Target start date
        </label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          disabled={isSubmitting}
          className={`${inputClass} ${inputFocusRing} md:max-w-xs`}
          style={inputStyle}
        />
      </div>

      {/* Message */}
      <div className="md:col-span-2">
        <label className={labelClass} style={labelStyle} htmlFor="message">
          Role details and requirements
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Describe the role, key responsibilities, tools you use, and what success looks like in the first 90 days..."
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
          {isSubmitting ? "Submitting..." : "Submit your requirements"}
        </button>
        <p className="text-xs mt-3" style={{ color: "#64748b" }}>
          Required fields marked <span style={{ color: "#e53e3e" }}>*</span>. We respond within 1
          business day.
        </p>
      </div>
    </form>
  );
}
