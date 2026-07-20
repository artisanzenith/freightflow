/**
 * FreightFlow — Reusable database types
 *
 * These types mirror the SQL schema defined in `supabase/migrations`. They are
 * hand-authored to stay readable and are the single source of truth consumed by
 * the mobile app, admin portal, and API package.
 *
 * When the schema changes, either update these by hand alongside the migration,
 * or regenerate the canonical `Database` type with:
 *
 *   pnpm --filter @freightflow/shared gen:types
 *
 * (see package.json — requires a linked Supabase project or local instance).
 */

// --- Enums ------------------------------------------------------------------

export type UserRole = 'owner' | 'dispatcher' | 'driver' | 'accountant' | 'admin';

export type UserStatus = 'invited' | 'active' | 'suspended' | 'deactivated';

export type CompanyType = 'owner_operator' | 'small_fleet' | 'carrier' | 'broker';

export type EquipmentStatus = 'active' | 'in_maintenance' | 'out_of_service' | 'retired';

export type TrailerType =
  'dry_van' | 'reefer' | 'flatbed' | 'step_deck' | 'lowboy' | 'tanker' | 'car_hauler' | 'other';

export type LoadRequestStatus =
  'new' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'expired' | 'converted';

export type LoadStatus =
  | 'draft'
  | 'posted'
  | 'assigned'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type MessageType = 'text' | 'system' | 'attachment';

export type NotificationType = 'load' | 'document' | 'message' | 'payment' | 'system';

export type ExpenseCategory =
  | 'fuel'
  | 'maintenance'
  | 'tolls'
  | 'insurance'
  | 'permits'
  | 'lease'
  | 'payroll'
  | 'meals'
  | 'lodging'
  | 'other';

export type PaymentStatus = 'pending' | 'invoiced' | 'paid' | 'overdue' | 'void';

// --- Shared helpers ---------------------------------------------------------

/** ISO-8601 timestamp string (timestamptz). */
export type Timestamp = string;
/** ISO-8601 date string (date). */
export type DateString = string;
/** UUID string. */
export type UUID = string;

// --- Row types (one per table) ----------------------------------------------

