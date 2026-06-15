import type { Metadata } from "next";
import Link from "next/link";
import HireForm from "@/components/HireForm";

const canonical = "https://tantaglobal.com/employers";
const ogImage = "/og/employers.svg";
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tantaglobal.com/" },
    { "@type": "ListItem", position: 2, name: "Employers", item: canonical },
  ],
};
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TantaGlobal Assist employer placement",
  serviceType: "Virtual assistant placement",
  provider: {
    "@type": "Organization",
    name: "TantaGlobal Assist",
    url: "https://tantaglobal.com",
  },
  areaServed: "US employers hiring remote virtual assistants",
  url: canonical,
};

export const metadata: Metadata = {
  title: "Employers — Hire a trained VA",
  description:
    "Employer value prop, pricing model, and intake for hiring a trained virtual assistant through TantaGlobal Assist.",
  alternates: { canonical },
  openGraph: {
    title: "Employers — Hire a trained VA | TantaGlobal Assist",
    description:
      "Hire trained, certified VAs with a clear intake and quote process. Built for employers who need reliable remote support.",
    url: canonical,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "TantaGlobal Assist employers page" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Employers — Hire a trained VA | TantaGlobal Assist",
    description:
      "Hire trained, certified VAs with a clear intake and quote process.",
    images: [ogImage],
  },
};

export default function EmployersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <section className="py-20" style={{ backgroundColor: "#F5FAFA" }}>
        <div className="section-container">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D5C63" }}>
            For Employers
          </p>
          <h1 className="mb-6 max-w-2xl">Hire a trained, job-ready VA</h1>
          <p className="text-xl max-w-2xl" style={{ color: "#64748b" }}>
            TantaGlobal Assist gives US employers a vetted, professional route to remote support. You get screened candidates, a clear intake, and a pricing model that fits the scope of the role.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/va-pool/hire" className="btn-primary">Start employer intake</Link>
            <Link href="/pricing" className="btn-secondary">See pricing model</Link>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "Screened before you review them",
                body: "We surface candidates who have already passed the baseline review for professionalism, communication, and role fit.",
              },
              {
                title: "A pipeline, not a pile of resumes",
                body: "The placement process is intentionally narrow. Employers see fewer candidates, but the candidates are better aligned to the role.",
              },
              {
                title: "Pricing tied to scope",
                body: "We scope placements by role complexity, urgency, and volume. That keeps the quote tied to the work instead of a generic package.",
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
              <h2 className="text-2xl mb-4">Pricing model</h2>
              <p className="leading-relaxed" style={{ color: "#64748b" }}>
                Employers get a quote after intake. Pricing depends on role scope, expected hours, and how much screening is needed. That keeps the process transparent without inventing a one-size-fits-all fee.
              </p>
              <ul className="mt-5 space-y-3 text-sm" style={{ color: "#2D3748" }}>
                <li>• No guesswork: we confirm role details before we quote.</li>
                <li>• No hidden add-ons: the quote covers the placement scope discussed in intake.</li>
                <li>• No candidate fee to apply: the VA pool entry point stays free.</li>
              </ul>
            </div>
            <div className="card">
              <span className="block h-1 w-12 rounded-full mb-4" style={{ backgroundColor: "#D4AF37" }} />
              <h2 className="text-2xl mb-4">What you receive</h2>
              <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                <li>• Employer intake review</li>
                <li>• Shortlist of screened candidates</li>
                <li>• Matching based on role fit and availability</li>
                <li>• Follow-up after placement</li>
                <li>• Access to the wider Tanta talent network</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl p-10 md:p-14" style={{ backgroundColor: "#F5FAFA", border: "1px solid #cbd5e1" }}>
            <h2 className="mb-2">Employer intake</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              Tell us what you are hiring for and we will route the request through the placement process.
            </p>
            <HireForm />
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#0D5C63" }}>
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white mb-2">Need the candidate-side page instead?</h3>
            <p style={{ color: "rgba(255,255,255,0.8)" }}>Applicants can join the VA pool at the dedicated application page.</p>
          </div>
          <Link href="/va-pool/apply" className="btn-secondary shrink-0" style={{ borderColor: "rgba(255,255,255,0.7)", color: "#ffffff" }}>
            Apply to pool
          </Link>
        </div>
      </section>
    </>
  );
}
