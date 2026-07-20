/**
 * @freightflow/validation
 *
 * Zod schemas shared across the FreightFlow mobile app, admin
 * portal, and Supabase Edge Functions. Validation lives here so
 * client and server enforce identical contracts.
 */

export const PACKAGE_NAME = '@freightflow/validation';

// Authentication (sign in, sign up, password reset).
export * from './auth';
