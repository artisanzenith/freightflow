import { createBrowserClient } from '@supabase/ssr';

import { supabaseAnonKey, supabaseUrl } from '@/lib/env';

/**
 * Supabase client for use in Client Components (browser). Reads/writes the
 * session from cookies managed by the SSR helpers. Safe to call on every render;
 * `createBrowserClient` memoizes a singleton internally.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
