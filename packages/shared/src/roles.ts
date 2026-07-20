/**
 * Role model shared across the admin portal and mobile app.
 *
 * The database enum (`public.user_role`) is the source of truth for allowed
 * values; this module adds presentation labels and permission helpers on top so
 * both clients gate UI consistently. Authorization is ultimately enforced by
 * Postgres RLS — these helpers only shape what the UI offers.
 */
import type { UserRole } from './database.types';

/** Human-friendly labels for each role. */
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  owner: 'Owner Operator',
  dispatcher: 'Dispatcher',
  accountant: 'Accountant',
  driver: 'Driver',
};

/** Short description of what each role is for. */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Full access to every area of the workspace.',
  owner: 'Runs the business: dispatch, fleet, documents, and finances.',
  dispatcher: 'Manages load requests, active loads, and driver assignments.',
  accountant: 'Handles expenses, revenue, and financial reporting.',
  driver: 'Drives loads and uploads documents from the road.',
};

/** Management roles that can see and act across the workspace. */
export const MANAGER_ROLES: readonly UserRole[] = ['owner', 'dispatcher', 'admin'];

/** Roles with access to financial data. */
export const FINANCE_ROLES: readonly UserRole[] = ['owner', 'accountant', 'admin'];

/** Every role, in display order. */
export const ALL_ROLES: readonly UserRole[] = [
  'admin',
  'owner',
  'dispatcher',
  'accountant',
  'driver',
];

export function isManagerRole(role: UserRole): boolean {
  return MANAGER_ROLES.includes(role);
}

export function isFinanceRole(role: UserRole): boolean {
  return FINANCE_ROLES.includes(role);
}

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}
