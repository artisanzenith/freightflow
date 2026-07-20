import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Renders the input in an error state (red border + focus ring). */
  invalid?: boolean;
}

const base =
  'flex h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-navy-900 shadow-xs ' +
  'placeholder:text-neutral-400 transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

/** Single-line text field. Pair with `Label` and `FormField` for accessibility. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        base,
        invalid
          ? 'border-danger focus-visible:ring-danger'
          : 'border-neutral-300 focus-visible:ring-brand-500',
        className,
      )}
      {...props}
    />
  );
});
