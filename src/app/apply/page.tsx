import type { Metadata } from "next";
import ApplyForm from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Apply as a VA — Start Your VA Career",
  description:
    "Apply to TantaGlobal Assist and start your virtual assistant career. Train at TGA Academy, get placed with a vetted employer.",
};

export default function ApplyPage() {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#F5FAFA" }}
        className="py-20"
      >
        <div className="section-container">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#0D5C63" }}
          >
            For VA Candidates
          </p>
          <h1 className="mb-6 max-w-2xl">
            Start Your VA Career
          </h1>
          <p className="text-xl max-w-xl" style={{ color: "#64748b" }}>
            Apply here, train at TGA Academy, get placed with a vetted
            employer. A real career path, built on proof of what you can do.
          </p>
        </div>
      </section>

      {/* ── What to expect ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5FAFA" }} className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                step: "1",
                title: "Submit your application",
                body: "Complete the form below. We review for professionalism, communication baseline, and fit with our employer network.",
              },
              {
                step: "2",
                title: "Complete TGA Academy certification",
                body: "Qualified applicants are guided to academy.tantaglobal.com for structured, scenario-based training. Certification proves real readiness.",
              },
              {
                step: "3",
                title: "Enter the placement pipeline",
                body: "Certified VAs are matched with employer roles. We handle the matching. You focus on performing.",
              },
            ].map((item) => (
              <div key={item.step} className="card flex flex-col">
                <span
                  className="text-4xl font-black mb-4 block leading-none"
                  style={{ color: "#E0F5F5" }}
                >
                  {item.step}
                </span>
                <h3 className="text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {/* ── Application form ────────────────────────────────────── */}
          <div
            className="rounded-2xl p-10 md:p-14"
            style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1" }}
          >
            <h2 className="mb-2">Ready to apply?</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              Our application takes about 10 minutes. Be specific about your
              experience — it helps us match you with the right employers.
            </p>
            <ApplyForm />
          </div>
        </div>
      </section>

      {/* ── Academy link ──────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0D5C63" }} className="py-16">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white mb-2">
              Already enrolled in TGA Academy?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.8)" }}>
              Complete your certification, then return here to enter the
              employer placement pipeline.
            </p>
          </div>
          <a
            href="https://academy.tantaglobal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.7)", color: "#ffffff" }}
          >
            Go to TGA Academy
          </a>
        </div>
      </section>
    </>
  );
}
