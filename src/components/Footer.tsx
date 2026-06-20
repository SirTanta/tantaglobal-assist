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
    <footer className="mt-auto border-t border-[#d8e4e4] bg-[#eef4f3] text-slate-700">
      <div className="section-container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="TantaGlobal Assist home" className="inline-flex">
              <Image src="/logo-transparent.png" alt="TantaGlobal Assist" width={140} height={48} style={{ width: '140px', height: 'auto' }} />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              Professional VA placement for employers, paired with certification-led training for candidates.
            </p>
            <div className="mt-4 flex gap-4 text-slate-500">
              <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors hover:text-[#0D5C63]">
                <FacebookIcon />
              </a>
              <a href={site.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-[#0D5C63]">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          <div>
            <p className="footer-heading">Pages</p>
            <ul className="footer-list">
              <li><Link href="/hire">Request VA shortlist</Link></li>
              <li><Link href="/apply">Apply for placement</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="footer-heading">Tanta Network</p>
            <ul className="footer-list">
              <li><a href="https://tantaholdings.com" target="_blank" rel="noopener noreferrer">Tanta Holdings</a></li>
              <li><a href={site.academyUrl} target="_blank" rel="noopener noreferrer">TGA Academy</a></li>
              <li><a href="https://tantavisapathways.com" target="_blank" rel="noopener noreferrer">Tanta Visa Pathways</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-heading">Contact and legal</p>
            <ul className="footer-list">
              <li><a href={`mailto:${site.emailEmployer}`}>{site.emailEmployer}</a></li>
              <li><a href={`mailto:${site.emailCandidates}`}>{site.emailCandidates}</a></li>
              <li><a href="/privacy">Privacy policy</a></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-300 pt-5 text-xs text-slate-500 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} TantaGlobal Assist. A Tanta Holdings LLC company.</p>
          <p>Global talent. Clear standards. Real placement.</p>
        </div>
      </div>
    </footer>
  );
}
