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

/**
 * Dark surface palette for the driver app. The app runs on a premium dark
 * navy theme with blue accents (mirrors the admin app area). Kept alongside the
 * brand tokens above so screens can compose either as needed.
 */
export const dark = {
  bg: '#0b1120', // app background (near-black navy)
  surface: '#0f172a', // card / navy-900
  surfaceRaised: '#1e293b', // raised card / navy-800
  border: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',
  overlay: 'rgba(255,255,255,0.05)',
  text: '#ffffff',
  textMuted: '#94a3b8', // slate-400
  textSubtle: '#64748b', // slate-500
  brand: '#2563eb',
  brandBright: '#3b82f6',
  brandSoft: 'rgba(37,99,235,0.18)',
  brandText: '#bfdbfe',
  success: '#22c55e',
  successSoft: 'rgba(34,197,94,0.16)',
  warning: '#f59e0b',
  danger: '#ef4444',
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
