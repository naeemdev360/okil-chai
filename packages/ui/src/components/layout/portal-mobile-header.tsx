import * as React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface PortalMobileHeaderProps {
  readonly mobileNavOpen: boolean;
  readonly onOpenNav: () => void;
  readonly navId?: string;
  readonly title: string;
  readonly rightAction?: React.ReactNode;
  readonly className?: string;
}

export function PortalMobileHeader({
  mobileNavOpen,
  onOpenNav,
  navId = 'portal-mobile-nav',
  title,
  rightAction,
  className,
}: PortalMobileHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 lg:hidden',
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={mobileNavOpen}
        aria-controls={navId}
        onClick={onOpenNav}
        className="inline-flex size-10 items-center justify-center rounded-md text-navy hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Menu size={22} strokeWidth={1.75} aria-hidden />
        <span className="sr-only">Open menu</span>
      </button>
      <span className="font-heading truncate text-base font-semibold text-navy">{title}</span>
      {rightAction ?? <span className="size-10" aria-hidden />}
    </header>
  );
}
