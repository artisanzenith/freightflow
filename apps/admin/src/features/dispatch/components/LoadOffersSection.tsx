'use client';

import { Badge } from '@freightflow/ui';

import type { LoadOffer } from '../types';
import { LoadOfferCard } from './LoadOfferCard';

export interface LoadOffersSectionProps {
  offers: LoadOffer[];
  onAccept: (offerId: string) => void;
  onSkip: (offerId: string) => void;
}

/**
 * Container for the dispatcher's current offers. Supports multiple simultaneous
 * offers; the operator accepts one or skips to keep the dispatcher searching.
 */
export function LoadOffersSection({ offers, onAccept, onSkip }: LoadOffersSectionProps) {
  return (
    <section aria-label="Load offers" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold tracking-tight text-navy-900">Loads for you</h3>
          <Badge variant="success">
            {offers.length} {offers.length === 1 ? 'offer' : 'offers'}
          </Badge>
        </div>
        <p className="hidden text-sm text-neutral-500 sm:block">
          Accept one — skipping keeps your dispatcher searching.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {offers.map((offer) => (
          <LoadOfferCard key={offer.id} offer={offer} onAccept={onAccept} onSkip={onSkip} />
        ))}
      </div>
    </section>
  );
}
