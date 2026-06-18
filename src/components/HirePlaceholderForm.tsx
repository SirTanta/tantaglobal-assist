"use client";

export default function HirePlaceholderForm() {
  return (
    <form method="post"
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold"
          style={{ color: "#2D3748" }}
          htmlFor="first-name"
        >
          First name
        </label>
        <input
          id="first-name"
          type="text"
          placeholder="Jane"
          className="rounded-lg px-4 py-3 text-sm border"
          style={{
            borderColor: "#cbd5e1",
            outline: "none",
            backgroundColor: "#F5FAFA",
            color: "#2D3748",
          }}
          disabled
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold"
          style={{ color: "#2D3748" }}
          htmlFor="last-name"
        >
          Last name
        </label>
        <input
          id="last-name"
          type="text"
          placeholder="Smith"
          className="rounded-lg px-4 py-3 text-sm border"
          style={{
            borderColor: "#cbd5e1",
            outline: "none",
            backgroundColor: "#F5FAFA",
            color: "#2D3748",
          }}
          disabled
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold"
          style={{ color: "#2D3748" }}
          htmlFor="email"
        >
          Work email
        </label>
        <input
          id="email"
          type="email"
          placeholder="jane@company.com"
          className="rounded-lg px-4 py-3 text-sm border"
          style={{
            borderColor: "#cbd5e1",
            outline: "none",
            backgroundColor: "#F5FAFA",
            color: "#2D3748",
          }}
          disabled
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold"
          style={{ color: "#2D3748" }}
          htmlFor="company"
        >
          Company
        </label>
        <input
          id="company"
          type="text"
          placeholder="Acme Inc."
          className="rounded-lg px-4 py-3 text-sm border"
          style={{
            borderColor: "#cbd5e1",
            outline: "none",
            backgroundColor: "#F5FAFA",
            color: "#2D3748",
          }}
          disabled
        />
      </div>
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label
          className="text-sm font-semibold"
          style={{ color: "#2D3748" }}
          htmlFor="role"
        >
          Role you need to fill
        </label>
        <textarea
          id="role"
          rows={4}
          placeholder="Describe the role, responsibilities, and what success looks like in the first 90 days..."
          className="rounded-lg px-4 py-3 text-sm border resize-none"
          style={{
            borderColor: "#cbd5e1",
            outline: "none",
            backgroundColor: "#F5FAFA",
            color: "#2D3748",
          }}
          disabled
        />
      </div>
      <div className="md:col-span-2">
        <div
          className="rounded-lg px-5 py-4 flex items-center gap-3"
          style={{
            backgroundColor: "#E0F5F5",
            border: "1px solid rgba(13,92,99,0.2)",
          }}
        >
          <svg
            className="w-5 h-5 shrink-0"
            style={{ color: "#0D5C63" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm" style={{ color: "#0D5C63" }}>
            <strong>Form coming soon.</strong> In the meantime, email us at{" "}
            <a
              href="mailto:hire@tantaglobal.com"
              style={{ color: "#0D5C63" }}
              className="font-semibold underline"
            >
              hire@tantaglobal.com
            </a>{" "}
            with your requirements.
          </p>
        </div>
      </div>
    </form>
  );
}
