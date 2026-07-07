"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuId = 'mobile-menu';

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="section-container">
        <nav className="flex items-center justify-between gap-6 py-4" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-3 no-underline" aria-label="TantaGlobal Assist home">
            <Image
              src="/logo-transparent.png"
              alt="TantaGlobal Assist"
              width={148}
              height={48}
              priority
              style={{ width: '148px', height: 'auto' }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/apply" className="btn btn-secondary text-sm px-4 py-2">
              Apply for placement
            </Link>
            <Link href="/hire" className="btn btn-primary text-sm px-4 py-2">
              Request VA shortlist
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-full"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {menuOpen && (
          <div id={mobileMenuId} className="lg:hidden border-t border-border pb-4 pt-3">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-surface-hover"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                <Link href="/apply" className="btn btn-secondary text-sm text-center" onClick={() => setMenuOpen(false)}>
                  Apply for placement
                </Link>
                <Link href="/hire" className="btn btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
                  Request VA shortlist
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
