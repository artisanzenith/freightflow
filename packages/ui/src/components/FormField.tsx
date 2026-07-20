import { type ReactNode, useId } from 'react';

import { cn } from '../utils/cn';
import { Label } from './Label';

export interface FormFieldProps {
  label: string;
  /** Optional hint shown beneath the label. */
  hint?: string;
  /** Error message; when present the field is announced as invalid. */
  error?: string;
  required?: boolean;
  className?: string;
  /**
   * Render prop receiving the generated ids to wire onto the control:
   * `id`, `aria-describedby`, and `aria-invalid`.
   */
  children: (field: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
  }) => ReactNode;
}

/**
 * Accessible label + control + hint/error wrapper. Generates stable ids and
 * wires ARIA attributes so screen readers announce hints and errors correctly.
 */
export function FormField({
  label,
  hint,
  error,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {hint && (
        <p id={hintId} className="text-xs text-neutral-500">
          {hint}
        </p>
      )}
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}
      {error && (
        <p id={errorId} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
