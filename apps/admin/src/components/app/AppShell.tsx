'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo, Badge, cn } from '@freightflow/ui';
import { roleLabel, type UserRole } from '@freightflow/shared';

import { SidebarNav } from './SidebarNav';
import { LogoutButton } from '@/components/auth/LogoutButton';

export interface AppShellProps {
  role: UserRole;
  fullName: string | null;
  email: string;
  children: React.ReactNode;
}

/** Initials for the avatar bubble, derived from name or email. */
function initialsFrom(fullName: string | null, email: string): string {
  const source = fullName?.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  return letters.toUpperCase() || 'U';
}

/**
 * Authenticated application shell: fixed sidebar on desktop, slide-over drawer
 * on mobile, and a sticky top bar. Purely presentational scaffolding — no
 * business data is loaded here.
 */
export function AppShell({ role, fullName, email, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const initials = initialsFrom(fullName, email);
  const displayName = fullName?.trim() || email;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-neutral-200 px-6">
          <Link href="/app" aria-label="FreightFlow home">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <SidebarNav role={role} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-navy-900/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-6">
              <Link href="/app" aria-label="FreightFlow home">
                <Logo />
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
                aria-label="Close menu"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <SidebarNav role={role} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-md p-1 text-neutral-600 hover:bg-neutral-100 lg:hidden"
            aria-label="Open menu"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="lg:hidden">
            <Logo markOnly />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-semibold text-navy-900">{displayName}</span>
              <Badge variant="neutral">{roleLabel(role)}</Badge>
            </div>
            <span
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full',
                'bg-brand-100 text-sm font-semibold text-brand-700',
              )}
              aria-hidden
            >
              {initials}
            </span>
            <LogoutButton />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
