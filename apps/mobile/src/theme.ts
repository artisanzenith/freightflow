/**
 * Mobile theme constants.
 *
 * The design-system source of truth lives in `@freightflow/ui` tokens; these
 * values mirror the brand palette for React Native's StyleSheet, which cannot
 * consume Tailwind classes directly.
 */
export const colors = {
  brand: '#2563eb',
  brandDark: '#1d4ed8',
  brandLight: '#eff6ff',
  navy: '#0f172a',
  neutral900: '#111827',
  neutral600: '#4b5563',
  neutral500: '#6b7280',
  neutral400: '#9ca3af',
  neutral200: '#e5e7eb',
  neutral100: '#f3f4f6',
  neutral50: '#f9fafb',
  white: '#ffffff',
  success: '#16a34a',
  danger: '#dc2626',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;
