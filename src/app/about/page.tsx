import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TantaGlobal Assist",
  description:
    "TantaGlobal Assist is a professional VA placement service. We connect businesses with globally trained, certified virtual assistants.",
};

export default function AboutPage() {
  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#F5FAFA" }}
        className="py-20"
      >
        <div className="section-container max-w-3xl">
          <span className="teal-accent" />
          <h1 className="mb-6">About TantaGlobal Assist</h1>
          <p className="text-xl leading-relaxed" style={{ color: "#64748b" }}>
            A professional VA placement service that takes training seriously.
          </p>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5FAFA" }} className="py-20">
        <div className="section-container max-w-3xl">
          <span className="teal-accent" />
          <h2 className="mb-6">What we do</h2>
          <div className="flex flex-col gap-5" style={{ color: "#2D3748" }}>
            <p className="text-lg leading-relaxed">
              TantaGlobal Assist connects businesses with trained, certified
              virtual assistants. We are not a job board. We are a placement
              service with a pipeline — every VA we place has completed
              structured certification through TGA Academy before they reach an
              employer.
            </p>
            <p className="leading-relaxed" style={{ color: "#64748b" }}>
              The staffing industry has a noise problem. Platforms filled with
              unvetted applicants, no clear standard, no proof of readiness.
              Hiring becomes a series of expensive experiments.
            </p>
            <p className="leading-relaxed" style={{ color: "#64748b" }}>
              We built TantaGlobal Assist to fix that. The same organization
              that trains VAs is the one placing them. The standard is
              consistent. Employers know what they are getting before the first
              conversation.
            </p>
          </div>

          <div className="gold-divider my-12" />

          <h2 className="mb-6">Who we serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="card">
              <span className="teal-accent" />
              <h3 className="text-lg mb-2">Employers</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                Small and mid-size businesses that need reliable remote
                support. Founders, operators, and team leads who want a VA
                that is ready to contribute, not one that needs six weeks of
                ramp-up to become productive.
              </p>
            </div>
            <div className="card">
              <span
                className="block h-1 w-12 rounded-full mb-4"
                style={{ backgroundColor: "#D4AF37" }}
              />
              <h3 className="text-lg mb-2">VA Candidates</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                Global professionals building careers in virtual assistance.
                People who want more than a platform — a path with real
                credentials, real placement, and real employer relationships.
              </p>
            </div>
          </div>

          <div className="gold-divider my-12" />

          <h2 className="mb-6">Part of a larger network</h2>
          <p className="leading-relaxed mb-6" style={{ color: "#64748b" }}>
            TantaGlobal Assist operates under{" "}
            <a
              href="https://tantaholdings.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0D5C63" }}
              className="font-semibold hover:underline"
            >
              Tanta Holdings LLC
            </a>
            , a veteran-owned company building the infrastructure for global
            workforce readiness. Our sister organization,{" "}
            <a
              href="https://academy.tantaglobal.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0D5C63" }}
              className="font-semibold hover:underline"
            >
              TGA Academy
            </a>
            , is where VA candidates train and certify before entering our
            placement pipeline.
          </p>
          <p className="leading-relaxed" style={{ color: "#64748b" }}>
            The model is intentional: training and placement should not be
            separate organizations with separate standards. When they are the
            same organization, the quality floor is the same floor.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0D5C63" }} className="py-16">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white mb-2">Ready to get started?</h3>
            <p style={{ color: "rgba(255,255,255,0.8)" }}>
              Whether you need a VA or want to become one, the process starts
              here.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/hire"
              className="btn-primary"
              style={{ backgroundColor: "#ffffff", color: "#0D5C63" }}
            >
              Hire a VA
            </Link>
            <Link
              href="/apply"
              className="btn-secondary"
              style={{ borderColor: "rgba(255,255,255,0.7)", color: "#ffffff" }}
            >
              Apply as VA
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
