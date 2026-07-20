import { Logo } from '@freightflow/ui';

import { requireUser } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/LogoutButton';

/**
 * Layout for the authenticated application area. Guards every child route:
 * unauthenticated requests are redirected to /login (defense in depth on top of
 * the middleware). The full dashboard shell is built in a later phase.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser('/app');

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-neutral-600 sm:inline">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
