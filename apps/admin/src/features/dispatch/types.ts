/**
 * Dispatch domain types.
 *
 * These describe the owner-operator dispatch workflow surfaced on the
 * dashboard. They are intentionally decoupled from the database row shapes so
 * the UI can evolve independently and so future load-board integrations (DAT,
 * Truckstop, Sylectus, direct brokers) can map their payloads onto a single
 * shared shape (`LoadOffer`).
 */

/** Whether the operator is broadcasting availability to dispatch. */
export type AvailabilityStatus = 'online' | 'offline';

/** How the operator's current location was determined. */
export type LocationMode = 'gps' | 'manual';

/** Operator location used as the search origin. */
export interface OperatorLocation {
  mode: LocationMode;
  /** Human-readable "City, ST". */
  label: string;
  latitude?: number;
  longitude?: number;
}

/**
 * A source the dispatch team searches on the operator's behalf. `key` values
 * map to future integrations; `integrationReady: false` marks visual-only
 * sources that are not yet wired to a live API.
 */
export interface DispatchSource {
  key: 'direct_brokers' | 'dat' | 'truckstop' | 'sylectus' | 'private_customers' | 'dedicated';
  label: string;
  /** Short verb phrase shown in the live status ticker. */
  searchingLabel: string;
  integrationReady: boolean;
}

/** High-level phase of the dispatch workflow. */
export type DispatchPhase =
  | 'offline' // operator not available
  | 'searching' // available, dispatch scanning sources
  | 'offers' // one or more offers presented
  | 'active'; // a load has been accepted and is in progress

/** A dispatcher-presented load offer. */
export interface LoadOffer {
  id: string;
  /** Origin. */
  originCity: string;
  originState: string;
  /** Destination. */
  destCity: string;
  destState: string;
  /** ISO datetime strings for appointment windows. */
  pickupAppointment: string;
  deliveryAppointment: string;
  loadedMiles: number;
  deadheadMiles: number;
  /** Total line-haul rate in USD. */
  totalRate: number;
  weightLbs: number;
  commodity: string;
  brokerName?: string;
  dispatcherNotes?: string;
  /** Which source the offer originated from. */
  sourceKey: DispatchSource['key'];
}

/** Lifecycle status of an accepted load. */
export type CurrentLoadStatus =
  | 'dispatched'
  | 'en_route_pickup'
  | 'at_pickup'
  | 'loaded'
  | 'en_route_delivery'
  | 'at_delivery'
  | 'delivered';

/** An accepted, in-progress load shown in the Current Load section. */
export interface CurrentLoad extends LoadOffer {
  status: CurrentLoadStatus;
  /** ISO datetime — estimated arrival at the active leg's destination. */
  eta: string;
  dispatcher: {
    name: string;
    phone: string;
  };
}
