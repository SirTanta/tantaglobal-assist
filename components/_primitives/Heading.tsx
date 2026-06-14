import type { ReactNode } from 'react';

export interface HeadingProps {
  children?: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function Heading(_props: HeadingProps) {
  return null;
}
