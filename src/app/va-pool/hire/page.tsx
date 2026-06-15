import type { Metadata } from "next";
import Link from "next/link";
import HireForm from "@/components/HireForm";

const canonical = "https://tantaglobal.com/va-pool/hire";
const ogImage = "/og/va-pool-hire.svg";

export const metadata: Metadata = {
  title: "VA Pool Hire — Employer intake",
  description:
    "Employer intake form for hiring a trained virtual assistant through the TantaGlobal Assist VA pool.",
  alternates: { canonical },
  openGraph: {
    title: "VA Pool Hire — Employer intake | TantaGlobal Assist",
    description:
      "Submit your role details and get routed into the employer placement pipeline.",
    url: canonical,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "TantaGlobal Assist employer intake" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VA Pool Hire — Employer intake | TantaGlobal Assist",
    description: "Submit your role details and get routed into the employer placement pipeline.",
    images: [ogImage],
  },
};

export default function VaPoolHirePage() {
  return (
    <>
      <section className="py-20" style={{ backgroundColor: "#F5FAFA" }}>
        <div className="section-container max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D5C63" }}>
            VA Pool — Employers
          </p>
          <h1 className="mb-6">Employer intake for the VA pool</h1>
          <p className="text-xl leading-relaxed" style={{ color: "#64748b" }}>
            Share the role details here so we can route your request through the placement pipeline and prepare a shortlist of screened candidates.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="section-container">
          <div className="rounded-2xl p-10 md:p-14" style={{ backgroundColor: "#F5FAFA", border: "1px solid #cbd5e1" }}>
            <h2 className="mb-2">Tell us what you need</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              The form below captures the information we need to review the role and match you with the right candidates.
            </p>
            <HireForm />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/pricing" className="btn-secondary">See pricing model</Link>
            <Link href="/employers" className="btn-primary">Back to employers</Link>
          </div>
        </div>
      </section>
    </>
  );
}
