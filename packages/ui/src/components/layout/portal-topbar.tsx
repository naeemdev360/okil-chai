import * as React from 'react';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/avatar';

export interface PortalTopbarUser {
  readonly name: string;
  readonly subtitle?: string;
  readonly initials: string;
}

export interface PortalTopbarProps {
  readonly logo: React.ReactNode;
  readonly searchPlaceholder?: string;
  readonly user: PortalTopbarUser;
  readonly onNotificationsClick?: () => void;
  readonly notificationDot?: boolean;
  readonly onMenuClick?: () => void;
  readonly onHelpClick?: () => void;
  readonly actions?: React.ReactNode;
  readonly className?: string;
}

export function PortalTopbar({
  logo,
  searchPlaceholder = 'Search…',
  user,
  onNotificationsClick,
  notificationDot,
  onMenuClick,
  onHelpClick,
  actions,
  className,
}: PortalTopbarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center gap-4 px-5 py-3.5',
        'bg-navy-dark border-b border-white/[0.08]',
        'text-white shrink-0',
        className,
      )}
    >
      {/* Mobile hamburger */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded bg-white/[0.08] border border-white/10 text-white/70 hover:text-white transition-colors"
          aria-label="Open navigation"
        >
          <HamburgerIcon />
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-0 shrink-0">{logo}</div>

      {/* Search */}
      <div className="hidden md:block flex-1 max-w-[420px] ml-6 relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder={searchPlaceholder}
          className={cn(
            'w-full pl-9 pr-3 py-2 rounded-md',
            'bg-white/[0.08] border border-white/[0.12] text-white placeholder-white/50',
            'font-sans text-sm outline-none',
            'focus:border-white/30 transition-colors',
          )}
        />
      </div>

      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {onHelpClick && (
          <button
            onClick={onHelpClick}
            className="flex items-center justify-center w-[34px] h-[34px] rounded bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white transition-colors"
            aria-label="Help"
          >
            <HelpIcon />
          </button>
        )}

        {onNotificationsClick && (
          <button
            onClick={onNotificationsClick}
            className="relative flex items-center justify-center w-[34px] h-[34px] rounded bg-white/[0.06] border border-white/[0.08] text-white/70 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <BellIcon />
            {notificationDot && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-gold border-2 border-navy-dark" />
            )}
          </button>
        )}

        {actions}

        {/* User info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.12]">
          <Avatar initials={user.initials} size="md" />
          <div className="hidden sm:block leading-tight">
            <p className="font-sans text-[13px] font-semibold text-white">{user.name}</p>
            {user.subtitle && (
              <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-gold">
                {user.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function HamburgerIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
