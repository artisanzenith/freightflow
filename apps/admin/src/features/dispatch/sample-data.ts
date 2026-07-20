import type { CurrentLoad, LoadOffer } from './types';

/**
 * Sample dispatch offers used to demonstrate the workflow UI.
 *
 * IMPORTANT: This is presentation-only sample data, isolated in a single module
 * so it is trivial to delete. When load-board integrations land, replace the
 * import site (`useDispatch`) with a data source that fetches real offers; the
 * component layer consumes the `LoadOffer`/`CurrentLoad` types and does not care
 * where the data originates.
 */

/** Offset an appointment by a number of hours from now, as an ISO string. */
function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export const SAMPLE_OFFERS: LoadOffer[] = [
  {
    id: 'offer-1001',
    originCity: 'Dallas',
    originState: 'TX',
    destCity: 'Atlanta',
    destState: 'GA',
    pickupAppointment: hoursFromNow(6),
    deliveryAppointment: hoursFromNow(34),
    loadedMiles: 781,
    deadheadMiles: 22,
    totalRate: 2100,
    weightLbs: 42000,
    commodity: 'General freight',
    brokerName: 'Coyote Logistics',
    dispatcherNotes: 'Drop-and-hook at pickup. Solid lane, reload available in ATL.',
    sourceKey: 'direct_brokers',
  },
  {
    id: 'offer-1002',
    originCity: 'Fort Worth',
    originState: 'TX',
    destCity: 'Memphis',
    destState: 'TN',
    pickupAppointment: hoursFromNow(5),
    deliveryAppointment: hoursFromNow(20),
    loadedMiles: 452,
    deadheadMiles: 35,
    totalRate: 1180,
    weightLbs: 38500,
    commodity: 'Palletized dry goods',
    brokerName: 'TQL',
    dispatcherNotes: 'Appointment is firm. Lumper reimbursed with receipt.',
    sourceKey: 'dat',
  },
  {
    id: 'offer-1003',
    originCity: 'Dallas',
    originState: 'TX',
    destCity: 'Oklahoma City',
    destState: 'OK',
    pickupAppointment: hoursFromNow(4),
    deliveryAppointment: hoursFromNow(12),
    loadedMiles: 206,
    deadheadMiles: 12,
    totalRate: 720,
    weightLbs: 26000,
    commodity: 'Building materials',
    dispatcherNotes: 'Short hop to reposition north. Great RPM for the miles.',
    sourceKey: 'private_customers',
  },
];

/**
 * Builds a sample accepted load from an offer, so the Current Load section has
 * realistic content to render once "Accept" is pressed.
 */
export function currentLoadFromOffer(offer: LoadOffer): CurrentLoad {
  return {
    ...offer,
    status: 'en_route_pickup',
    eta: offer.pickupAppointment,
    dispatcher: {
      name: 'Marcus Bell',
      phone: '+1 (555) 018-2245',
    },
  };
}
