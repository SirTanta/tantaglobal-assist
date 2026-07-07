"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuId = 'mobile-menu';

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="section-container">
        <nav className="flex items-center justify-between gap-6 py-3" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-3 no-underline" aria-label="TantaGlobal Assist home">
            <Image
              src="/logo-mark.png"
              alt=""
              width={41}
              height={40}
              priority
              style={{ width: '41px', height: '40px' }}
            />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-[1.05rem] font-semibold tracking-tight text-daylight">
                TantaGlobal Assist
              </span>
              <span className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-daylight/65">
                VA placement / employer side
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
            <span aria-hidden className="h-5 w-px bg-daylight/15" />
            <Link href="/apply" className="nav-link">
              Apply as a VA
            </Link>
            <Link href="/hire" className="btn-primary px-4 py-2 text-sm">
              Hire a VA
            </Link>
          </div>

          <button
            className="lg:hidden rounded p-2 text-daylight"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {menuOpen && (
          <div id={mobileMenuId} className="lg:hidden border-t border-daylight/10 pb-5 pt-3">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className="rounded px-3 py-2 text-sm font-medium text-daylight/80 hover:bg-daylight/5 hover:text-daylight"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded px-3 py-2 text-sm font-medium text-daylight/80 hover:bg-daylight/5 hover:text-daylight"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link href="/apply" className="btn-secondary text-center text-sm" onClick={() => setMenuOpen(false)}>
                  Apply as a VA
                </Link>
                <Link href="/hire" className="btn-primary text-center text-sm" onClick={() => setMenuOpen(false)}>
                  Hire a VA
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
