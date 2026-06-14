import type { ReactNode } from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  brand: FooterLink;
  links: FooterLink[];
  socialLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  className?: string;
  children?: ReactNode;
}

export function Footer(_props: FooterProps) {
  return null;
}
