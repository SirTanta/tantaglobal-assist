import type { ReactNode } from 'react';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavProps {
  brand: NavLink;
  links: NavLink[];
  cta?: NavLink;
  className?: string;
  children?: ReactNode;
}

export function Nav(_props: NavProps) {
  return null;
}
