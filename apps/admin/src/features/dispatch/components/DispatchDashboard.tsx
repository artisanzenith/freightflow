'use client';

import { useCallback, useState } from 'react';

import { useDispatch } from '../useDispatch';
import { AvailabilityCard } from './AvailabilityCard';
import { DispatchStatus } from './DispatchStatus';
import { LoadOffersSection } from './LoadOffersSection';
import { CurrentLoadCard } from './CurrentLoadCard';
import { NextLoadPrep } from './NextLoadPrep';

export interface DispatchDashboardProps {
  /** Operator's first name for the greeting. */
  greetingName: string;
}

/**
 * The dispatch dashboard — the first screen after login and the core MVP
 * experience. Orchestrates the workflow via `useDispatch` and renders the
 * appropriate premium sections for each phase:
 *
 *   offline   → hero card only (calm, invites the operator to go online)
 *   searching → hero (online) + live dispatch status
 *   offers    → hero (online) + load offers
 *   active    → hero (online) + current load + next-load prep
 */
export function DispatchDashboard({ greetingName }: DispatchDashboardProps) {
  const dispatch = useDispatch();
  const [gpsPending, setGpsPending] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleUseGps = useCallback(() => {
    setGpsError(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError('Location services aren’t available on this device.');
      return;
    }

    setGpsPending(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch.useGpsLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGpsPending(false);
      },
      () => {
        setGpsError('We couldn’t get your location. Enter it manually instead.');
        setGpsPending(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          {greetingName ? `Hey, ${greetingName}` : 'Your dispatch'}
        </h1>
        <p className="text-neutral-600">
          Turn on Available for Loads — our dispatch team handles the rest.
        </p>
      </header>

      <AvailabilityCard
        isOnline={dispatch.isOnline}
        location={dispatch.location}
        onToggle={dispatch.toggleAvailability}
        onUseGps={handleUseGps}
        onManualLocation={dispatch.useManualLocation}
        gpsPending={gpsPending}
        gpsError={gpsError}
      />

      {dispatch.phase === 'searching' && <DispatchStatus />}

      {dispatch.phase === 'offers' && (
        <LoadOffersSection
          offers={dispatch.offers}
          onAccept={dispatch.acceptOffer}
          onSkip={dispatch.skipOffer}
        />
      )}

      {dispatch.phase === 'active' && dispatch.currentLoad && (
        <>
          <CurrentLoadCard load={dispatch.currentLoad} />
          <NextLoadPrep
            destinationCity={dispatch.currentLoad.destCity}
            destinationState={dispatch.currentLoad.destState}
          />
        </>
      )}
    </div>
  );
}
