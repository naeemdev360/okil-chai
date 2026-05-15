import { DarkSidebarNav, PortalTopbar } from '@repo/ui';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LAWYER_NAV_SECTIONS,
  LAWYER_PORTAL_LOGO
} from './lawyer-portal.constants';

const PORTAL_USER = { name: 'James Mercer', subtitle: 'Pro · Verified', initials: 'JM' } as const;
const COLLAPSE_KEY = 'lawyer_sidebar_collapsed';

function readCollapsed(): boolean {
  try { return localStorage.getItem(COLLAPSE_KEY) === 'true'; }
  catch { return false; }
}

export function LawyerPortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readCollapsed);

  const activeKey = location.pathname.replace('/', '') || 'dashboard';

  const handleNav = (key: string) => {
    navigate(`/${key}`);
    setMobileNavOpen(false);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem(COLLAPSE_KEY, String(next)); } catch {}
      return next;
    });
  };

  return (
    <div className="h-screen bg-cream flex flex-col overflow-hidden">
      <PortalTopbar
        logo={LAWYER_PORTAL_LOGO}
        searchPlaceholder="Search clients, cases, documents…"
        user={PORTAL_USER}
        onNotificationsClick={() => handleNav('notifications')}
        notificationDot
        onMenuClick={() => setMobileNavOpen(true)}
        onHelpClick={() => {}}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <DarkSidebarNav
          sections={LAWYER_NAV_SECTIONS}
          activeItem={activeKey}
          onItemChange={handleNav}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          isMobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          onLogout={() => {}}
          // footer={sidebarCollapsed ? undefined : LAWYER_SIDEBAR_PRO_TIP}
        />

        <main className="flex-1 min-w-0 overflow-y-auto px-7 py-6 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
