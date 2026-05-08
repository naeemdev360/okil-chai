import * as React from 'react';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/avatar';

export interface SidebarNavItem {
  readonly key: string;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly count?: number;
}

export interface SidebarNavUser {
  readonly name: string;
  readonly subtitle?: string;
  readonly initials: string;
}

export interface SidebarNavProps {
  readonly items: readonly SidebarNavItem[];
  readonly activeItem: string;
  readonly onItemChange: (key: string) => void;
  readonly user: SidebarNavUser;
  readonly logo?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly onLogout?: () => void;
  readonly className?: string;
}

export function SidebarNav({
  items,
  activeItem,
  onItemChange,
  user,
  logo,
  footer,
  onLogout,
  className,
}: SidebarNavProps) {
  return (
    <aside
      className={cn(
        'flex flex-col w-[260px] bg-white border-r border-gray-100 shrink-0 overflow-y-auto',
        className,
      )}
    >
      {logo && (
        <div className="px-5 py-5 border-b border-gray-100 shrink-0">{logo}</div>
      )}

      {/* User card */}
      <div className="px-5 py-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar initials={user.initials} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy font-sans truncate">{user.name}</p>
            {user.subtitle && (
              <p className="text-xs text-gray-400 font-sans truncate">{user.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-2">
        {items.map((item) => {
          const isActive = item.key === activeItem;
          return (
            <button
              key={item.key}
              onClick={() => onItemChange(item.key)}
              className={cn(
                'flex items-center gap-3 w-full px-4 py-2.5 text-sm font-sans transition-all duration-150 text-left border-r-2',
                isActive
                  ? 'text-navy bg-gold-pale border-r-gold font-semibold'
                  : 'text-gray-800 font-normal hover:text-navy hover:bg-gray-50 border-r-transparent',
              )}
            >
              <span
                className={cn(
                  'shrink-0 flex items-center justify-center',
                  isActive ? 'text-gold' : 'text-gray-500',
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.count != null && item.count > 0 && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold font-sans rounded-full shrink-0',
                    isActive ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600',
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer slot (e.g. premium upsell) */}
      {footer && (
        <div className="px-3 py-3 border-t border-gray-100 shrink-0">{footer}</div>
      )}

      {/* Logout */}
      {onLogout && (
        <div className="px-3 py-3 border-t border-gray-100 shrink-0">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-gray-500 hover:text-navy rounded-md hover:bg-gray-50 transition-colors font-sans"
          >
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}

function LogoutIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
