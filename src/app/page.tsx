import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TantaGlobal Assist — We Connect Trained VAs with Businesses That Need Them",
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#F5FAFA" }}
        className="relative overflow-hidden"
      >
        {/* Subtle teal glow orb */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(13,92,99,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="section-container relative py-24 md:py-32">
          <div className="max-w-3xl">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#0D5C63" }}
            >
              VA Placement &amp; Staffing
            </p>
            <h1 className="mb-6">
              We connect trained VAs with businesses that need them.
            </h1>
            <p
              className="text-xl leading-relaxed mb-10 max-w-2xl"
              style={{ color: "#64748b" }}
            >
              TantaGlobal Assist places certified, job-ready virtual assistants
              with employers who need real performance from day one. No guessing.
              No onboarding surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/hire" className="btn-primary text-base">
                Hire a VA
              </Link>
              <Link href="/apply" className="btn-secondary text-base">
                Apply as a VA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="section-container py-10">
          <div className="gold-divider mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "Certified", label: "Academy-trained candidates only" },
              { stat: "Vetted", label: "Screened before placement" },
              { stat: "Global", label: "Remote-ready from day one" },
              { stat: "Supported", label: "Ongoing placement follow-up" },
            ].map((item) => (
              <div key={item.stat}>
                <p
                  className="text-2xl font-black mb-1"
                  style={{ color: "#0D5C63" }}
                >
                  {item.stat}
                </p>
                <p className="text-sm" style={{ color: "#64748b" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="gold-divider mt-8" />
        </div>
      </section>

      {/* ── How it works preview ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5FAFA" }} className="py-20">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="teal-accent mx-auto" />
            <h2>How the process works</h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
              A clear, three-step pipeline from application to placement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Apply at TantaGlobal Assist",
                body: "VA candidates submit their application here. We screen for professionalism, communication, and baseline readiness.",
                cta: { href: "/apply", label: "Apply now" },
              },
              {
                step: "02",
                title: "Train at TGA Academy",
                body: "Qualified candidates complete certification at academy.tantaglobal.com — scenario-based training that proves client-facing readiness.",
                cta: {
                  href: "https://academy.tantaglobal.com",
                  label: "View training",
                  external: true,
                },
              },
              {
                step: "03",
                title: "Get Placed with an Employer",
                body: "Certified VAs enter our employer pipeline. Businesses post roles, review candidates, and get matched with job-ready professionals.",
                cta: { href: "/hire", label: "Hire a VA" },
              },
            ].map((item) => (
              <div key={item.step} className="card">
                <span
                  className="text-5xl font-black leading-none block mb-4"
                  style={{ color: "#E0F5F5", userSelect: "none" }}
                >
                  {item.step}
                </span>
                <h3 className="text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748b" }}>
                  {item.body}
                </p>
                {item.cta.external ? (
                  <a
                    href={item.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-sm"
                    style={{ color: "#0D5C63" }}
                  >
                    {item.cta.label} &rarr;
                  </a>
                ) : (
                  <Link
                    href={item.cta.href}
                    className="btn-ghost text-sm"
                    style={{ color: "#0D5C63" }}
                  >
                    {item.cta.label} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/how-it-works" className="btn-secondary">
              See the full process
            </Link>
          </div>
        </div>
      </section>

      {/* ── Flywheel ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F0F4F4" }} className="py-20">
        <div className="section-container">
          <div className="max-w-2xl">
            <span className="teal-accent" />
            <h2 className="mb-6">
              Training and placement work together.
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "#2D3748" }}>
              TantaGlobal Assist and TGA Academy operate as a single pipeline.
              Candidates train and certify at the Academy. Employers get
              candidates who have already proved they can perform. The cycle
              produces better VAs and more confident hiring decisions.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "#64748b" }}>
              This is not a job board. We are a placement service backed by a
              real training program. Every VA in our pipeline has completed
              structured, scenario-based certification at{" "}
              <a
                href="https://academy.tantaglobal.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0D5C63" }}
                className="font-semibold hover:underline"
              >
                academy.tantaglobal.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── Dual CTA ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff" }} className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employer */}
            <div
              className="rounded-2xl p-10 flex flex-col"
              style={{ backgroundColor: "#E0F5F5", border: "1px solid rgba(13,92,99,0.2)" }}
            >
              <span className="teal-accent" />
              <h3 className="mb-3">For Employers</h3>
              <p className="mb-6 leading-relaxed" style={{ color: "#64748b" }}>
                Get matched with a trained, certified VA who is ready to
                contribute from the first week. No trial-and-error hiring.
              </p>
              <Link href="/hire" className="btn-primary self-start">
                Hire a VA
              </Link>
            </div>
            {/* VA */}
            <div
              className="rounded-2xl p-10 flex flex-col"
              style={{ backgroundColor: "#F5FAFA", border: "1px solid #cbd5e1" }}
            >
              <span
                className="block h-1 w-12 rounded-full mb-4"
                style={{ backgroundColor: "#D4AF37" }}
              />
              <h3 className="mb-3">For VA Candidates</h3>
              <p className="mb-6 leading-relaxed" style={{ color: "#64748b" }}>
                Start your VA career with real credentials. Train at TGA
                Academy, get placed with a vetted employer. Your career, built
                on proof.
              </p>
              <Link href="/apply" className="btn-secondary self-start">
                Apply as a VA
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
