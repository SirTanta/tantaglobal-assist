import type { ReactNode } from 'react';

export interface CardProps {
  children?: ReactNode;
  tone?: 'default' | 'muted' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export function Card(_props: CardProps) {
  return null;
}
