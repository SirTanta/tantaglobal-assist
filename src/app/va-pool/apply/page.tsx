import type { Metadata } from "next";
import Link from "next/link";
import ApplyForm from "@/components/ApplyForm";

const canonical = "https://tantaglobal.com/va-pool/apply";
const ogImage = "/og/va-pool-apply.svg";

export const metadata: Metadata = {
  title: "VA Pool Apply — Join the candidate pool",
  description:
    "Apply to the TantaGlobal Assist VA pool and start your route into the employer placement pipeline.",
  alternates: { canonical },
  openGraph: {
    title: "VA Pool Apply — Join the candidate pool | TantaGlobal Assist",
    description:
      "Submit your application to the VA pool and enter the certification-to-placement pipeline.",
    url: canonical,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "TantaGlobal Assist VA application" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VA Pool Apply — Join the candidate pool | TantaGlobal Assist",
    description:
      "Submit your application to the VA pool and enter the certification-to-placement pipeline.",
    images: [ogImage],
  },
};

export default function VaPoolApplyPage() {
  return (
    <>
      <section className="py-20" style={{ backgroundColor: "#F5FAFA" }}>
        <div className="section-container max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D5C63" }}>
            VA Pool — Applicants
          </p>
          <h1 className="mb-6">Apply to the VA pool</h1>
          <p className="text-xl leading-relaxed" style={{ color: "#64748b" }}>
            Tell us about your background, availability, and skills. Qualified applicants move into the certification and placement pipeline.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="section-container">
          <div className="rounded-2xl p-10 md:p-14" style={{ backgroundColor: "#F5FAFA", border: "1px solid #cbd5e1" }}>
            <h2 className="mb-2">Submit your application</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              Use this form to join the pool. If your profile fits what employers need, we will route you to the next step.
            </p>
            <ApplyForm />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/pricing" className="btn-secondary">View pricing</Link>
            <Link href="/employers" className="btn-primary">For employers</Link>
          </div>
        </div>
      </section>
    </>
  );
}
