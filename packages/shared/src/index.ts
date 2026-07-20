/**
 * @freightflow/shared
 *
 * Single source of truth for the FreightFlow domain model:
 * types, enums, and constants shared across the mobile app,
 * admin portal, and Supabase Edge Functions.
 */

export const PACKAGE_NAME = '@freightflow/shared';

// Database row types, enums, and storage bucket constants that mirror the
// Supabase schema in `supabase/migrations`.
export * from './database.types';

// Role model: labels, permission helpers (paired with DB RLS).
export * from './roles';

// Application navigation model shared across surfaces.
export * from './navigation';