export interface Company {
  id: UUID;
  name: string;
  legal_name: string | null;
  type: CompanyType;
  mc_number: string | null;
  dot_number: string | null;
  ein: string | null;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  timezone: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface User {
  id: UUID;
  company_id: UUID | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  full_name: string | null;
  phone: string | null;
  last_seen_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Profile {
  id: UUID;
  company_id: UUID;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_path: string | null;
  bio: string | null;
  date_of_birth: DateString | null;
  cdl_number: string | null;
  cdl_state: string | null;
  cdl_expiry: DateString | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Truck {
  id: UUID;
  company_id: UUID;
  assigned_driver_id: UUID | null;
  unit_number: string;
  make: string | null;
  model: string | null;
  year: number | null;
  vin: string | null;
  license_plate: string | null;
  license_state: string | null;
  color: string | null;
  status: EquipmentStatus;
  odometer: number | null;
  fuel_capacity_gal: number | null;
  notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Trailer {
  id: UUID;
  company_id: UUID;
  unit_number: string;
  type: TrailerType;
  make: string | null;
  model: string | null;
  year: number | null;
  vin: string | null;
  license_plate: string | null;
  license_state: string | null;
  length_ft: number | null;
  capacity_lbs: number | null;
  status: EquipmentStatus;
  notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface LoadRequest {
  id: UUID;
  company_id: UUID;
  created_by: UUID | null;
  status: LoadRequestStatus;
  reference_number: string | null;
  broker_name: string | null;
  broker_contact: string | null;
  broker_phone: string | null;
  broker_email: string | null;
  origin_city: string | null;
  origin_state: string | null;
  origin_postal_code: string | null;
  pickup_date: DateString | null;
  dest_city: string | null;
  dest_state: string | null;
  dest_postal_code: string | null;
  delivery_date: DateString | null;
  commodity: string | null;
  weight_lbs: number | null;
  distance_miles: number | null;
  equipment_type: TrailerType | null;
  offered_rate: number | null;
  quoted_rate: number | null;
  notes: string | null;
  expires_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Load {
  id: UUID;
  company_id: UUID;
  load_request_id: UUID | null;
  load_number: string;
  status: LoadStatus;
  driver_id: UUID | null;
  truck_id: UUID | null;
  trailer_id: UUID | null;
  dispatched_by: UUID | null;
  broker_name: string | null;
  reference_number: string | null;
  origin_city: string | null;
  origin_state: string | null;
  origin_postal_code: string | null;
  pickup_date: DateString | null;
  pickup_window_start: Timestamp | null;
  pickup_window_end: Timestamp | null;
  dest_city: string | null;
  dest_state: string | null;
  dest_postal_code: string | null;
  delivery_date: DateString | null;
  delivery_window_start: Timestamp | null;
  delivery_window_end: Timestamp | null;
  commodity: string | null;
  weight_lbs: number | null;
  distance_miles: number | null;
  rate: number | null;
  currency: string;
  notes: string | null;
  dispatched_at: Timestamp | null;
  delivered_at: Timestamp | null;
  completed_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface LoadStatusHistory {
  id: UUID;
  company_id: UUID;
  load_id: UUID;
  changed_by: UUID | null;
  from_status: LoadStatus | null;
  to_status: LoadStatus;
  note: string | null;
  created_at: Timestamp;
}

export interface DocumentCategory {
  id: UUID;
  company_id: UUID | null;
  name: string;
  slug: string;
  description: string | null;
  is_system: boolean;
  sort_order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Document {
  id: UUID;
  company_id: UUID;
  category_id: UUID | null;
  uploaded_by: UUID | null;
  load_id: UUID | null;
  truck_id: UUID | null;
  trailer_id: UUID | null;
  user_id: UUID | null;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  title: string | null;
  description: string | null;
  expires_at: DateString | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Message {
  id: UUID;
  company_id: UUID;
  thread_id: UUID;
  sender_id: UUID | null;
  recipient_id: UUID | null;
  load_id: UUID | null;
  type: MessageType;
  body: string | null;
  document_id: UUID | null;
  read_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Notification {
  id: UUID;
  company_id: UUID;
  user_id: UUID;
  type: NotificationType;
  title: string;
  body: string | null;
  load_id: UUID | null;
  document_id: UUID | null;
  message_id: UUID | null;
  data: Record<string, unknown>;
  read_at: Timestamp | null;
  created_at: Timestamp;
}

export interface Expense {
  id: UUID;
  company_id: UUID;
  created_by: UUID | null;
  load_id: UUID | null;
  truck_id: UUID | null;
  driver_id: UUID | null;
  document_id: UUID | null;
  category: ExpenseCategory;
  status: PaymentStatus;
  description: string | null;
  vendor: string | null;
  amount: number;
  currency: string;
  quantity: number | null;
  unit_price: number | null;
  incurred_on: DateString;
  paid_on: DateString | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Revenue {
  id: UUID;
  company_id: UUID;
  created_by: UUID | null;
  load_id: UUID | null;
  document_id: UUID | null;
  status: PaymentStatus;
  description: string | null;
  payer: string | null;
  invoice_number: string | null;
  amount: number;
  currency: string;
  earned_on: DateString;
  invoiced_on: DateString | null;
  paid_on: DateString | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Setting {
  id: UUID;
  company_id: UUID;
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_by: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// --- Table registry ---------------------------------------------------------

/** Map of table name → row type. Useful for generic data-access helpers. */
export interface Tables {
  companies: Company;
  users: User;
  profiles: Profile;
  trucks: Truck;
  trailers: Trailer;
  load_requests: LoadRequest;
  loads: Load;
  load_status_history: LoadStatusHistory;
  document_categories: DocumentCategory;
  documents: Document;
  messages: Message;
  notifications: Notification;
  expenses: Expense;
  revenue: Revenue;
  settings: Setting;
}

export type TableName = keyof Tables;

/** Storage bucket identifiers. */
export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  PROFILE_IMAGES: 'profile-images',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
