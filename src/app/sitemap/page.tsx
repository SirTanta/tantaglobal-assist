import Image from "next/image";
import Link from "next/link";
import { breadcrumbJsonLd, pageMetadata, site } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Site map",
  description: "Find the employer, candidate, support, and legal paths at TantaGlobal Assist.",
  path: "/sitemap",
  image: "/og-home.svg",
});

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Site map", path: "/sitemap" },
]);

type SitemapLink = {
  href: string;
  label: string;
  description: string;
  external?: boolean;
};

const groups: Array<{ title: string; description: string; links: SitemapLink[] }> = [
  {
    title: "Start here",
    description: "An overview of how TantaGlobal Assist works and who we support.",
    links: [
      { href: "/", label: "Home", description: "Choose an employer or candidate path." },
      { href: "/how-it-works", label: "How it works", description: "Understand the placement process." },
      { href: "/about", label: "About", description: "Meet the TantaGlobal Assist approach." },
    ],
  },
  {
    title: "For employers",
    description: "Plan a virtual-assistant hire and start a shortlist request.",
    links: [
      { href: "/hire", label: "Hire a VA", description: "Tell us the role and support you need." },
      { href: "/pricing", label: "Pricing", description: "Review placement pricing and options." },
      { href: "/contact", label: "Talk to the team", description: "Ask an employer question." },
    ],
  },
  {
    title: "For candidates",
    description: "Prepare for placement, then begin an application when ready.",
    links: [
      { href: "/apply", label: "Apply for placement", description: "Start a candidate application." },
      { href: site.academyUrl, label: "TGA Academy", description: "Explore certification-led training.", external: true },
      { href: "/contact", label: "Candidate support", description: "Get help with a candidate question." },
    ],
  },
  {
    title: "Support and policies",
    description: "Find contact details, privacy information, and the crawlable site index.",
    links: [
      { href: "/contact", label: "Contact", description: "Reach the TantaGlobal Assist team." },
      { href: "/privacy", label: "Privacy policy", description: "Read how site information is handled." },
      { href: "/sitemap.xml", label: "XML sitemap", description: "Open the search-engine sitemap." },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <section className="bg-instruments-daylight">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-12 sm:pt-20">
          <div className="max-w-3xl">
            <p className="instr-filing mb-4">Navigation index</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-instruments-teak">
              Find the right next step.
            </h1>
            <p className="mt-5 font-sans text-lg leading-relaxed text-instruments-shadow max-w-2xl">
              Explore the real TantaGlobal Assist routes for hiring, placement, guidance, and support.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div className="grid gap-5 sm:grid-cols-2">
            {groups.map((group) => (
              <section
                key={group.title}
                aria-labelledby={`${group.title.toLowerCase().replaceAll(" ", "-")}-heading`}
                className="rounded-3xl border border-instruments-shadow/15 bg-white p-6 sm:p-7"
              >
                <h2
                  id={`${group.title.toLowerCase().replaceAll(" ", "-")}-heading`}
                  className="font-display text-2xl font-semibold text-instruments-teak"
                >
                  {group.title}
                </h2>
                <p className="mt-2 font-sans text-sm leading-relaxed text-instruments-shadow">
                  {group.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group block rounded-2xl border border-instruments-shadow/10 px-4 py-3 transition-colors hover:border-instruments-gold hover:bg-instruments-gold/10 focus-visible:outline-offset-4"
                      >
                        <span className="flex items-center justify-between gap-4 font-sans font-semibold text-instruments-teak">
                          {link.label}
                          <span aria-hidden="true" className="text-instruments-gold group-hover:translate-x-0.5 transition-transform">
                            {link.external ? "↗" : "→"}
                          </span>
                        </span>
                        <span className="mt-1 block font-sans text-sm leading-relaxed text-instruments-shadow">
                          {link.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-instruments-ink text-instruments-vellum">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo-transparent.png" alt="TantaGlobal Assist" width={120} height={40} className="h-9 w-auto object-contain brightness-0 invert" />
            <div>
              <p className="font-display text-xl font-semibold">Keep learning between visits.</p>
              <p className="mt-1 font-sans text-sm text-instruments-vellum/60">Get the existing Field Notes guidance for hiring and remote work.</p>
            </div>
          </div>
          <Link
            href="/#field-notes"
            data-ga4-action="click_cta__global_assist__sitemap"
            data-ga4-label="field-notes-return-loop"
            className="instr-btn-primary self-start sm:self-auto"
          >
            Get Field Notes
          </Link>
        </div>
      </section>
    </>
  );
}
