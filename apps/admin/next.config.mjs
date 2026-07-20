/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile shared workspace packages so Next can consume their TS source.
  transpilePackages: [
    '@freightflow/shared',
    '@freightflow/validation',
    '@freightflow/api',
    '@freightflow/ui',
  ],
};

export default nextConfig;
