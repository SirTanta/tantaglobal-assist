import Link from "next/link";
import type { Metadata } from "next";

const canonical = "https://tantaglobal.com";
const ogImage = "/og/home.svg";

export const metadata: Metadata = {
  title: "TantaGlobal Assist — Hire trained, job-ready virtual assistants",
  description:
    "Connect US employers with trained, certified virtual assistants and give VA candidates a clear path into the placement pipeline.",
  alternates: { canonical },
  openGraph: {
    title: "TantaGlobal Assist — Hire trained, job-ready virtual assistants",
    description:
      "A global, professional staffing site that splits the employer journey from the VA candidate journey.",
    url: canonical,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "TantaGlobal Assist home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TantaGlobal Assist — Hire trained, job-ready virtual assistants",
    description:
      "A global, professional staffing site that splits the employer journey from the VA candidate journey.",
    images: [ogImage],
  },
};

export default function HomePage() {
  return (
    <>
      <section style={{ backgroundColor: "#F5FAFA" }} className="relative overflow-hidden">
        <div aria-hidden="true" style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "9999px", background: "radial-gradient(circle, rgba(13,92,99,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="section-container relative py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D5C63" }}>
              VA Placement &amp; Staffing
            </p>
            <h1 className="mb-6">
              We connect trained VAs with businesses that need them.
            </h1>
            <p className="text-xl leading-relaxed mb-10 max-w-2xl" style={{ color: "#64748b" }}>
              TantaGlobal Assist places certified, job-ready virtual assistants with employers who need real performance from day one. No guessing. No onboarding surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/employers" className="btn-primary text-base">Hire a VA</Link>
              <Link href="/va-pool/apply" className="btn-secondary text-base">Apply to pool</Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="section-container py-10">
          <div className="gold-divider mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "Certified", label: "Academy-trained candidates only" },
              { stat: "Vetted", label: "Screened before placement" },
              { stat: "Global", label: "Remote-ready from day one" },
              { stat: "Custom", label: "Employer pricing after intake" },
            ].map((item) => (
              <div key={item.stat}>
                <p className="text-2xl font-black mb-1" style={{ color: "#0D5C63" }}>{item.stat}</p>
                <p className="text-sm" style={{ color: "#64748b" }}>{item.label}</p>
              </div>
            ))}
          </div>
          <div className="gold-divider mt-8" />
        </div>
      </section>

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
              { step: "01", title: "Employers start the intake", body: "Tell us what the role needs and we prepare a scoped quote and candidate shortlist.", cta: { href: "/employers", label: "Start employer intake" } },
              { step: "02", title: "Candidates apply to the pool", body: "VA candidates submit their application and move into the certification pathway when qualified.", cta: { href: "/va-pool/apply", label: "Apply to pool" } },
              { step: "03", title: "Placement follows the standard", body: "Screened candidates enter the active pool and get matched with employers based on fit.", cta: { href: "/pricing", label: "See pricing" } },
            ].map((item) => (
              <div key={item.step} className="card">
                <span className="text-5xl font-black leading-none block mb-4" style={{ color: "#E0F5F5", userSelect: "none" }}>{item.step}</span>
                <h3 className="text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748b" }}>{item.body}</p>
                <Link href={item.cta.href} className="text-sm font-semibold no-underline hover:underline" style={{ color: "#0D5C63" }}>{item.cta.label} &rarr;</Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/how-it-works" className="btn-secondary">See the full process</Link>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#ffffff" }} className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-10 flex flex-col" style={{ backgroundColor: "#E0F5F5", border: "1px solid rgba(13,92,99,0.2)" }}>
              <span className="teal-accent" />
              <h3 className="mb-3">For Employers</h3>
              <p className="mb-6 leading-relaxed" style={{ color: "#64748b" }}>
                Get matched with a trained, certified VA who is ready to contribute from the first week.
              </p>
              <Link href="/employers" className="btn-primary self-start">Hire a VA</Link>
            </div>
            <div className="rounded-2xl p-10 flex flex-col" style={{ backgroundColor: "#F5FAFA", border: "1px solid #cbd5e1" }}>
              <span className="block h-1 w-12 rounded-full mb-4" style={{ backgroundColor: "#D4AF37" }} />
              <h3 className="mb-3">For VA Candidates</h3>
              <p className="mb-6 leading-relaxed" style={{ color: "#64748b" }}>
                Start your VA career with real credentials. Apply to the pool, then move into the certification and placement pipeline.
              </p>
              <Link href="/va-pool/apply" className="btn-secondary self-start">Apply to pool</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
