import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact TantaGlobal Assist",
  description:
    "Get in touch with TantaGlobal Assist. Questions about hiring, applying, or the placement process.",
};

export default function ContactPage() {
  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#F5FAFA" }}
        className="py-20"
      >
        <div className="section-container">
          <span className="teal-accent" />
          <h1 className="mb-6 max-w-2xl">Contact Us</h1>
          <p className="text-xl max-w-xl" style={{ color: "#64748b" }}>
            Have a question about hiring, the application process, or something
            else? Reach out directly.
          </p>
        </div>
      </section>

      {/* ── Contact options ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5FAFA" }} className="py-20">
        <div className="section-container max-w-3xl">
          {/* Quick contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <div className="card">
              <span className="teal-accent" />
              <h3 className="text-lg mb-2">Employers</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748b" }}>
                Questions about placement, the candidate pipeline, or getting
                started? Email our employer team.
              </p>
              <a
                href="mailto:hire@tantaglobal.com"
                style={{ color: "#0D5C63" }}
                className="text-sm font-semibold hover:underline"
              >
                hire@tantaglobal.com
              </a>
            </div>
            <div className="card">
              <span
                className="block h-1 w-12 rounded-full mb-4"
                style={{ backgroundColor: "#D4AF37" }}
              />
              <h3 className="text-lg mb-2">VA Candidates</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748b" }}>
                Questions about the application or training process? Reach the
                candidate team here.
              </p>
              <a
                href="mailto:apply@tantaglobal.com"
                style={{ color: "#0D5C63" }}
                className="text-sm font-semibold hover:underline"
              >
                apply@tantaglobal.com
              </a>
            </div>
          </div>

          {/* General contact form */}
          <div
            className="rounded-2xl p-10 md:p-14"
            style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1" }}
          >
            <h2 className="mb-2">Send a message</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              General inquiries, partnerships, or anything that does not fit
              the categories above.
            </p>

            <form
              action="mailto:hello@tantaglobal.com"
              method="GET"
              encType="text/plain"
              className="flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-semibold"
                    style={{ color: "#2D3748" }}
                    htmlFor="contact-name"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="rounded-lg px-4 py-3 text-sm border focus:outline-none"
                    style={{
                      borderColor: "#cbd5e1",
                      backgroundColor: "#F5FAFA",
                      color: "#2D3748",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-semibold"
                    style={{ color: "#2D3748" }}
                    htmlFor="contact-email"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="rounded-lg px-4 py-3 text-sm border focus:outline-none"
                    style={{
                      borderColor: "#cbd5e1",
                      backgroundColor: "#F5FAFA",
                      color: "#2D3748",
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold"
                  style={{ color: "#2D3748" }}
                  htmlFor="contact-message"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="body"
                  rows={5}
                  required
                  placeholder="What can we help you with?"
                  className="rounded-lg px-4 py-3 text-sm border resize-none focus:outline-none"
                  style={{
                    borderColor: "#cbd5e1",
                    backgroundColor: "#F5FAFA",
                    color: "#2D3748",
                  }}
                />
              </div>
              <button type="submit" className="btn-primary self-start">
                Send Message
              </button>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                This form opens your email client. Alternatively, email{" "}
                <a
                  href="mailto:hello@tantaglobal.com"
                  style={{ color: "#0D5C63" }}
                >
                  hello@tantaglobal.com
                </a>{" "}
                directly.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
