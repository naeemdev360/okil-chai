import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '../../utils/cn';

export interface PortalMobileNavDrawerProps {
  readonly mobileNavOpen: boolean;
  readonly onCloseNav: () => void;
  readonly children: React.ReactNode;
  readonly navId?: string;
  readonly navLabel?: string;
  readonly className?: string;
}

export function PortalMobileNavDrawer({
  mobileNavOpen,
  onCloseNav,
  children,
  navId = 'portal-mobile-nav',
  navLabel = 'Main navigation',
  className,
}: PortalMobileNavDrawerProps) {
  return (
    <AnimatePresence>
      {mobileNavOpen ? (
        <motion.div
          key="portal-mobile-nav-backdrop"
          role="presentation"
          className="fixed inset-0 z-50 bg-navy/40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden
          onClick={onCloseNav}
        />
      ) : null}
      {mobileNavOpen ? (
        <motion.div
          key="portal-mobile-nav-panel"
          id={navId}
          role="dialog"
          aria-modal="true"
          aria-label={navLabel}
          className={cn(
            'fixed left-0 top-0 z-[51] flex h-full w-[min(280px,92vw)] max-w-full flex-col border-r border-gray-100 bg-white shadow-xl lg:hidden',
            className,
          )}
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.85 }}
        >
          <div className="flex items-center justify-end border-b border-gray-100 px-2 py-2">
            <button
              type="button"
              onClick={onCloseNav}
              className="inline-flex size-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
