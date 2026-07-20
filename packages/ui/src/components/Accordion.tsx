import { type ReactNode } from 'react';

import { cn } from '../utils/cn';

export interface AccordionItem {
  question: ReactNode;
  answer: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

/**
 * Disclosure list built on native `<details>/<summary>` — fully keyboard
 * accessible and functional without JavaScript, ideal for an FAQ.
 */
export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn('divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white', className)}>
      {items.map((item, i) => (
        <details key={i} className="group px-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-left text-base font-medium text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            {item.question}
            <svg
              className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </summary>
          <div className="pb-5 pr-9 text-sm leading-relaxed text-neutral-600">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
