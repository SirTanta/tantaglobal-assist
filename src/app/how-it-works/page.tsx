import Link from "next/link";
import type { Metadata } from "next";

const canonical = "https://tantaglobal.com/how-it-works";
const ogImage = "/og/home.svg";

export const metadata: Metadata = {
  title: "How It Works — Apply, train, get placed",
  description:
    "See how TantaGlobal Assist moves from employer intake to VA pool application and placement.",
  alternates: { canonical },
  openGraph: {
    title: "How It Works — TantaGlobal Assist",
    description:
      "A three-step process: employer intake, VA pool certification, and placement.",
    url: canonical,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "How TantaGlobal Assist works" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works — TantaGlobal Assist",
    description:
      "A three-step process: employer intake, VA pool certification, and placement.",
    images: [ogImage],
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <section style={{ backgroundColor: "#F5FAFA" }} className="py-20">
        <div className="section-container">
          <span className="teal-accent" />
          <h1 className="mb-6 max-w-2xl">How It Works</h1>
          <p className="text-xl max-w-xl" style={{ color: "#64748b" }}>
            Three stages. One clear outcome: a certified VA matched with an employer who needed exactly that.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: "#ffffff" }} className="py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <div className="rounded-2xl p-10 flex flex-col md:flex-row gap-8" style={{ backgroundColor: "#F5FAFA", border: "1px solid #cbd5e1" }}>
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ backgroundColor: "#0D5C63" }}>
                1
              </div>
              <div>
                <h2 className="text-xl mb-3">Employers start at the intake page</h2>
                <p className="leading-relaxed mb-4" style={{ color: "#64748b" }}>
                  Employers submit role details at <strong>tantaglobal.com/employers</strong>. We review the need, set the scope, and prepare the placement quote.
                </p>
                <div className="flex gap-4 mt-5 flex-wrap">
                  <Link href="/employers" className="btn-primary text-sm">Employer intake</Link>
                  <Link href="/pricing" className="btn-secondary text-sm">Pricing</Link>
                </div>
              </div>
            </div>

            <div className="flex justify-center"><div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: "#0D5C63" }} /></div>

            <div className="rounded-2xl p-10 flex flex-col md:flex-row gap-8" style={{ backgroundColor: "#E0F5F5", border: "1px solid rgba(13,92,99,0.25)" }}>
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ backgroundColor: "#0D5C63" }}>
                2
              </div>
              <div>
                <h2 className="text-xl mb-3">VA candidates apply to the pool</h2>
                <p className="leading-relaxed mb-4" style={{ color: "#2D3748" }}>
                  Candidates apply through the VA pool page, then move into the certification and placement pipeline when the profile fits employer demand.
                </p>
                <div className="flex gap-4 mt-5 flex-wrap">
                  <Link href="/va-pool/apply" className="btn-primary text-sm">Apply to pool</Link>
                  <Link href="/va-pool/hire" className="btn-secondary text-sm">Employer intake</Link>
                </div>
              </div>
            </div>

            <div className="flex justify-center"><div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: "#0D5C63" }} /></div>

            <div className="rounded-2xl p-10 flex flex-col md:flex-row gap-8" style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1" }}>
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ backgroundColor: "#0D5C63" }}>
                3
              </div>
              <div>
                <h2 className="text-xl mb-3">Placement happens after the standard is met</h2>
                <p className="leading-relaxed mb-4" style={{ color: "#64748b" }}>
                  Certified VAs enter the active placement pipeline. Employers review candidates we have already screened and certified — not raw applicants.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/employers" className="btn-primary">Hire a VA</Link>
            <Link href="/va-pool/apply" className="btn-secondary">Apply to pool</Link>
          </div>
        </div>
      </section>
    </>
  );
}
