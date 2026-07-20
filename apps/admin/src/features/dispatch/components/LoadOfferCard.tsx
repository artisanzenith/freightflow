'use client';

import { useState } from 'react';
import { Badge, cn } from '@freightflow/ui';


import type { LoadOffer } from '../types';
import { sourceByKey } from '../sources';
import {
  formatAppointment,
  formatCurrency,
  formatMiles,
  formatPlace,
  formatWeight,
  ratePerMile,
} from '../format';

export interface LoadOfferCardProps {
  offer: LoadOffer;
  onAccept: (offerId: string) => void;
  onSkip: (offerId: string) => void;
}

/**
 * Premium card for a single dispatcher-presented load offer. Leads with the
 * lane and the money (rate + RPM), then the operational detail. Accept commits
 * the load; Skip only asks the dispatcher to keep searching (never a rejection).
 */
export function LoadOfferCard({ offer, onAccept, onSkip }: LoadOfferCardProps) {
  const [dismissing, setDismissing] = useState(false);
  const source = sourceByKey(offer.sourceKey);

  const handleSkip = () => {
    setDismissing(true);
    // Let the exit animation play before removing from the list.
    window.setTimeout(() => onSkip(offer.id), 180);
  };

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-sm transition-all duration-300 hover:border-brand-400/30 hover:shadow-glow',
        dismissing ? 'scale-[0.98] opacity-0' : 'animate-fade-in-up opacity-100',
      )}
    >

      {/* Accent rail */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />

      <div className="p-5 pl-6 sm:p-6 sm:pl-7">
        {/* Header: lane + source */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {source && (
              <Badge variant="brand" className="mb-2">
                {source.label}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              <span className="truncate">{formatPlace(offer.originCity, offer.originState)}</span>
              <ArrowIcon className="h-4 w-4 shrink-0 text-brand-400" />
              <span className="truncate">{formatPlace(offer.destCity, offer.destState)}</span>
            </div>
          </div>

          {/* Money block */}
          <div className="shrink-0 text-right">
            <p className="text-2xl font-extrabold tracking-tight text-white">
              {formatCurrency(offer.totalRate)}
            </p>
            <p className="text-sm font-semibold text-brand-300">
              {ratePerMile(offer)}
              <span className="text-neutral-500"> /mi</span>
            </p>
          </div>

        </div>

        {/* Appointments */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Appointment
            label="Pickup"
            place={formatPlace(offer.originCity, offer.originState)}
            when={formatAppointment(offer.pickupAppointment)}
            tone="pickup"
          />
          <Appointment
            label="Delivery"
            place={formatPlace(offer.destCity, offer.destState)}
            when={formatAppointment(offer.deliveryAppointment)}
            tone="delivery"
          />
        </div>

        {/* Stats */}
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4 sm:grid-cols-4">

          <Stat label="Loaded" value={formatMiles(offer.loadedMiles)} />
          <Stat label="Deadhead" value={formatMiles(offer.deadheadMiles)} />
          <Stat label="Weight" value={formatWeight(offer.weightLbs)} />
          <Stat label="Commodity" value={offer.commodity} />
        </dl>

        {/* Broker + notes */}
        {(offer.brokerName || offer.dispatcherNotes) && (
          <div className="mt-4 space-y-2 rounded-2xl bg-white/5 p-4">
            {offer.brokerName && (
              <p className="text-sm text-neutral-300">
                <span className="font-medium text-white">Broker:</span> {offer.brokerName}
              </p>
            )}
            {offer.dispatcherNotes && (
              <p className="flex gap-2 text-sm text-neutral-300">
                <NoteIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>{offer.dispatcherNotes}</span>
              </p>
            )}
          </div>

        )}

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-neutral-200 transition-colors hover:bg-white/10"
          >
            Skip this load
          </button>
          <button
            type="button"
            onClick={() => onAccept(offer.id)}
            className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-500"
          >
            Accept load
          </button>
        </div>

      </div>
    </article>
  );
}

function Appointment({
  label,
  place,
  when,
  tone,
}: {
  label: string;
  place: string;
  when: string;
  tone: 'pickup' | 'delivery';
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-white',
            tone === 'pickup' ? 'bg-brand-600' : 'bg-brand-400/30',
          )}
        >
          <PinIcon className="h-3.5 w-3.5" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {label}
        </span>
      </div>
      <p className="mt-1.5 truncate text-sm font-semibold text-white">{place}</p>
      <p className="text-sm text-neutral-400">{when}</p>
    </div>

  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold text-white">{value}</dd>
    </div>

  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a6 6 0 0 0-6 6c0 4.2 6 12 6 12s6-7.8 6-12a6 6 0 0 0-6-6Zm0 8.5A2.5 2.5 0 1 1 12 5.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function NoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8 8h8M8 12h6M6 4h12a1 1 0 0 1 1 1v14l-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
