import { redirect } from 'next/navigation';
import type { UserRole } from '@freightflow/shared';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from './session';

/**
 * The authenticated app user as the UI needs it: identity from Supabase Auth
 * plus the application role/name from `public.users`. Role drives which
 * navigation and sections are shown (authorization is still enforced by RLS).
 */
export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
}

const DEFAULT_ROLE: UserRole = 'owner';

/**
 * Loads the current app user (auth identity + role). Returns `null` when there
 * is no session. If the `public.users` row can't be read yet (e.g. brand-new
 * account before the row is provisioned), falls back to a sensible default role
 * derived from auth metadata so the shell still renders.
 */
export async function getAppUser(): Promise<AppUser | null> {
  const authUser = await getCurrentUser();
  if (!authUser) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', authUser.id)
    .maybeSingle();

  const metadataRole = authUser.user_metadata?.role as UserRole | undefined;
  const metadataName = authUser.user_metadata?.full_name as string | undefined;

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    role: (data?.role as UserRole | undefined) ?? metadataRole ?? DEFAULT_ROLE,
    fullName: data?.full_name ?? metadataName ?? null,
  };
}

/**
 * Guard for the protected app area: returns the app user or redirects to
 * /login. Defense in depth on top of the middleware.
 */
export async function requireAppUser(redirectTo?: string): Promise<AppUser> {
  const user = await getAppUser();
  if (!user) {
    redirect(redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : '/login');
  }
  return user;
}
