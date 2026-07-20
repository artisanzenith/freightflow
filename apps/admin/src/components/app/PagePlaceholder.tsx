import { Card, CardContent } from '@freightflow/ui';

import { NavIcon } from './NavIcon';
import type { NavIcon as NavIconKey } from '@freightflow/shared';

export interface PagePlaceholderProps {
  title: string;
  description: string;
  icon: NavIconKey;
  /** Optional bullet list of what this section will do once built. */
  upcoming?: string[];
}

/**
 * Consistent "coming soon" scaffold for a section page. Presents the section
 * title, purpose, and a preview of planned capabilities. No business logic or
 * data — this is route/layout scaffolding only.
 */
export function PagePlaceholder({ title, description, icon, upcoming }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
          aria-hidden
        >
          <NavIcon icon={icon} className="h-6 w-6" />
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h1>
          <p className="max-w-prose text-neutral-600">{description}</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 py-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Coming soon
            </span>
          </div>
          {upcoming && upcoming.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {upcoming.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-600">
              This area is ready for its features. Functionality will be added in a later phase.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
