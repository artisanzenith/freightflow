import type { NavIcon as NavIconKey } from '@freightflow/shared';

export interface NavIconProps {
  icon: NavIconKey;
  className?: string;
}

/**
 * Inline SVG icon set for the app navigation. Uses `currentColor` so color is
 * controlled by the parent's text color. Kept as simple stroke paths so no
 * icon-font or image assets are needed.
 */
export function NavIcon({ icon, className = 'h-5 w-5' }: NavIconProps) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (icon) {
    case 'dashboard':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case 'inbox':
      return (
        <svg {...common}>
          <path d="M4 13h4l2 3h4l2-3h4" />
          <path d="M5 6h14l1 7v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5z" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...common}>
          <path d="M3 6h11v9H3z" />
          <path d="M14 9h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17" cy="18" r="1.6" />
        </svg>
      );
    case 'documents':
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      );
    case 'messages':
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-5 4z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      );
    case 'expenses':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M7 12h.01M17 12h.01" />
        </svg>
      );
    case 'revenue':
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15l3-4 3 3 4-6" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
      );
    default:
      return null;
  }
}
