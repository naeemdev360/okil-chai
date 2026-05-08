import {
  DecorativeOrb,
  PortalFooter,
  PortalMobileHeader,
  PortalMobileNavDrawer,
  SidebarNav,
} from '@okil-chai/ui';
import {
  Bell,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { brand } from '../../lib/brand';
import { CURRENT_USER } from '../../lib/mock-data';
import {
  CLIENT_PORTAL_LEGAL_LINKS,
  CLIENT_PORTAL_NAV_ITEMS,
  CLIENT_PORTAL_QUICK_LINKS,
} from './client-portal.constants';

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

  const activeKey = CLIENT_PORTAL_NAV_ITEMS.find(
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
      items={CLIENT_PORTAL_NAV_ITEMS}
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
      <PortalMobileHeader
        mobileNavOpen={mobileNavOpen}
        navId="client-portal-mobile-nav"
        title={brand.name}
        onOpenNav={() => setMobileNavOpen(true)}
        rightAction={(
          <Link
            to="/notifications"
            className="inline-flex size-10 items-center justify-center rounded-md text-navy hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Notifications"
          >
            <Bell size={20} strokeWidth={1.75} aria-hidden />
          </Link>
        )}
      />

      <div className="sticky top-0 z-30 hidden h-screen shrink-0 lg:fixed lg:block lg:w-[var(--client-sidebar-width)]">
        {sidebar}
      </div>

      {/*  mobile nav */}

      <PortalMobileNavDrawer
        mobileNavOpen={mobileNavOpen}
        onCloseNav={() => setMobileNavOpen(false)}
        navId="client-portal-mobile-nav"
      >
        {sidebar}
      </PortalMobileNavDrawer>

      <main className="min-h-0 min-w-0 flex flex-1 flex-col overflow-x-hidden">
        <div className="mx-auto w-full min-w-0 max-w-[1060px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:ml-[var(--client-sidebar-width)] lg:px-8">
          <Outlet />
        </div>
        <div className="mx-auto w-full min-w-0 max-w-[1060px] lg:ml-[var(--client-sidebar-width)]">
          <PortalFooter
            brandName={brand.name}
            tagline="Find verified legal help and manage your appointments in minutes."
            quickLinks={CLIENT_PORTAL_QUICK_LINKS}
            legalLinks={CLIENT_PORTAL_LEGAL_LINKS}
            disclaimer={`${brand.name} is not a law firm. Use of this platform does not create an attorney-client relationship.`}
          />
        </div>
      </main>
    </div>
  );
}
