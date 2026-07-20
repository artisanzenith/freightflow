import { cn } from '@freightflow/ui';

export interface FormAlertProps {
  variant?: 'error' | 'success';
  children: React.ReactNode;
  className?: string;
}

/** Inline banner for form-level errors and success messages. */
export function FormAlert({ variant = 'error', children, className }: FormAlertProps) {
  const isError = variant === 'error';
  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        isError
          ? 'border-danger/30 bg-danger/5 text-danger'
          : 'border-success/30 bg-success/5 text-success',
        className,
      )}
    >
      {children}
    </div>
  );
}
