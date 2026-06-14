import type { ReactNode } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  disabled?: boolean;
  className?: string;
}

export function Button(_props: ButtonProps) {
  return null;
}
