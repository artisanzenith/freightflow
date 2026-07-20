'use client';

import { useId, useState } from 'react';
import { cn } from '@freightflow/ui';

import type { OperatorLocation } from '../types';

export interface AvailabilityCardProps {
  isOnline: boolean;
  location: OperatorLocation;
  onToggle: () => void;
  onUseGps: () => void;
  onManualLocation: (label: string) => void;
  /** True while a browser geolocation request is in flight. */
  gpsPending?: boolean;
  gpsError?: string | null;
}

/**
 * The hero status card and primary action of the application. A large, premium
 * surface that flips between a calm "offline" state and an energized "online"
 * state. The Available for Loads switch is the single most important control
 * on the dashboard.
 */
export function AvailabilityCard({
  isOnline,
  location,
  onToggle,
  onUseGps,
  onManualLocation,
  gpsPending = false,
  gpsError = null,
}: AvailabilityCardProps) {
  const switchId = useId();
  const [editingLocation, setEditingLocation] = useState(false);
  const [draftLocation, setDraftLocation] = useState(location.label);

  const commitManualLocation = () => {
    const trimmed = draftLocation.trim();
    if (trimmed) onManualLocation(trimmed);
    setEditingLocation(false);
  };

  return (
    <section
      aria-labelledby={`${switchId}-title`}
      className={cn(
        'relative overflow-hidden rounded-3xl border p-6 transition-all duration-500 sm:p-8',
        isOnline
          ? 'border-transparent bg-navy-900 text-white shadow-glow'
          : 'border-neutral-200 bg-white text-navy-900 shadow-lg',
      )}
    >
      {/* Ambient background flourish when online */}
      {isOnline && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-grid-navy [background-size:36px_36px] opacity-30" />
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
        </>
      )}

      <div className="relative flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusDot online={isOnline} />
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-widest',
                  isOnline ? 'text-brand-200' : 'text-neutral-500',
                )}
              >
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <h2
              id={`${switchId}-title`}
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Available for Loads
            </h2>
            <p className={cn('text-sm', isOnline ? 'text-navy-100' : 'text-neutral-600')}>
              {isOnline
                ? 'Your truck is live. Our dispatch team is finding your next load.'
                : 'Flip the switch and our dispatch team takes it from here.'}
            </p>
          </div>

          <AvailabilitySwitch id={switchId} checked={isOnline} onChange={onToggle} />
        </div>

        {/* Location controls */}
        <div
          className={cn(
            'rounded-2xl border p-4 transition-colors',
            isOnline ? 'border-white/10 bg-white/5' : 'border-neutral-200 bg-neutral-50',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  isOnline ? 'bg-white/10 text-brand-200' : 'bg-brand-50 text-brand-600',
                )}
              >
                <PinIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-xs font-medium uppercase tracking-wide',
                    isOnline ? 'text-navy-200' : 'text-neutral-500',
                  )}
                >
                  Search origin · {location.mode === 'gps' ? 'Live GPS' : 'Manual'}
                </p>
                {editingLocation ? (
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      autoFocus
                      value={draftLocation}
                      onChange={(event) => setDraftLocation(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') commitManualLocation();
                        if (event.key === 'Escape') setEditingLocation(false);
                      }}
                      placeholder="City, ST"
                      aria-label="Enter location"
                      className={cn(
                        'w-40 rounded-lg border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-brand-500',
                        isOnline
                          ? 'border-white/20 bg-navy-800 text-white placeholder:text-navy-300'
                          : 'border-neutral-300 bg-white text-navy-900',
                      )}
                    />
                    <button
                      type="button"
                      onClick={commitManualLocation}
                      className="rounded-lg bg-brand-600 px-3 py-1 text-sm font-semibold text-white hover:bg-brand-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="truncate text-base font-semibold">{location.label}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <LocationButton online={isOnline} onClick={onUseGps} disabled={gpsPending}>
              <GpsIcon className="h-4 w-4" />
              {gpsPending ? 'Locating…' : 'Use live GPS'}
            </LocationButton>
            <LocationButton
              online={isOnline}
              onClick={() => {
                setDraftLocation(location.label);
                setEditingLocation(true);
              }}
            >
              <EditIcon className="h-4 w-4" />
              Choose manually
            </LocationButton>
          </div>

          {gpsError && (
            <p className="mt-2 text-xs font-medium text-danger" role="alert">
              {gpsError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function StatusDot({ online }: { online: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {online && (
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-green-400" />
      )}
      <span
        className={cn(
          'relative inline-flex h-2.5 w-2.5 rounded-full',
          online ? 'bg-green-400' : 'bg-neutral-300',
        )}
      />
    </span>
  );
}

function AvailabilitySwitch({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Available for Loads"
      onClick={onChange}
      className={cn(
        'relative inline-flex h-9 w-16 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
        checked ? 'bg-green-500 focus-visible:ring-offset-navy-900' : 'bg-neutral-300',
      )}
    >
      <span
        className={cn(
          'inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-transform duration-300',
          checked ? 'translate-x-8' : 'translate-x-1',
        )}
      />
    </button>
  );
}

function LocationButton({
  online,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { online: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50',
        online
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-white text-navy-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-100',
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function GpsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v3M12 19v3M22 12h-3M5 12H2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 20h4L18.5 9.5a2.121 2.121 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
