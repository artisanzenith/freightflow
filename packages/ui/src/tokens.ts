/**
 * FreightFlow design tokens
 *
 * The single source of truth for the visual language: color, typography,
 * spacing, radii, and shadows. These tokens are consumed by the Tailwind
 * preset (`tailwind-preset.ts`) so web apps stay in sync, and can also be
 * referenced directly by the React Native app.
 *
 * Palette intent: a confident, premium logistics brand — deep navy as the
 * anchor, an energetic "signal" blue as the primary action color, and a warm
 * amber accent for highlights. Neutrals lean slightly cool.
 */

export const colors = {
  // Brand primary — "signal" blue used for primary actions and links.
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  // Deep navy — headings, dark surfaces, footer.
  navy: {
    50: '#f4f6fb',
    100: '#e7ebf5',
    200: '#c8d3e8',
    300: '#96abd3',
    400: '#5d7cb8',
    500: '#3a5a9e',
    600: '#2c4682',
    700: '#25396a',
    800: '#213159',
    900: '#0f172a',
    950: '#0a0f1f',
  },
  // Warm amber accent — badges, highlights, subtle emphasis.
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Cool neutrals for text, borders, and surfaces.
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // Semantic status colors.
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#0ea5e9',
} as const;

export const typography = {
  fontFamily: {
    sans: [
      'Inter',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
    mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
  },
  // Fluid, readable type scale (rem).
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

/** 4px base spacing scale (rem values). */
export const spacing = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

export const radii = {
  none: '0px',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

export const shadows = {
  xs: '0 1px 2px 0 rgb(15 23 42 / 0.05)',
  sm: '0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.1)',
  md: '0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)',
  lg: '0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)',
  xl: '0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(15 23 42 / 0.25)',
  // Soft brand-tinted glow for elevated CTAs and cards.
  glow: '0 20px 40px -12px rgb(37 99 235 / 0.35)',
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} as const;

export type Tokens = typeof tokens;
