/**
 * Shared Tailwind preset for FreightFlow web apps.
 *
 * Apps import this preset in their `tailwind.config.ts` so every surface draws
 * from the same design tokens. Extend per-app in the app's own config.
 */
import type { Config } from 'tailwindcss';

import { colors, radii, shadows, typography } from './tokens';

const preset: Omit<Config, 'content'> = {
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        navy: colors.navy,
        accent: colors.accent,
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        info: colors.info,
      },
      fontFamily: {
        sans: typography.fontFamily.sans,
        mono: typography.fontFamily.mono,
      },
      borderRadius: {
        DEFAULT: radii.md,
        sm: radii.sm,
        md: radii.md,
        lg: radii.lg,
        xl: radii.xl,
        '2xl': radii['2xl'],
        '3xl': radii['3xl'],
      },
      boxShadow: {
        xs: shadows.xs,
        sm: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
        xl: shadows.xl,
        '2xl': shadows['2xl'],
        glow: shadows.glow,
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
      },
      backgroundImage: {
        'grid-navy':
          'linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default preset;
