import type { ReactNode } from 'react';

export interface BodyProps {
  children?: ReactNode;
  as?: 'p' | 'span' | 'div';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Body(_props: BodyProps) {
  return null;
}
