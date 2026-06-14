import type { ReactNode } from 'react';

export interface FormButtonProps {
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormButton(_props: FormButtonProps) {
  return null;
}
