import { getCurrentUser } from '@/lib/auth/session';

/**
 * Authenticated landing placeholder. Confirms the session is live; the real
 * dashboard is intentionally out of scope for the authentication phase.
 */
export default async function AppHomePage() {
  const user = await getCurrentUser();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'there';

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold text-navy-900">Welcome, {displayName}</h1>
      <p className="max-w-prose text-neutral-600">
        You’re signed in. Your dispatch dashboard is coming soon — this authenticated area is
        ready for it.
      </p>
    </div>
  );
}
