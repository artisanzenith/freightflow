import { cn } from '../utils/cn';

export interface LogoProps {
  /** Use the light wordmark for dark backgrounds. */
  variant?: 'dark' | 'light';
  className?: string;
  /** Hide the wordmark and render only the mark. */
  markOnly?: boolean;
}

/**
 * FreightFlow brand lockup: an abstract "flow" mark plus wordmark. Pure SVG +
 * text so it scales crisply and needs no image assets.
 */
export function Logo({ variant = 'dark', className, markOnly = false }: LogoProps) {
  const wordColor = variant === 'light' ? 'text-white' : 'text-navy-900';

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        role="img"
        aria-label="FreightFlow"
        className="shrink-0"
      >
        <rect width="28" height="28" rx="8" fill="#2563eb" />
        <path
          d="M7 18.5c3-6 5-9 9.5-9M8.5 14h7M10 9.5h6.5"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!markOnly && (
        <span className={cn('text-lg font-bold tracking-tight', wordColor)}>
          Freight<span className="text-brand-600">Flow</span>
        </span>
      )}
    </span>
  );
}
