import { DarkSidebarNav, PortalTopbar } from '@repo/ui';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CURRENT_USER } from '../../lib/mock-data';
import { CLIENT_PORTAL_LOGO, CLIENT_PORTAL_NAV_SECTIONS } from './client-portal.constants';

const PORTAL_USER = {
  name: CURRENT_USER.name,
  subtitle: 'Client',
  initials: CURRENT_USER.initials,
} as const;

const COLLAPSE_KEY = 'client_sidebar_collapsed';

function readCollapsed(): boolean {
  try { return localStorage.getItem(COLLAPSE_KEY) === 'true'; }
  catch { return false; }
}

export function ClientPortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readCollapsed);

  const activeKey = location.pathname;

  function handleNav(key: string) {
    navigate(key);
    setMobileNavOpen(false);
  }

  function handleToggleCollapse() {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem(COLLAPSE_KEY, String(next)); } catch {}
      return next;
    });
  }

  return (
    <div className="h-screen bg-cream flex flex-col overflow-hidden">
      <PortalTopbar
        logo={CLIENT_PORTAL_LOGO}
        searchPlaceholder="Search lawyers, appointments, documents…"
        user={PORTAL_USER}
        onNotificationsClick={() => handleNav('/notifications')}
        onMenuClick={() => setMobileNavOpen(true)}
        onHelpClick={() => {}}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <DarkSidebarNav
          sections={CLIENT_PORTAL_NAV_SECTIONS}
          activeItem={activeKey}
          onItemChange={handleNav}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          isMobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          onLogout={() => navigate('/')}
        />

        <main className="flex-1 min-w-0 overflow-y-auto px-7 py-6 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
