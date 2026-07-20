import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';

/**
 * Returns the authenticated user, or `null` if there is no valid session.
 * Uses `getUser()` (not `getSession()`) so the token is verified against
 * Supabase rather than trusted from the cookie.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Guard for server components/layouts in the protected area. Redirects to
 * /login (preserving the intended destination) when unauthenticated. The
 * middleware already enforces this at the edge; this is defense in depth for
 * server-rendered content.
 */
export async function requireUser(redirectTo?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const target = redirectTo
      ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : '/login';
    redirect(target);
  }
  return user;
}
