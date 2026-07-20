'use client';

import { useEffect, useState } from 'react';
import { cn } from '@freightflow/ui';

import { DISPATCH_SOURCES } from '../sources';

/** How long each source stays "active" in the ticker (ms). */
const SOURCE_CYCLE_MS = 1400;

/**
 * Premium live status section shown while the operator is Available and dispatch
 * is searching. Cycles through the sources our team scans on the operator's
 * behalf. These are visual workflow states only — no load board is integrated.
 */
export function DispatchStatus() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % DISPATCH_SOURCES.length);
    }, SOURCE_CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="Dispatch search status"
      aria-live="polite"
      className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg sm:p-8"
    >
      <div className="flex items-center gap-3">
        <RadarIcon className="h-6 w-6 text-brand-600" />
        <div>
          <h3 className="text-lg font-bold tracking-tight text-navy-900">
            Searching for your next load
          </h3>
          <p className="text-sm text-neutral-500">
            Our dispatch team is scanning every source in real time.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {DISPATCH_SOURCES.map((source, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;
          return (
            <li
              key={source.key}
              className={cn(
                'relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-500',
                isActive
                  ? 'border-brand-200 bg-brand-50 ff-shimmer'
                  : 'border-neutral-200 bg-neutral-50',
              )}
            >
              <SourceIndicator active={isActive} done={isDone} />
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive ? 'text-brand-800' : 'text-neutral-600',
                )}
              >
                {source.searchingLabel}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SourceIndicator({ active, done }: { active: boolean; done: boolean }) {
  if (done) {
    return (
      <span
        aria-hidden
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
      {active && (
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-400" />
      )}
      <span
        className={cn(
          'relative inline-flex h-2.5 w-2.5 rounded-full',
          active ? 'bg-brand-500' : 'bg-neutral-300',
        )}
      />
    </span>
  );
}

function RadarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" opacity="0.4" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <path d="M12 12 19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
