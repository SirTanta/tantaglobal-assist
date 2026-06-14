"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="section-container">
        <nav
          className="flex items-center justify-between h-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 no-underline"
            aria-label="TantaGlobal Assist — home"
          >
            <Image
              src="/logo-transparent.png"
              alt="TantaGlobal Assist"
              width={160}
              height={160}
              style={{ width: "160px", height: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors no-underline"
                style={{ color: "#2D3748" }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/apply" className="btn-secondary text-sm px-4 py-2">
              Apply as VA
            </Link>
            <Link href="/hire" className="btn-primary text-sm px-4 py-2">
              Hire a VA
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            style={{ color: "#2D3748" }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t py-4 flex flex-col gap-3"
            style={{ borderColor: "#cbd5e1" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium py-1 no-underline"
                style={{ color: "#2D3748" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/apply"
                className="btn-secondary text-sm text-center"
                onClick={() => setMenuOpen(false)}
              >
                Apply as VA
              </Link>
              <Link
                href="/hire"
                className="btn-primary text-sm text-center"
                onClick={() => setMenuOpen(false)}
              >
                Hire a VA
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
