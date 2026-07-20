import type { Ionicons } from '@expo/vector-icons';

/**
 * Static sample data for the driver app screens. This is presentational
 * scaffolding only — no network calls or persistence. Values are illustrative
 * and will be replaced by Supabase-backed queries in a later phase.
 */

export interface DispatchSource {
  key: string;
  label: string;
  status: 'searching' | 'connected';
}

export const DISPATCH_SOURCES: DispatchSource[] = [
  { key: 'dat', label: 'DAT', status: 'searching' },
  { key: 'truckstop', label: 'Truckstop', status: 'searching' },
  { key: 'brokers', label: 'Direct Brokers', status: 'connected' },
  { key: 'private', label: 'Private Network', status: 'connected' },
];

export interface LoadOffer {
  id: string;
  origin: string;
  destination: string;
  rate: number;
  ratePerMile: number;
  miles: number;
  deadhead: number;
  weightLbs: number;
  equipment: string;
  commodity: string;
  pickup: string;
  delivery: string;
  broker: string;
  bestMatch?: boolean;
}

export const LOAD_OFFERS: LoadOffer[] = [
  {
    id: 'L-4821',
    origin: 'Dallas, TX',
    destination: 'Atlanta, GA',
    rate: 2850,
    ratePerMile: 3.68,
    miles: 775,
    deadhead: 22,
    weightLbs: 42000,
    equipment: 'Dry Van',
    commodity: 'Packaged Goods',
    pickup: 'Tomorrow, 8:00 AM',
    delivery: 'Wed, 2:00 PM',
    broker: 'TQL Logistics',
    bestMatch: true,
  },
  {
    id: 'L-4822',
    origin: 'Dallas, TX',
    destination: 'Memphis, TN',
    rate: 1420,
    ratePerMile: 2.94,
    miles: 483,
    deadhead: 15,
    weightLbs: 38000,
    equipment: 'Dry Van',
    commodity: 'Auto Parts',
    pickup: 'Tomorrow, 10:30 AM',
    delivery: 'Tue, 6:00 PM',
    broker: 'Coyote Logistics',
  },
  {
    id: 'L-4823',
    origin: 'Fort Worth, TX',
    destination: 'Oklahoma City, OK',
    rate: 890,
    ratePerMile: 2.71,
    miles: 328,
    deadhead: 40,
    weightLbs: 31000,
    equipment: 'Reefer',
    commodity: 'Produce',
    pickup: 'Tomorrow, 1:00 PM',
    delivery: 'Tue, 9:00 AM',
    broker: 'Echo Global',
  },
];

export type TripStatus = 'pickup' | 'transit' | 'delivered';

export interface TripStep {
  key: TripStatus;
  label: string;
  detail: string;
  state: 'done' | 'active' | 'pending';
}

export interface CurrentTrip {
  id: string;
  origin: string;
  destination: string;
  rate: number;
  miles: number;
  equipment: string;
  commodity: string;
  weightLbs: number;
  eta: string;
  dispatcher: { name: string; phone: string };
  steps: TripStep[];
}

export const CURRENT_TRIP: CurrentTrip = {
  id: 'L-4790',
  origin: 'Houston, TX',
  destination: 'Nashville, TN',
  rate: 2380,
  miles: 665,
  equipment: 'Dry Van',
  commodity: 'Building Materials',
  weightLbs: 40000,
  eta: 'Today, 4:45 PM',
  dispatcher: { name: 'Marcus Reed', phone: '+1 (555) 018-2245' },
  steps: [
    { key: 'pickup', label: 'Pickup', detail: 'Houston, TX · 6:10 AM', state: 'done' },
    { key: 'transit', label: 'In Transit', detail: '412 mi driven · on schedule', state: 'active' },
    { key: 'delivered', label: 'Delivered', detail: 'Nashville, TN · ETA 4:45 PM', state: 'pending' },
  ],
};

export interface Conversation {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  kind: 'dispatcher' | 'ai' | 'system';
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Marcus Reed',
    preview: 'Your BOL is confirmed. Safe travels!',
    time: '2m',
    unread: 2,
    online: true,
    kind: 'dispatcher',
  },
  {
    id: 'c2',
    name: 'FreightFlow AI',
    preview: 'I found 3 high-RPM loads near Nashville.',
    time: '18m',
    unread: 1,
    online: true,
    kind: 'ai',
  },
  {
    id: 'c3',
    name: 'System Notifications',
    preview: 'Rate confirmation for L-4790 uploaded.',
    time: '1h',
    unread: 0,
    online: false,
    kind: 'system',
  },
  {
    id: 'c4',
    name: 'Sarah Chen',
    preview: 'Detention approved for the Dallas stop.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    kind: 'dispatcher',
  },
];

export function conversationIcon(kind: Conversation['kind']): keyof typeof Ionicons.glyphMap {
  switch (kind) {
    case 'ai':
      return 'sparkles';
    case 'system':
      return 'notifications';
    default:
      return 'person';
  }
}

export interface ProfileDoc {
  key: string;
  label: string;
  status: 'valid' | 'expiring' | 'missing';
  detail: string;
}

export const PROFILE_DOCS: ProfileDoc[] = [
  { key: 'cdl', label: 'CDL License', status: 'valid', detail: 'Expires 03/2027' },
  { key: 'medical', label: 'Medical Card', status: 'expiring', detail: 'Expires 09/2026' },
  { key: 'insurance', label: 'Insurance COI', status: 'valid', detail: 'Expires 12/2026' },
  { key: 'w9', label: 'W-9 Form', status: 'missing', detail: 'Not uploaded' },
];

export const DRIVER = {
  name: 'James Carter',
  role: 'Owner-Operator',
  rating: 4.9,
  truck: {
    unit: 'Unit 218',
    type: 'Freightliner Cascadia',
    equipment: 'Dry Van · 53 ft',
    plate: 'TX · 8LM-4421',
  },
  preferences: {
    lanes: 'Southeast · Texas Triangle',
    maxDeadhead: '50 mi',
    minRate: '$2.50 / mi',
    homeBase: 'Dallas, TX',
  },
  payment: {
    method: 'Direct Deposit',
    account: 'Chase ••• 4821',
    factoring: 'Not enrolled',
  },
};
