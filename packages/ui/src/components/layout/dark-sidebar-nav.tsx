import * as React from 'react';
import { cn } from '../../utils/cn';

export interface DarkNavItem {
  readonly key: string;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly count?: number;
  readonly badge?: string;
  readonly live?: boolean;
}

export interface DarkNavSection {
  readonly label?: string;
  readonly items: readonly DarkNavItem[];
}

export interface DarkSidebarNavProps {
  readonly sections: readonly DarkNavSection[];
  readonly activeItem: string;
  readonly onItemChange: (key: string) => void;
  readonly isCollapsed?: boolean;
  readonly onToggleCollapse?: () => void;
  readonly footer?: React.ReactNode;
  readonly bottomSection?: React.ReactNode;
  readonly onLogout?: () => void;
  readonly isMobileOpen?: boolean;
  readonly onMobileClose?: () => void;
  readonly className?: string;
}

export function DarkSidebarNav({
  sections,
  activeItem,
  onItemChange,
  isCollapsed = false,
  onToggleCollapse,
  footer,
  bottomSection,
  onLogout,
  isMobileOpen,
  onMobileClose,
  className,
}: DarkSidebarNavProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'flex flex-col shrink-0 overflow-y-auto overflow-x-hidden',
          'bg-navy text-white',
          'px-2 py-4',
          'transition-[width] duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
          isCollapsed ? 'w-[72px]' : 'w-60',
          /* Mobile: drawer overlay */
          'fixed inset-y-0 left-0 z-30 lg:static lg:z-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className,
        )}
      >
        {/* Top row: section label (expanded) OR toggle icon centered (collapsed) */}
        <div className={cn('flex items-center mb-2 px-1', isCollapsed ? 'justify-center' : 'justify-between')}>
          {!isCollapsed && (
            <span className="font-sans text-[10px] font-semibold tracking-[0.1em] uppercase text-white/40 pl-2">
              {sections[0]?.label ?? 'Menu'}
            </span>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-7 h-7 flex items-center justify-center rounded text-white/40 hover:text-white/80 hover:bg-white/8 transition-all duration-150"
            >
              <SidebarToggleIcon collapsed={isCollapsed} />
            </button>
          )}
        </div>

        {/* Nav sections */}
        {sections.map((section, si) => (
          <div key={si} className={cn(si > 0 && 'mt-5')}>
            {/* Section label for subsequent sections (only when expanded) */}
            {si > 0 && section.label && !isCollapsed && (
              <div className="px-3 pb-2 pt-1 font-sans text-[10px] font-semibold tracking-[0.1em] uppercase text-white/40">
                {section.label}
              </div>
            )}
            {si > 0 && isCollapsed && (
              <div className="mx-3 mb-3 h-px bg-white/10" />
            )}

            <div className="flex flex-col gap-0.5">
              {section.items.map(item => {
                const isActive = item.key === activeItem;
                return (
                  <button
                    key={item.key}
                    onClick={() => onItemChange(item.key)}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'relative flex items-center w-full rounded-md text-left',
                      'font-sans text-sm transition-all duration-150',
                      'border-l-[3px]',
                      isCollapsed
                        ? 'justify-center px-0 py-2.5'
                        : 'gap-3 px-3 py-2.5',
                      isActive
                        ? 'bg-navy-mid text-white font-semibold border-l-gold'
                        : 'text-white/70 font-medium hover:text-white hover:bg-white/5 border-l-transparent',
                    )}
                  >
                    <span className={cn('shrink-0', isActive ? 'text-gold' : 'text-white/60')}>
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <>
                        <span className="flex-1 min-w-0 truncate">{item.label}</span>
                        {item.count != null && item.count > 0 && (
                          <span className="shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 font-sans text-[10px] font-bold rounded-full bg-gold text-navy">
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 font-sans text-[9px] font-bold tracking-wider rounded bg-gold text-navy">
                            {item.badge}
                          </span>
                        )}
                        {item.live && (
                          <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 font-sans text-[9px] font-bold tracking-wider uppercase rounded-full bg-red-500/16 text-[#FF8A8A]">
                            <span className="size-1.5 rounded-full bg-[#FF6B6B] animate-pulse" />
                            Live
                          </span>
                        )}
                      </>
                    )}

                    {/* Unread dot when collapsed */}
                    {isCollapsed && item.count != null && item.count > 0 && (
                      <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-gold" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {bottomSection && (
          <div className="mt-4 flex flex-col gap-0.5">{bottomSection}</div>
        )}

        <div className="mt-auto">
          {footer && !isCollapsed && <div className="pb-3">{footer}</div>}

          {onLogout && (
            <div className="border-t border-white/10 pt-3">
              <button
                onClick={onLogout}
                title={isCollapsed ? 'Sign out' : undefined}
                className={cn(
                  'flex items-center w-full rounded-md font-sans text-sm font-medium text-white/60',
                  'hover:text-white hover:bg-white/5 transition-all duration-150',
                  isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
                )}
              >
                <LogoutIcon />
                {!isCollapsed && 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      {collapsed
        ? <polyline points="13 9 17 12 13 15" />   /* arrow pointing right = expand */
        : <polyline points="14 9 11 12 14 15" />   /* arrow pointing left  = collapse */
      }
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
