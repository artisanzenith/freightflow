import { requireAppUser } from '@/lib/auth/user';
import { AppShell } from '@/components/app/AppShell';

/**
 * Layout for the authenticated application area. Guards every child route
 * (redirects unauthenticated users to /login — defense in depth on top of the
 * middleware) and wraps content in the role-aware application shell.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAppUser('/app');

  return (
    <AppShell role={user.role} fullName={user.fullName} email={user.email}>
      {children}
    </AppShell>
  );
}
