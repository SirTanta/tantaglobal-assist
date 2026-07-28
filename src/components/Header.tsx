"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { READING_LOCATION } from "@/lib/reading-location";

/**
 * Global Assist Header — Instruments of Passage thin bar.
 *
 * Spec: shared-component-system.md §2
 * - instruments-daylight background
 * - Thin bar: logo + filing label + page links
 * - Max 5 nav items
 * - Gold divider rule below the bar
 * - No glass-nav blur
 */

const navLinks = [
  { href: "/",                    label: "Home" },
  { href: "/how-it-works",        label: "How it works" },
  { href: "/pricing",             label: "Pricing" },
  { href: "/about",               label: "About" },
  { href: "/contact",             label: "Contact" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-instruments-daylight/95 backdrop-blur-sm shadow-[0_1px_0_rgba(90,70,50,0.08),0_2px_12px_rgba(43,31,18,0.06)]"
          : "bg-instruments-daylight"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14 gap-6">

          {/* Logo + wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="TantaGlobal Assist — home"
          >
            <Image
              src="/logo-transparent.png"
              alt="TantaGlobal Assist"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="font-display text-sm font-semibold text-instruments-teak tracking-tight">
              TantaGlobal Assist
            </span>
            <span className="hidden sm:block w-px h-3.5 bg-instruments-shadow/25 mx-0.5" aria-hidden="true" />
            <span className="hidden sm:block instr-filing">{READING_LOCATION}</span>
          </Link>

          {/* Primary nav — max 5 items */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-sans text-sm transition-colors px-3 py-2 rounded-lg ${
                    isActive
                      ? "bg-instruments-teak text-instruments-vellum"
                      : "text-instruments-shadow hover:text-instruments-teak hover:bg-instruments-teak/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA — two primary actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/apply"
              data-ga4-action="cta_apply_nav"
              data-ga4-label="header"
              data-ga4-zone="Z0"
              data-ga4-page="NAVIGATION"
              className="instr-btn-ghost !py-1.5 !px-4 !text-xs"
            >
              Apply for placement
            </Link>
            <Link
              href="/hire"
              data-ga4-action="cta_hire_nav"
              data-ga4-label="header"
              data-ga4-zone="Z0"
              data-ga4-page="NAVIGATION"
              className="instr-btn-primary !py-1.5 !px-4 !text-xs"
            >
              Request VA shortlist
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <MobileMenu pathname={pathname} />
        </div>
      </div>

      {/* Gold divider rule — Instruments signature */}
      <div className="instr-rule-gold" />
    </header>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const menuId = "mobile-menu";

  return (
    <div className="lg:hidden">
      <button
        className="p-2 rounded-lg text-instruments-shadow hover:bg-instruments-teak/5 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute left-0 right-0 top-full bg-instruments-daylight border-b border-instruments-shadow/10 shadow-lg z-40"
        >
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-sans text-sm rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-instruments-teak text-instruments-vellum"
                      : "text-instruments-shadow hover:text-instruments-teak hover:bg-instruments-teak/5"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-instruments-shadow/10 mt-2 pt-3 flex flex-col gap-2">
              <Link
                href="/apply"
                data-ga4-action="cta_apply_nav"
                data-ga4-label="mobile-menu"
                data-ga4-zone="Z0"
                data-ga4-page="NAVIGATION"
                className="instr-btn-ghost !py-2 !px-4 !text-xs text-center"
                onClick={() => setOpen(false)}
              >
                Apply for placement
              </Link>
              <Link
                href="/hire"
                data-ga4-action="cta_hire_nav"
                data-ga4-label="mobile-menu"
                data-ga4-zone="Z0"
                data-ga4-page="NAVIGATION"
                className="instr-btn-primary !py-2 !px-4 !text-xs text-center"
                onClick={() => setOpen(false)}
              >
                Request VA shortlist
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
