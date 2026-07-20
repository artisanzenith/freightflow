import Link from 'next/link';
import { Container, Logo } from '@freightflow/ui';

import { site } from '@/config/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-neutral-500">{site.tagline}</p>
          </div>

          {site.footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold text-navy-900">{group.heading}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={`${group.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 py-6 sm:flex-row">
          <p className="text-sm text-neutral-500">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400">Built for US owner-operators & small fleets.</p>
        </div>
      </Container>
    </footer>
  );
}
