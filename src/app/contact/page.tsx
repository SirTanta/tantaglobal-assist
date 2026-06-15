import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

const canonical = "https://tantaglobal.com/contact";
const ogImage = "/og/contact.svg";

export const metadata: Metadata = {
  title: "Contact TantaGlobal Assist",
  description:
    "Get in touch with TantaGlobal Assist about hiring, applying, or the placement process.",
  alternates: { canonical },
  openGraph: {
    title: "Contact TantaGlobal Assist",
    description:
      "Questions about hiring, applying, or the placement process? Reach out here.",
    url: canonical,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Contact TantaGlobal Assist" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact TantaGlobal Assist",
    description:
      "Questions about hiring, applying, or the placement process? Reach out here.",
    images: [ogImage],
  },
};

export default function ContactPage() {
  return (
    <>
      <section style={{ backgroundColor: "#F5FAFA" }} className="py-20">
        <div className="section-container">
          <span className="teal-accent" />
          <h1 className="mb-6 max-w-2xl">Contact Us</h1>
          <p className="text-xl max-w-xl" style={{ color: "#64748b" }}>
            Have a question about hiring, the application process, or something else? Reach out directly.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: "#ffffff" }} className="py-20">
        <div className="section-container max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <div className="card">
              <span className="teal-accent" />
              <h3 className="text-lg mb-2">Employers</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748b" }}>
                Questions about placement, the candidate pipeline, or getting started? Email our employer team.
              </p>
              <a href="mailto:hire@tantaglobal.com" style={{ color: "#0D5C63" }} className="text-sm font-semibold hover:underline">
                hire@tantaglobal.com
              </a>
            </div>
            <div className="card">
              <span className="block h-1 w-12 rounded-full mb-4" style={{ backgroundColor: "#D4AF37" }} />
              <h3 className="text-lg mb-2">VA Candidates</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748b" }}>
                Questions about the application or training process? Reach the candidate team here.
              </p>
              <a href="mailto:apply@tantaglobal.com" style={{ color: "#0D5C63" }} className="text-sm font-semibold hover:underline">
                apply@tantaglobal.com
              </a>
            </div>
          </div>

          <div className="rounded-2xl p-10 md:p-14" style={{ backgroundColor: "#F5FAFA", border: "1px solid #cbd5e1" }}>
            <h2 className="mb-2">Send a message</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              General inquiries, partnerships, or anything that does not fit the categories above.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
