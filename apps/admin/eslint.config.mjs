import base from '@freightflow/config/eslint';

/**
 * Admin portal ESLint config. Extends the shared base and layers
 * Next.js-specific rules via FlatCompat.
 */
export default [
  ...base,
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
];
