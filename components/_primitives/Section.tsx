import type { ReactNode } from 'react';

export interface SectionProps {
  children?: ReactNode;
  as?: 'section' | 'div';
  tone?: 'default' | 'muted' | 'accent';
  padding?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
}

export function Section(_props: SectionProps) {
  return null;
}
