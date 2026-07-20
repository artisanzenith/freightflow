import Link from 'next/link';
import { Card, CardContent } from '@freightflow/ui';
import { navItemsForRole, roleLabel } from '@freightflow/shared';

import { getAppUser } from '@/lib/auth/user';
import { NavIcon } from '@/components/app/NavIcon';

/**
 * Dashboard landing. Presents a role-aware welcome and quick links into each
 * accessible section. Metrics and live data are intentionally out of scope —
 * this is navigation/layout scaffolding only.
 */
export default async function DashboardPage() {
  const user = await getAppUser();
  const role = user?.role ?? 'owner';
  const displayName = user?.fullName?.trim() || user?.email || 'there';

  // Quick links = accessible sections other than the dashboard itself.
  const quickLinks = navItemsForRole(role).filter((item) => item.key !== 'dashboard');

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">
          Welcome back, {displayName}
        </h1>
        <p className="text-neutral-600">
          You’re signed in as <span className="font-medium">{roleLabel(role)}</span>. Jump into any
          area below to get started.
        </p>
      </header>

      <section aria-label="Quick links">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.key}
              href={item.segment ? `/app/${item.segment}` : '/app'}
              className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardContent className="flex items-center gap-4 py-5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
                    aria-hidden
                  >
                    <NavIcon icon={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900 group-hover:text-brand-700">
                      {item.label}
                    </p>
                    <p className="text-sm text-neutral-500">Open {item.label.toLowerCase()}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
