'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@freightflow/ui';
import { NAV_GROUPS, navItemsForRole, type NavItem, type UserRole } from '@freightflow/shared';

import { NavIcon } from './NavIcon';

const APP_ROOT = '/app';

/** Build the full href for a nav item. */
function hrefFor(item: NavItem): string {
  return item.segment ? `${APP_ROOT}/${item.segment}` : APP_ROOT;
}

/** Whether the given item is the active route. */
function isActive(pathname: string, item: NavItem): boolean {
  const href = hrefFor(item);
  if (href === APP_ROOT) return pathname === APP_ROOT;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface SidebarNavProps {
  role: UserRole;
  /** Called when a link is tapped (used to close the mobile drawer). */
  onNavigate?: () => void;
}

/**
 * Role-filtered navigation, grouped by section. Rendered inside both the
 * desktop sidebar and the mobile drawer.
 */
export function SidebarNav({ role, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const items = navItemsForRole(role);

  return (
    <nav className="flex flex-col gap-6" aria-label="Primary">
      {NAV_GROUPS.map((group) => {
        const groupItems = items.filter((item) => item.group === group.key);
        if (groupItems.length === 0) return null;

        return (
          <div key={group.key} className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {group.label}
            </p>
            {groupItems.map((item) => {
              const active = isActive(pathname, item);
              return (
                <Link
                  key={item.key}
                  href={hrefFor(item)}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand-500/15 text-brand-200 ring-1 ring-inset ring-brand-400/30'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <NavIcon icon={item.icon} className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
