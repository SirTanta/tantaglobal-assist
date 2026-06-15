import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for TantaGlobal Assist.",
  alternates: { canonical: "https://tantaglobal.com/terms-of-service" },
};

export default function TermsPage() {
  return (
    <section className="py-20" style={{ backgroundColor: "#F5FAFA" }}>
      <div className="section-container max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D5C63" }}>
          Legal
        </p>
        <h1 className="mb-6">Terms of Service</h1>
        <div className="space-y-5 leading-relaxed" style={{ color: "#64748b" }}>
          <p>
            TantaGlobal Assist provides a placement service and public information site. Form submissions are reviewed by our team and may be followed up by email.
          </p>
          <p>
            We reserve the right to decline submissions that are incomplete, inaccurate, or outside the scope of the service.
          </p>
          <p>
            By using this site, you agree to provide accurate information and to use the contact and application forms for legitimate business purposes only.
          </p>
        </div>
      </div>
    </section>
  );
}
