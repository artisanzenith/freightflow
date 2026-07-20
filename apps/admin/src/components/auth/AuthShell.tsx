import { type ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@freightflow/ui';

export interface AuthShellProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  /** Secondary link shown beneath the card (e.g. "Don't have an account?"). */
  footer?: ReactNode;
}

/**
 * Split-screen shell for authentication pages: a branded panel on the left and
 * the form card on the right. Presentation only — no auth logic.
 */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel (hidden on small screens) */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-navy-900 lg:block">
        <div className="pointer-events-none absolute inset-0 bg-grid-navy [background-size:40px_40px] opacity-40" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" aria-label="FreightFlow home">
            <Logo variant="light" />
          </Link>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white">
              Run your dispatch, not your paperwork.
            </h2>
            <p className="mt-4 text-navy-100">
              Loads, documents, drivers, and money — one clean workflow built for owner-operators
              and small fleets.
            </p>
          </div>
          <p className="text-sm text-navy-200">
            © {new Date().getFullYear()} FreightFlow. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" aria-label="FreightFlow home">
              <Logo />
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h1>
          <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-neutral-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
