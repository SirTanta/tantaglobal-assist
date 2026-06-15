import Link from "next/link";
import Image from "next/image";

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#EAEEEE", color: "#2D3748" }} className="mt-auto">
      <div className="gold-divider" />
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" aria-label="TantaGlobal Assist — home">
              <Image
                src="/logo-transparent.png"
                alt="TantaGlobal Assist"
                width={100}
                height={100}
                style={{ width: "100px", height: "auto", marginBottom: "0.75rem" }}
              />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
              Professional VA placement connecting trained candidates with businesses that need them.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=867291873125261"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: "#64748b" }}
                className="hover:text-[#0D5C63] transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.youtube.com/@TantaRemote"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{ color: "#64748b" }}
                className="hover:text-[#0D5C63] transition-colors"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>

          <div>
            <p className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: "#0a1628" }}>
              Quick Links
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/employers", label: "Employers" },
                { href: "/va-pool/hire", label: "Hire a VA" },
                { href: "/va-pool/apply", label: "Apply to pool" },
                { href: "/pricing", label: "Pricing" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors no-underline hover:text-[#0D5C63]"
                    style={{ color: "#64748b" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: "#0a1628" }}>
              Legal
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/sitemap.xml", label: "Sitemap" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors no-underline hover:text-[#0D5C63]"
                    style={{ color: "#64748b" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: "#0a1628" }}>
              Network
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://academy.tantaglobal.com"
                  className="text-sm transition-colors no-underline hover:text-[#0D5C63]"
                  style={{ color: "#64748b" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TGA Academy — VA Training
                </a>
              </li>
              <li>
                <a
                  href="https://tantaholdings.com"
                  className="text-sm transition-colors no-underline hover:text-[#0D5C63]"
                  style={{ color: "#64748b" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanta Holdings — Parent Company
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@tantaglobal.com"
                  className="text-sm transition-colors no-underline hover:text-[#0D5C63]"
                  style={{ color: "#64748b" }}
                >
                  hello@tantaglobal.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:hire@tantaglobal.com"
                  className="text-sm transition-colors no-underline hover:text-[#0D5C63]"
                  style={{ color: "#64748b" }}
                >
                  hire@tantaglobal.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#64748b" }}>
            &copy; {currentYear} TantaGlobal Assist. A Tanta Holdings LLC company.
          </p>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Veteran-owned. Global talent. US standards.
          </p>
        </div>
      </div>
    </footer>
  );
}
