'use client';

import { Badge, cn } from '@freightflow/ui';

import type { CurrentLoad } from '../types';
import {
  CURRENT_LOAD_STATUS_LABELS,
  formatAppointment,
  formatCurrency,
  formatEta,
  formatMiles,
  formatPlace,
  ratePerMile,
} from '../format';

export interface CurrentLoadCardProps {
  load: CurrentLoad;
}

/**
 * The dedicated Current Load section shown once an offer is accepted. Surfaces
 * pickup/delivery, live status + ETA, dispatcher contact, and quick shortcuts
 * to documents and navigation (navigation is a placeholder for now).
 */
export function CurrentLoadCard({ load }: CurrentLoadCardProps) {
  return (
    <section
      aria-label="Current load"
      className="relative overflow-hidden rounded-3xl border border-transparent bg-navy-900 text-white shadow-glow"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-navy [background-size:36px_36px] opacity-25" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-green-400" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-200">
              Current load
            </span>
          </div>
          <Badge variant="accent">{CURRENT_LOAD_STATUS_LABELS[load.status]}</Badge>
        </div>

        {/* Lane */}
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <LegPoint
            label="Pickup"
            place={formatPlace(load.originCity, load.originState)}
            when={formatAppointment(load.pickupAppointment)}
          />
          <RouteConnector />
          <LegPoint
            label="Delivery"
            place={formatPlace(load.destCity, load.destState)}
            when={formatAppointment(load.deliveryAppointment)}
            align="right"
          />
        </div>

        {/* Key figures */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Figure label="ETA" value={formatEta(load.eta)} highlight />
          <Figure label="Rate" value={formatCurrency(load.totalRate)} />
          <Figure label="RPM" value={`${ratePerMile(load)}/mi`} />
          <Figure label="Loaded" value={formatMiles(load.loadedMiles)} />
        </div>

        {/* Dispatcher + shortcuts */}
        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-brand-100"
            >
              <HeadsetIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-navy-200">
                Your dispatcher
              </p>
              <p className="font-semibold">{load.dispatcher.name}</p>
              <a
                href={`tel:${load.dispatcher.phone.replace(/[^+\d]/g, '')}`}
                className="text-sm text-brand-200 hover:text-brand-100"
              >
                {load.dispatcher.phone}
              </a>
            </div>
          </div>

          <div className="flex gap-2">
            <Shortcut href="/app/documents">
              <DocIcon className="h-4 w-4" />
              Documents
            </Shortcut>
            <Shortcut disabled title="Navigation coming soon">
              <NavIcon className="h-4 w-4" />
              Navigate
            </Shortcut>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegPoint({
  label,
  place,
  when,
  align = 'left',
}: {
  label: string;
  place: string;
  when: string;
  align?: 'left' | 'right';
}) {
  return (
    <div className={cn(align === 'right' && 'sm:text-right')}>
      <p className="text-xs font-medium uppercase tracking-wide text-navy-200">{label}</p>
      <p className="mt-1 text-lg font-bold tracking-tight">{place}</p>
      <p className="text-sm text-navy-100">{when}</p>
    </div>
  );
}

function RouteConnector() {
  return (
    <div className="flex items-center gap-1 text-brand-300 sm:flex-col sm:gap-0" aria-hidden>
      <span className="h-px w-8 bg-brand-400/40 sm:h-8 sm:w-px" />
      <TruckIcon className="h-5 w-5" />
      <span className="h-px w-8 bg-brand-400/40 sm:h-8 sm:w-px" />
    </div>
  );
}

function Figure({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 p-3',
        highlight ? 'bg-brand-500/20' : 'bg-white/5',
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-navy-200">{label}</p>
      <p className="mt-0.5 text-lg font-bold tracking-tight">{value}</p>
    </div>
  );
}

function Shortcut({
  href,
  children,
  disabled = false,
  title,
}: {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}) {
  const className =
    'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors';

  if (disabled || !href) {
    return (
      <span
        title={title}
        aria-disabled="true"
        className={cn(className, 'cursor-not-allowed bg-white/5 text-navy-300')}
      >
        {children}
      </span>
    );
  }

  return (
    <a href={href} className={cn(className, 'bg-white/10 text-white hover:bg-white/20')}>
      {children}
    </a>
  );
}

function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 13v-1a8 8 0 0 1 16 0v1M4 13a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v-5H4Zm16 0h-1v5h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Zm-1 5a4 4 0 0 1-4 4h-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function NavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 11 21 3l-8 18-2-8-8-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 6h10v9H3V6Zm10 3h4l3 3v3h-7V9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
