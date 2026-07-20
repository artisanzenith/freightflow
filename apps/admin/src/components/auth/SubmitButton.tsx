'use client';

import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from '@freightflow/ui';

export interface SubmitButtonProps extends Omit<ButtonProps, 'type'> {
  /** Label shown while the form action is pending. */
  pendingLabel?: string;
}

/**
 * Submit button that reflects the enclosing form's pending state (disabled +
 * busy label) via `useFormStatus`. Must be rendered inside a `<form>`.
 */
export function SubmitButton({
  children,
  pendingLabel = 'Please wait…',
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
