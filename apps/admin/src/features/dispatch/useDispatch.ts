'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  AvailabilityStatus,
  CurrentLoad,
  DispatchPhase,
  LoadOffer,
  LocationMode,
  OperatorLocation,
} from './types';
import { SAMPLE_OFFERS, currentLoadFromOffer } from './sample-data';

/**
 * Client-side state machine for the owner-operator dispatch workflow.
 *
 * Responsibilities:
 *   - Track availability (online/offline) and the operator's search location.
 *   - Drive the visual "searching" phase, then surface offers.
 *   - Handle accept/skip on offers and expose the accepted Current Load.
 *
 * This deliberately owns no network logic. Offers currently come from local
 * sample data; a future integration layer can replace the offer source without
 * changing the component tree, since everything downstream consumes the
 * returned view-model. The `phase` is derived from availability, offers, and
 * the current load — there is no separate "searching" flag to keep in sync.
 */

/** How long the visual "searching" phase runs before offers appear (ms). */
const SEARCH_DURATION_MS = 4200;

const DEFAULT_LOCATION: OperatorLocation = {
  mode: 'manual',
  label: 'Dallas, TX',
};

export interface UseDispatchResult {
  phase: DispatchPhase;
  availability: AvailabilityStatus;
  isOnline: boolean;
  location: OperatorLocation;
  offers: LoadOffer[];
  currentLoad: CurrentLoad | null;
  /** Toggle availability. Turning on begins searching; off resets to idle. */
  setAvailability: (next: AvailabilityStatus) => void;
  toggleAvailability: () => void;
  /** Update the search location (GPS or manual). */
  setLocation: (location: OperatorLocation) => void;
  useGpsLocation: (coords: { latitude: number; longitude: number; label?: string }) => void;
  useManualLocation: (label: string) => void;
  /** Accept an offer → moves to the active phase with a Current Load. */
  acceptOffer: (offerId: string) => void;
  /** Skip an offer → removes it and keeps searching (never rejects a customer). */
  skipOffer: (offerId: string) => void;
}

export function useDispatch(): UseDispatchResult {
  const [availability, setAvailabilityState] = useState<AvailabilityStatus>('offline');
  const [location, setLocationState] = useState<OperatorLocation>(DEFAULT_LOCATION);
  const [offers, setOffers] = useState<LoadOffer[]>([]);
  const [currentLoad, setCurrentLoad] = useState<CurrentLoad | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSearchTimer = useCallback(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }
  }, []);

  // Clean up any pending timer on unmount.
  useEffect(() => clearSearchTimer, [clearSearchTimer]);

  const beginSearch = useCallback(() => {
    clearSearchTimer();
    setOffers([]);
    searchTimer.current = setTimeout(() => {
      setOffers(SAMPLE_OFFERS);
    }, SEARCH_DURATION_MS);
  }, [clearSearchTimer]);

  const setAvailability = useCallback(
    (next: AvailabilityStatus) => {
      setAvailabilityState(next);
      if (next === 'online') {
        // Only (re)start searching if no load is active.
        setCurrentLoad((active) => {
          if (!active) beginSearch();
          return active;
        });
      } else {
        clearSearchTimer();
        setOffers([]);
      }
    },
    [beginSearch, clearSearchTimer],
  );

  const toggleAvailability = useCallback(() => {
    setAvailability(availability === 'online' ? 'offline' : 'online');
  }, [availability, setAvailability]);

  const setLocation = useCallback((next: OperatorLocation) => {
    setLocationState(next);
  }, []);

  const useGpsLocation = useCallback(
    (coords: { latitude: number; longitude: number; label?: string }) => {
      setLocationState({
        mode: 'gps',
        label: coords.label ?? 'Current location',
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    },
    [],
  );

  const useManualLocation = useCallback((label: string) => {
    const mode: LocationMode = 'manual';
    setLocationState({ mode, label });
  }, []);

  const acceptOffer = useCallback(
    (offerId: string) => {
      setOffers((current) => {
        const chosen = current.find((offer) => offer.id === offerId);
        if (chosen) {
          setCurrentLoad(currentLoadFromOffer(chosen));
          clearSearchTimer();
        }
        return [];
      });
    },
    [clearSearchTimer],
  );

  const skipOffer = useCallback((offerId: string) => {
    // Skipping only tells the dispatcher to keep searching — never a rejection.
    setOffers((current) => current.filter((offer) => offer.id !== offerId));
  }, []);

  const phase: DispatchPhase = useMemo(() => {
    if (currentLoad) return 'active';
    if (availability === 'offline') return 'offline';
    if (offers.length > 0) return 'offers';
    return 'searching';
  }, [availability, currentLoad, offers.length]);

  return {
    phase,
    availability,
    isOnline: availability === 'online',
    location,
    offers,
    currentLoad,
    setAvailability,
    toggleAvailability,
    setLocation,
    useGpsLocation,
    useManualLocation,
    acceptOffer,
    skipOffer,
  };
}
