'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Container, Logo } from '@freightflow/ui';

import { site } from '@/config/site';

/** Sticky marketing header with a responsive mobile menu. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label={`${site.name} home`}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {site.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-navy-900"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Start free trial</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-navy-900 hover:bg-neutral-100 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-neutral-200 bg-white md:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-4" aria-label="Mobile">
              {site.nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button fullWidth>Start free trial</Button>
                </Link>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
