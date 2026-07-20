import base from '@freightflow/config/eslint';

export default [
  ...base,
  {
    // Metro/Babel configs are CommonJS by design; allow require() there.
    ignores: ['.expo/**', 'expo-env.d.ts', 'metro.config.js', 'babel.config.js'],
  },
];
