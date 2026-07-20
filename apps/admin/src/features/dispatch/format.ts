import type { CurrentLoadStatus, LoadOffer } from './types';

/** Format a USD amount without cents (e.g. $2,450). */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a whole-number mile count (e.g. 1,240 mi). */
export function formatMiles(miles: number): string {
  return `${new Intl.NumberFormat('en-US').format(Math.round(miles))} mi`;
}

/** Format weight in pounds (e.g. 42,000 lbs). */
export function formatWeight(lbs: number): string {
  return `${new Intl.NumberFormat('en-US').format(Math.round(lbs))} lbs`;
}

/** "City, ST" from parts. */
export function formatPlace(city: string, state: string): string {
  return `${city}, ${state}`;
}

/**
 * Rate per mile computed across loaded + deadhead miles (the all-in RPM the
 * operator actually experiences). Returns a value like `$2.15`.
 */
export function ratePerMile(offer: Pick<LoadOffer, 'totalRate' | 'loadedMiles' | 'deadheadMiles'>): string {
  const totalMiles = offer.loadedMiles + offer.deadheadMiles;
  if (totalMiles <= 0) return '—';
  const rpm = offer.totalRate / totalMiles;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rpm);
}

/** Format an ISO datetime as a friendly appointment (e.g. "Mon, Jul 21 · 2:00 PM"). */
export function formatAppointment(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const day = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${day} · ${time}`;
}

/** Format an ISO datetime as a compact ETA (e.g. "2:00 PM"). */
export function formatEta(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Human-readable label for a current-load status. */
export const CURRENT_LOAD_STATUS_LABELS: Record<CurrentLoadStatus, string> = {
  dispatched: 'Dispatched',
  en_route_pickup: 'En route to pickup',
  at_pickup: 'At pickup',
  loaded: 'Loaded',
  en_route_delivery: 'En route to delivery',
  at_delivery: 'At delivery',
  delivered: 'Delivered',
};
