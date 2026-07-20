'use client';

import { cn } from '@freightflow/ui';

export interface NextLoadPrepProps {
  /** Destination city of the active load — where we prep the next opportunity. */
  destinationCity: string;
  destinationState: string;
}

/**
 * Shown while a load is active. Communicates that dispatch is already lining up
 * the next load near the current destination. Progress indicators only — no
 * automatic searching happens here. This is the workflow seam for future
 * predictive/pre-booking integrations.
 */
export function NextLoadPrep({ destinationCity, destinationState }: NextLoadPrepProps) {
  const steps = [
    { label: 'Analyzing lanes near destination', state: 'done' as const },
    { label: `Watching outbound freight from ${destinationCity}, ${destinationState}`, state: 'active' as const },
    { label: 'Preparing best-fit offers for delivery day', state: 'pending' as const },
  ];

  return (
    <section
      aria-label="Next load preparation"
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
        >
          <CompassIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-navy-900">
            Preparing your next load
          </h3>
          <p className="text-sm text-neutral-500">
            Near {destinationCity}, {destinationState} — ready before you deliver.
          </p>
        </div>
      </div>

      <ol className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-start gap-3">
            <StepMarker state={step.state} last={index === steps.length - 1} />
            <div className="pt-0.5">
              <p
                className={cn(
                  'text-sm font-medium',
                  step.state === 'pending' ? 'text-neutral-400' : 'text-navy-900',
                )}
              >
                {step.label}
              </p>
              {step.state === 'active' && (
                <div className="mt-2 h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full w-1/2 rounded-full bg-brand-500 ff-shimmer relative" />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StepMarker({
  state,
  last,
}: {
  state: 'done' | 'active' | 'pending';
  last: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        aria-hidden
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full',
          state === 'done' && 'bg-success text-white',
          state === 'active' && 'bg-brand-100 text-brand-700',
          state === 'pending' && 'bg-neutral-100 text-neutral-400',
        )}
      >
        {state === 'done' ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : state === 'active' ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-400" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
          </span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
      {!last && <span className="mt-1 h-6 w-px bg-neutral-200" aria-hidden />}
    </div>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m15.5 8.5-2 5-5 2 2-5 5-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
