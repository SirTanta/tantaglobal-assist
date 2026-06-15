import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://tantaglobal.com/pricing";
const ogImage = "/og/pricing.svg";
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tantaglobal.com/" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: canonical },
  ],
};

export const metadata: Metadata = {
  title: "Pricing — TantaGlobal Assist",
  description:
    "Learn how TantaGlobal Assist pricing works for employers and what is free for VA candidates.",
  alternates: { canonical },
  openGraph: {
    title: "Pricing — TantaGlobal Assist",
    description:
      "Employer pricing is quoted after intake. VA candidates can apply to the pool without a fee.",
    url: canonical,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "TantaGlobal Assist pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — TantaGlobal Assist",
    description:
      "Employer pricing is quoted after intake. VA candidates can apply to the pool without a fee.",
    images: [ogImage],
  },
};

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="py-20" style={{ backgroundColor: "#F5FAFA" }}>
        <div className="section-container max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D5C63" }}>
            Pricing
          </p>
          <h1 className="mb-6">Transparent pricing for employers</h1>
          <p className="text-xl leading-relaxed" style={{ color: "#64748b" }}>
            We price placements after intake, based on role scope, urgency, and how much candidate screening is needed. That keeps the quote aligned with the work.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "Candidate application",
                body: "Free for VA candidates to submit and join the pool.",
              },
              {
                title: "Employer intake",
                body: "A scoped quote is prepared after we review your role requirements and placement needs.",
              },
              {
                title: "Placement follow-up",
                body: "Post-placement support stays tied to the same quote so there are no surprise add-ons.",
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <span className="teal-accent" />
                <h3 className="text-lg mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <div className="card">
              <span className="teal-accent" />
              <h2 className="text-2xl mb-4">How the quote works</h2>
              <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                <li>• Intake confirms the role, deliverables, and expected hours.</li>
                <li>• Screening depth changes with specialization and urgency.</li>
                <li>• The final quote reflects the actual placement scope.</li>
                <li>• We do not publish fake package tiers just to fill a page.</li>
              </ul>
            </div>
            <div className="card">
              <span className="block h-1 w-12 rounded-full mb-4" style={{ backgroundColor: "#D4AF37" }} />
              <h2 className="text-2xl mb-4">What stays free</h2>
              <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                <li>• Candidate pool application</li>
                <li>• Public site navigation and information pages</li>
                <li>• Employer discovery of the value proposition</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl p-10 md:p-14" style={{ backgroundColor: "#F5FAFA", border: "1px solid #cbd5e1" }}>
            <h2 className="mb-2">Need a quote?</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              Start with the employer intake so we can give you a quote that fits the role.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/va-pool/hire" className="btn-primary">Start employer intake</Link>
              <Link href="/va-pool/apply" className="btn-secondary">Apply to pool</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
