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
 * dark surface that intensifies when the operator goes online. The Available
 * for Loads switch is the single most important control on the dashboard.
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
          ? 'border-brand-400/30 bg-gradient-to-br from-navy-800 to-navy-900 shadow-glow'
          : 'border-white/10 bg-navy-900',
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
                  isOnline ? 'text-brand-200' : 'text-neutral-400',
                )}
              >
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <h2
              id={`${switchId}-title`}
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Available for Loads
            </h2>
            <p className={cn('text-sm', isOnline ? 'text-navy-100' : 'text-neutral-400')}>
              {isOnline
                ? 'Your truck is live. Our dispatch team is finding your next load.'
                : 'Flip the switch and our dispatch team takes it from here.'}
            </p>
          </div>

          <AvailabilitySwitch id={switchId} checked={isOnline} onChange={onToggle} />
        </div>

        {/* Location controls */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-200"
              >
                <PinIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-navy-200">
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
                      className="w-40 rounded-lg border border-white/20 bg-navy-800 px-2 py-1 text-sm text-white outline-none placeholder:text-navy-300 focus:ring-2 focus:ring-brand-500"
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
                  <p className="truncate text-base font-semibold text-white">{location.label}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <LocationButton onClick={onUseGps} disabled={gpsPending}>
              <GpsIcon className="h-4 w-4" />
              {gpsPending ? 'Locating…' : 'Use live GPS'}
            </LocationButton>
            <LocationButton
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
            <p className="mt-2 text-xs font-medium text-red-400" role="alert">
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
          online ? 'bg-green-400' : 'bg-neutral-500',
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
        'relative inline-flex h-9 w-16 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900',
        checked ? 'bg-green-500 focus-visible:ring-green-400' : 'bg-neutral-600 focus-visible:ring-brand-400',
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
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
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
