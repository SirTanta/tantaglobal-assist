import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/seo';

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
    <footer className="band-dark mt-auto border-t border-daylight/10">
      <div className="section-container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="TantaGlobal Assist home" className="inline-flex items-center gap-3">
              <Image src="/logo-mark.png" alt="" width={36} height={35} style={{ width: '36px', height: '35px' }} />
              <span className="font-display text-lg font-semibold tracking-tight text-daylight">
                TantaGlobal Assist
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-daylight/60">
              VA placement for US employers, backed by certification-led training for candidates.
              Rio Rancho, NM and Cebu, PH.
            </p>
            <div className="mt-5 flex gap-4 text-daylight/50">
              <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors hover:text-sea-300">
                <FacebookIcon />
              </a>
              <a href={site.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-sea-300">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          <div>
            <p className="footer-heading">Pages</p>
            <ul className="footer-list">
              <li><Link href="/hire">Hire a VA</Link></li>
              <li><Link href="/apply">Apply for placement</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="footer-heading">Tanta network</p>
            <ul className="footer-list">
              <li><a href="https://tantaholdings.com" target="_blank" rel="noopener noreferrer">Tanta Holdings</a></li>
              <li><a href={site.academyUrl} target="_blank" rel="noopener noreferrer">TGA Academy</a></li>
              <li><a href="https://tantavisapathways.com" target="_blank" rel="noopener noreferrer">Tanta Visa Pathways</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-heading">Contact and legal</p>
            <ul className="footer-list">
              <li><a href={`mailto:${site.emailEmployer}`} className="font-mono text-[0.82rem]">{site.emailEmployer}</a></li>
              <li><a href={`mailto:${site.emailCandidates}`} className="font-mono text-[0.82rem]">{site.emailCandidates}</a></li>
              <li><a href="/privacy">Privacy policy</a></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-daylight/10 pt-5 text-xs text-daylight/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} TantaGlobal Assist. A Tanta Holdings LLC company.</p>
          <p className="font-mono uppercase tracking-[0.18em] text-[0.62rem]">Global talent / clear standards / real placement</p>
        </div>
      </div>
    </footer>
  );
}
