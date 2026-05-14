import Link from "next/link";
import type { Metadata } from "next";
import HireForm from "@/components/HireForm";

export const metadata: Metadata = {
  title: "Hire a Trained, Job-Ready VA",
  description:
    "Post your open role and get matched with a certified, trained virtual assistant through TantaGlobal Assist.",
};

export default function HirePage() {
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
            For Employers
          </p>
          <h1 className="mb-6 max-w-2xl">
            Hire a Trained, Job-Ready VA
          </h1>
          <p className="text-xl max-w-xl" style={{ color: "#64748b" }}>
            Every candidate in our pipeline has completed structured,
            scenario-based certification. You are not taking a chance on
            unvetted talent.
          </p>
        </div>
      </section>

      {/* ── Why our pipeline ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5FAFA" }} className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "Certified candidates only",
                body: "Every VA has completed TGA Academy certification — scenario-based training designed to prove real client-facing readiness, not just theoretical knowledge.",
              },
              {
                title: "Screened before you see them",
                body: "We review professionalism, communication, and role fit before candidates enter your review queue. Your time is not spent on mismatches.",
              },
              {
                title: "Remote-ready from day one",
                body: "Training covers async communication, tool fluency, deadline discipline, and client management. They know how distributed work actually functions.",
              },
            ].map((item) => (
              <div key={item.title} className="card">
                <span className="teal-accent" />
                <h3 className="text-lg mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {/* ── Hire form ──────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-10 md:p-14"
            style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1" }}
          >
            <h2 className="mb-2">Tell us about your role</h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              Submit your requirements below and we will match you with
              qualified candidates from our certified pipeline.
            </p>

            <HireForm />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0D5C63" }} className="py-16">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white mb-2">Ready to build your remote team?</h3>
            <p style={{ color: "rgba(255,255,255,0.8)" }}>
              Learn how the full placement process works before you submit.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="btn-secondary shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.7)", color: "#ffffff" }}
          >
            See how it works
          </Link>
        </div>
      </section>
    </>
  );
}
