import type { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  name: string;
  id?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FormField(_props: FormFieldProps) {
  return null;
}
