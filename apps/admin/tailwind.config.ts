import type { Config } from 'tailwindcss';
import preset from '@freightflow/ui/tailwind-preset';

const config: Config = {
  // Draw the theme from the shared design-system preset so every FreightFlow
  // web surface stays visually consistent.
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    // Include the shared UI package so its class names are not purged.
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
