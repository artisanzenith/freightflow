import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

import { supabaseAnonKey, supabaseUrl } from '@/lib/env';

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

/**
 * Supabase client for Server Components, Route Handlers, and Server Actions.
 *
 * Cookie writes are attempted but wrapped in try/catch: Next.js disallows
 * setting cookies from Server Components (only Route Handlers / Server Actions /
 * middleware). In those read-only contexts the middleware is responsible for
 * refreshing the session, so swallowing the error is safe.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — middleware refreshes the session.
        }
      },
    },
  });
}
