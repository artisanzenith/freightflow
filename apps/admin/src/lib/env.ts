/**
 * Centralized access to environment variables.
 *
 * We deliberately do NOT throw at module load: Next.js evaluates these modules
 * during `next build` (prerendering client components), where public env vars
 * may be absent. Instead we fall back to obviously-local placeholders and warn.
 * In a correctly configured deployment the real values are always present.
 */

const PLACEHOLDER_URL = 'http://localhost:54321';
const PLACEHOLDER_ANON_KEY = 'public-anon-key-placeholder';

function readPublic(name: string, fallback: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  if (process.env.NODE_ENV === 'production') {
    // Surfaces misconfiguration in server logs without crashing the render.
    console.warn(
      `[env] ${name} is not set. Falling back to a placeholder; ` +
        'authentication will not work until it is configured.',
    );
  }
  return fallback;
}

/** Public Supabase config — safe to expose to the browser (RLS enforces access). */
export const supabaseUrl = readPublic('NEXT_PUBLIC_SUPABASE_URL', PLACEHOLDER_URL);

export const supabaseAnonKey = readPublic('NEXT_PUBLIC_SUPABASE_ANON_KEY', PLACEHOLDER_ANON_KEY);

/**
 * Absolute site URL, used to build auth redirect links (email confirmation,
 * password recovery). Falls back to localhost in development.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
