import { type ReactNode } from 'react';

import { cn } from '../utils/cn';
import { Badge } from './Badge';

export interface SectionHeadingProps {
  /** Small eyebrow label rendered as a badge above the title. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/** Consistent marketing section header: eyebrow, title, and supporting copy. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'mx-auto max-w-2xl items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && <Badge variant="brand">{eyebrow}</Badge>}
      <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h2>
      {description && <p className="text-lg text-neutral-600">{description}</p>}
    </div>
  );
}
