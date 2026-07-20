import { type HTMLAttributes } from 'react';

import { cn } from '../utils/cn';

export type BadgeVariant = 'brand' | 'accent' | 'neutral' | 'success' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200',
  accent: 'bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200',
  neutral: 'bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200',
  success: 'bg-green-50 text-success ring-1 ring-inset ring-green-200',
  outline: 'text-navy-700 ring-1 ring-inset ring-neutral-300',
};

/** Small status/label pill. */
export function Badge({ className, variant = 'brand', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
