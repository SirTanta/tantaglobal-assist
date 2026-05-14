import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Apply, Train, Get Placed",
  description:
    "The TantaGlobal Assist process: apply here, train at academy.tantaglobal.com, get placed with a vetted employer.",
};

export default function HowItWorksPage() {
  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#F5FAFA" }}
        className="py-20"
      >
        <div className="section-container">
          <span className="teal-accent" />
          <h1 className="mb-6 max-w-2xl">How It Works</h1>
          <p className="text-xl max-w-xl" style={{ color: "#64748b" }}>
            Three stages. One clear outcome: a certified VA matched with an
            employer who needed exactly that.
          </p>
        </div>
      </section>

      {/* ── Step-by-step ──────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5FAFA" }} className="py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            {/* Step 1 */}
            <div
              className="rounded-2xl p-10 flex flex-col md:flex-row gap-8"
              style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1" }}
            >
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ backgroundColor: "#0D5C63" }}
              >
                1
              </div>
              <div>
                <h2 className="text-xl mb-3">
                  Apply at TantaGlobal Assist
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: "#64748b" }}>
                  VA candidates submit an application at{" "}
                  <strong>tantaglobal.com/apply</strong>. We review for
                  communication quality, professionalism, and basic remote-work
                  readiness. This is not a job posting — it is the first gate
                  in a structured pipeline.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  Employers: you can post your open role at any point. Matching
                  happens after candidates clear certification.
                </p>
                <div className="flex gap-4 mt-5 flex-wrap">
                  <Link href="/apply" className="btn-primary text-sm">
                    Apply as VA
                  </Link>
                  <Link href="/hire" className="btn-secondary text-sm">
                    Post a role
                  </Link>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center">
              <div
                className="w-0.5 h-8 rounded-full"
                style={{ backgroundColor: "#0D5C63" }}
              />
            </div>

            {/* Step 2 — Academy link prominently featured */}
            <div
              className="rounded-2xl p-10 flex flex-col md:flex-row gap-8"
              style={{
                backgroundColor: "#E0F5F5",
                border: "1px solid rgba(13,92,99,0.25)",
              }}
            >
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ backgroundColor: "#0D5C63" }}
              >
                2
              </div>
              <div>
                <h2 className="text-xl mb-3">
                  Train at{" "}
                  <a
                    href="https://academy.tantaglobal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0D5C63" }}
                    className="hover:underline"
                  >
                    academy.tantaglobal.com
                  </a>
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: "#2D3748" }}>
                  Qualified applicants complete TGA Academy certification.
                  Training is scenario-based — real client situations, real
                  deliverables, real feedback. Not passive video watching.
                  Candidates who pass certification have proved they can perform
                  in a client-facing role.
                </p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#64748b" }}>
                  The Academy is not optional. Every VA in our placement
                  pipeline is a TGA Academy graduate. This is the standard that
                  makes our matches reliable for employers.
                </p>
                <a
                  href="https://academy.tantaglobal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm inline-flex"
                >
                  Visit TGA Academy
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center">
              <div
                className="w-0.5 h-8 rounded-full"
                style={{ backgroundColor: "#0D5C63" }}
              />
            </div>

            {/* Step 3 */}
            <div
              className="rounded-2xl p-10 flex flex-col md:flex-row gap-8"
              style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1" }}
            >
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ backgroundColor: "#0D5C63" }}
              >
                3
              </div>
              <div>
                <h2 className="text-xl mb-3">Get Placed</h2>
                <p className="leading-relaxed mb-4" style={{ color: "#64748b" }}>
                  Certified VAs enter the active placement pipeline.
                  TantaGlobal Assist matches candidates with employer roles
                  based on skill set, availability, and role fit. Employers
                  review candidates we have already screened and certified —
                  not raw applicants.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  Placement is not guaranteed, but every candidate in the
                  pipeline has passed the same standard. Employers know what
                  they are getting.
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom CTAs ─────────────────────────────────────────── */}
          <div className="mt-16 text-center flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hire" className="btn-primary">
              Hire a VA
            </Link>
            <Link href="/apply" className="btn-secondary">
              Apply as a VA
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
