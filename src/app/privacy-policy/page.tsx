import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for TantaGlobal Assist.",
  alternates: { canonical: "https://tantaglobal.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-20" style={{ backgroundColor: "#F5FAFA" }}>
      <div className="section-container max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D5C63" }}>
          Legal
        </p>
        <h1 className="mb-6">Privacy Policy</h1>
        <div className="space-y-5 leading-relaxed" style={{ color: "#64748b" }}>
          <p>
            TantaGlobal Assist collects the information you submit through the public forms on this site so we can respond to inquiries, route employer requests, and review VA applications.
          </p>
          <p>
            We use that information only for the placement process and related communication. We do not sell your personal information.
          </p>
          <p>
            If you want your submission reviewed or removed, contact us at hello@tantaglobal.com.
          </p>
        </div>
      </div>
    </section>
  );
}
