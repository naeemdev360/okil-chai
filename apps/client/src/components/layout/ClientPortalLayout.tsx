import type { SidebarNavItem } from '@okil-chai/ui';
import { DecorativeOrb, SidebarNav } from '@okil-chai/ui';
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Heart,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CURRENT_USER } from '../../lib/mock-data';

const NAV_ITEMS: readonly SidebarNavItem[] = [
  { key: '/dashboard',     label: 'Dashboard',        icon: <LayoutDashboard size={18} /> },
  { key: '/appointments',  label: 'My Appointments',  icon: <Calendar       size={18} />, count: 3 },
  { key: '/saved',         label: 'Saved Lawyers',    icon: <Heart          size={18} />, count: 7 },
  { key: '/messages',      label: 'Messages',         icon: <MessageSquare  size={18} />, count: 2 },
  { key: '/documents',     label: 'Documents',        icon: <FileText       size={18} /> },
  { key: '/payments',      label: 'Payments',         icon: <CreditCard     size={18} /> },
  { key: '/notifications', label: 'Notifications',    icon: <Bell           size={18} /> },
  { key: '/settings',      label: 'Settings',         icon: <Settings       size={18} /> },
];

const PremiumUpsell = (
  <div className="bg-navy rounded-lg p-4 relative overflow-hidden">
    <DecorativeOrb appearance="gold-fill" size="sm" className="-top-8 -right-8" />
    <div className="relative">
      <p className="text-[10px] font-sans font-bold text-gold uppercase tracking-[0.08em] mb-2">Premium</p>
      <p className="font-heading text-sm font-semibold text-white mb-1.5">Document Vault</p>
      <p className="text-[11px] text-white/65 leading-relaxed mb-3">
        Encrypted storage + e-sign for $9.99/mo
      </p>
      <button className="w-full py-1.5 text-xs font-semibold font-sans bg-gold text-navy rounded-md hover:bg-gold-light transition-colors">
        Upgrade
      </button>
    </div>
  </div>
);

export function ClientPortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeKey = NAV_ITEMS.find(
    (item) => location.pathname === item.key || location.pathname.startsWith(item.key + '/'),
  )?.key ?? '/dashboard';

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  function onNavItemChange(key: string) {
    setMobileNavOpen(false);
    navigate(key);
  }

  const sidebar = (
    <SidebarNav
      items={NAV_ITEMS}
      activeItem={activeKey}
      onItemChange={onNavItemChange}
      user={{
        name: CURRENT_USER.name,
        subtitle: CURRENT_USER.email,
        initials: CURRENT_USER.initials,
      }}
      footer={PremiumUpsell}
      onLogout={() => navigate('/')}
      className="h-full min-h-0 lg:min-h-screen lg:!w-[var(--client-sidebar-width)]"
    />
  );

  return (
    <div className="client-portal-layout flex min-h-screen flex-col overflow-x-hidden bg-cream lg:flex-row">
      <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          aria-expanded={mobileNavOpen}
          aria-controls="client-portal-mobile-nav"
          onClick={() => setMobileNavOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-md text-navy hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <Menu size={22} strokeWidth={1.75} aria-hidden />
          <span className="sr-only">Open menu</span>
        </button>
        <span className="font-heading text-base font-semibold text-navy truncate">OkilChai</span>
        <Link
          to="/notifications"
          className="inline-flex size-10 items-center justify-center rounded-md text-navy hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.75} aria-hidden />
        </Link>
      </header>

      <div className="sticky top-0 z-30 hidden h-screen shrink-0 lg:fixed lg:block lg:w-[var(--client-sidebar-width)]">
        {sidebar}
      </div>

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.div
            key="client-portal-nav-backdrop"
            role="presentation"
            className="fixed inset-0 z-50 bg-navy/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            aria-hidden
            onClick={() => setMobileNavOpen(false)}
          />
        ) : null}
        {mobileNavOpen ? (
          <motion.div
            key="client-portal-nav-panel"
            id="client-portal-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="fixed left-0 top-0 z-[51] flex h-full w-[min(280px,92vw)] max-w-full flex-col border-r border-gray-100 bg-white shadow-xl lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.85 }}
          >
            <div className="flex items-center justify-end border-b border-gray-100 px-2 py-2">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.75} aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{sidebar}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto w-full min-w-0 max-w-[1060px] px-4 py-6 sm:px-6 sm:py-8 lg:ml-[var(--client-sidebar-width)] lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
