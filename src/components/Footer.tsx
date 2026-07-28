import Link from "next/link";
import Image from "next/image";
import BeehiivSubscribeForm from "@/components/BeehiivSubscribeForm";

/**
 * Global Assist Footer — Instruments of Passage dark section.
 *
 * Spec: shared-component-system.md §3
 * - bg: instruments-ink (deep navy)
 * - text: instruments-vellum (warm off-white)
 * - All IoP tokens; no legacy brand-* classes
 */

const companies: { label: string; href: string; external: boolean }[] = [
  { label: "Tanta Holdings",       href: "https://tantaholdings.com",      external: true },
  { label: "TGA Academy",          href: "https://academy.tantaglobal.com", external: true },
  { label: "Visa Pathways",       href: "https://tantavisapathways.com",   external: true },
  { label: "Tanta Solutions",      href: "https://tantaholdings.com/solutions", external: true },
];

const pages: { label: string; href: string }[] = [
  { label: "Hire a VA",     href: "/hire" },
  { label: "Apply for placement", href: "/apply" },
  { label: "Pricing",       href: "/pricing" },
  { label: "How it works",  href: "/how-it-works" },
  { label: "About",         href: "/about" },
  { label: "Contact",       href: "/contact" },
];

const legal: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Site map",       href: "/sitemap" },
];

export default function Footer() {
  return (
    <footer className="bg-instruments-ink text-instruments-vellum">

      {/* Gold divider rule */}
      <div className="instr-rule-gold" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">

        {/* Main 4-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <Image
                src="/logo-transparent.png"
                alt="TantaGlobal Assist"
                width={120}
                height={40}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="font-sans text-sm leading-relaxed text-instruments-vellum/50 max-w-xs mb-4">
              Professional VA placement for employers, paired with certification-led training for candidates.
              Part of Tanta Holdings.
            </p>
            <div className="flex gap-3 mt-5">
              <SocialLink href="https://www.facebook.com/profile.php?id=867291873125261" label="Facebook" icon={<FacebookIcon />} />
              <SocialLink href="https://www.youtube.com/@TantaRemote" label="YouTube" icon={<YouTubeIcon />} />
            </div>
          </div>

          {/* Pages */}
          <FooterNav title="Pages" items={pages} />

          {/* Tanta Network */}
          <FooterNav title="Tanta Network" items={companies} external />

          {/* Contact + Legal */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-instruments-vellum/25 mb-5">
              Contact &amp; Legal
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hire@tantaglobal.com"
                  className="font-sans text-sm text-instruments-vellum/50 hover:text-instruments-vellum transition-colors"
                >
                  hire@tantaglobal.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:apply@tantaglobal.com"
                  className="font-sans text-sm text-instruments-vellum/50 hover:text-instruments-vellum transition-colors"
                >
                  apply@tantaglobal.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@tantaglobal.com"
                  className="font-sans text-sm text-instruments-vellum/50 hover:text-instruments-vellum transition-colors"
                >
                  hello@tantaglobal.com
                </a>
              </li>
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-instruments-vellum/50 hover:text-instruments-vellum transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter bar */}
        <div id="field-notes" className="rounded-3xl border border-instruments-vellum/10 bg-instruments-ink-deep px-8 py-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <p className="font-display font-semibold text-instruments-vellum text-sm mb-0.5">
                Get the field notes
              </p>
              <p className="font-sans text-xs text-instruments-vellum/40">
                VA hiring guides, remote work tips, and talent insights. No fluff.
              </p>
            </div>
            <div className="md:w-80">
              <BeehiivSubscribeForm variant="footer" buttonLabel="Subscribe" />
            </div>
          </div>
        </div>

        {/* Beehiiv recommended content module */}
        <div className="rounded-3xl border border-instruments-vellum/10 bg-instruments-ink-deep px-8 py-6 mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-instruments-gold mb-1">
            Recommended reading
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mt-3">
            <div className="flex-1">
              <p className="font-sans text-xs font-semibold text-instruments-vellum mb-1">
                VA Employer Field Guide
              </p>
              <p className="font-sans text-[11px] text-instruments-vellum/40 mb-2">
                Staffing checklist and real VA placement pricing.
              </p>
              <a href="https://tantaholdings.com" className="font-sans text-[11px] text-instruments-gold hover:text-instruments-gold-bright transition-colors">
                Tanta Holdings
              </a>
            </div>
            <div className="flex-1">
              <p className="font-sans text-xs font-semibold text-instruments-vellum mb-1">
                Tool Snippet of the Week
              </p>
              <p className="font-sans text-[11px] text-instruments-vellum/40 mb-2">
                Free workspace template or productivity snippet.
              </p>
              <a href="https://tantaholdings.com/shop" className="font-sans text-[11px] text-instruments-gold hover:text-instruments-gold-bright transition-colors">
                Browse the tool library
              </a>
            </div>
            <div className="flex-1">
              <p className="font-sans text-xs font-semibold text-instruments-vellum mb-1">
                TGA Certification Track
              </p>
              <p className="font-sans text-[11px] text-instruments-vellum/40 mb-2">
                VA certification built for the US market.
              </p>
              <a href="https://academy.tantaglobal.com" className="font-sans text-[11px] text-instruments-gold hover:text-instruments-gold-bright transition-colors">
                Start at TGA Academy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="instr-rule-bronze mb-5" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-instruments-vellum/25">
            &copy; {new Date().getFullYear()} TantaGlobal Assist. A Tanta Holdings LLC company.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-instruments-vellum/25">
            Cebu, PH &middot; Rio Rancho, NM &middot; Global Talent. US Standards.
          </p>
        </div>
      </div>
    </footer>
  );
}

type FooterNavItem = { label: string; href: string };
type ExternalNavItem = { label: string; href: string; external: boolean };

function FooterNav({
  title,
  items,
  external = false,
}: {
  title: string;
  items: FooterNavItem[] | ExternalNavItem[];
  external?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-instruments-vellum/25 mb-5">
        {title}
      </p>
      <ul className="space-y-3">
        {items.map((item) => {
          const isExternal = external && "external" in item && item.external;
          if (isExternal) {
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-instruments-vellum/50 hover:text-instruments-vellum transition-colors"
                >
                  {item.label}
                  <span aria-hidden="true" className="ml-1 opacity-40">↗</span>
                </a>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-sans text-sm text-instruments-vellum/50 hover:text-instruments-vellum transition-colors"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-instruments-vellum/30 hover:text-instruments-vellum transition-colors"
    >
      {icon}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
