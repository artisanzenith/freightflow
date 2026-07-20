/**
 * Application navigation model — the single source of truth for the sections
 * that make up the authenticated app, shared by the admin portal and mobile
 * app so routes, labels, and role visibility never drift between surfaces.
 *
 * Each surface maps `NavItem`s onto its own routing + icon systems.
 */
import type { UserRole } from './database.types';
import { FINANCE_ROLES, MANAGER_ROLES } from './roles';

/** Stable identifier for each app section. */
export type NavKey =
  | 'dashboard'
  | 'load-requests'
  | 'active-loads'
  | 'documents'
  | 'messages'
  | 'notifications'
  | 'expenses'
  | 'revenue'
  | 'settings';

/** Icon key resolved per-surface (web SVG set / native icon set). */
export type NavIcon =
  | 'dashboard'
  | 'inbox'
  | 'truck'
  | 'documents'
  | 'messages'
  | 'bell'
  | 'expenses'
  | 'revenue'
  | 'settings';

export interface NavItem {
  key: NavKey;
  label: string;
  /** Route segment appended to the app root (e.g. `/app/documents`). */
  segment: string;
  icon: NavIcon;
  /**
   * Roles allowed to see this item. `undefined` means every authenticated role
   * (the item is always visible). Authorization is still enforced by RLS.
   */
  roles?: readonly UserRole[];
  /** Grouping for sidebar section headers. */
  group: 'overview' | 'operations' | 'finance' | 'account';
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    segment: '',
    icon: 'dashboard',
    group: 'overview',
  },
  {
    key: 'load-requests',
    label: 'Load Requests',
    segment: 'load-requests',
    icon: 'inbox',
    roles: MANAGER_ROLES,
    group: 'operations',
  },
  {
    key: 'active-loads',
    label: 'Active Loads',
    segment: 'active-loads',
    icon: 'truck',
    group: 'operations',
  },
  {
    key: 'documents',
    label: 'Documents',
    segment: 'documents',
    icon: 'documents',
    group: 'operations',
  },
  {
    key: 'messages',
    label: 'Messages',
    segment: 'messages',
    icon: 'messages',
    group: 'operations',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    segment: 'notifications',
    icon: 'bell',
    group: 'operations',
  },
  {
    key: 'expenses',
    label: 'Expenses',
    segment: 'expenses',
    icon: 'expenses',
    roles: FINANCE_ROLES,
    group: 'finance',
  },
  {
    key: 'revenue',
    label: 'Revenue',
    segment: 'revenue',
    icon: 'revenue',
    roles: FINANCE_ROLES,
    group: 'finance',
  },
  {
    key: 'settings',
    label: 'Settings',
    segment: 'settings',
    icon: 'settings',
    group: 'account',
  },
];

/** Sidebar group headers, in display order. */
export const NAV_GROUPS: { key: NavItem['group']; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'operations', label: 'Operations' },
  { key: 'finance', label: 'Finance' },
  { key: 'account', label: 'Account' },
];

/** Returns the nav items visible to the given role. */
export function navItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));
}

/** True when a role may access a given section. */
export function canAccessNav(role: UserRole, key: NavKey): boolean {
  const item = NAV_ITEMS.find((i) => i.key === key);
  if (!item) return false;
  return !item.roles || item.roles.includes(role);
}
