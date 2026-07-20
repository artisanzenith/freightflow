import { forwardRef, type LabelHTMLAttributes } from 'react';

import { cn } from '../utils/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Appends a required marker for screen readers and sighted users. */
  required?: boolean;
}

/** Accessible form label. Always associate with a control via `htmlFor`. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, required = false, children, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-navy-800', className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-danger" aria-hidden="true">
          {' '}
          *
        </span>
      )}
    </label>
  );
});
