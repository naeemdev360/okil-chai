import { usePortalAuth } from '@repo/hooks';
import type { DarkNavSection } from '@repo/ui';
import { ConfirmDialog, DarkSidebarNav, PortalTopbar } from '@repo/ui';
import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { landingHome } from '../../lib/auth';
import { useNavCounts } from '../../lib/useNavCounts';
import { CLIENT_PORTAL_LOGO, CLIENT_PORTAL_NAV_SECTIONS } from './client-portal.constants';

const COLLAPSE_KEY = 'client_sidebar_collapsed';

const COUNT_KEYS: Record<string, keyof ReturnType<typeof useNavCounts>> = {
  '/appointments': 'appointments',
  '/saved': 'saved',
  '/messages': 'messages',
};

function readCollapsed(): boolean {
  try { return localStorage.getItem(COLLAPSE_KEY) === 'true'; }
  catch { return false; }
}

export function ClientPortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = usePortalAuth();
  const navCounts = useNavCounts();

  const navSections = useMemo<readonly DarkNavSection[]>(() =>
    CLIENT_PORTAL_NAV_SECTIONS.map(section => ({
      ...section,
      items: section.items.map(item => {
        const countKey = COUNT_KEYS[item.key];
        const count = countKey !== undefined ? navCounts[countKey] : undefined;
        return count !== undefined && count > 0 ? { ...item, count } : item;
      }),
    })),
    [navCounts],
  );

  const portalUser = {
    name: user ? `${user.firstName} ${user.lastName}` : '',
    subtitle: 'Client',
    initials: user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '',
  };
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readCollapsed);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

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
        user={portalUser}
        onNotificationsClick={() => handleNav('/notifications')}
        onMenuClick={() => setMobileNavOpen(true)}
        onHelpClick={() => {}}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <DarkSidebarNav
          sections={navSections}
          activeItem={activeKey}
          onItemChange={handleNav}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          isMobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          onLogout={() => setSignOutOpen(true)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto px-7 py-6 pb-10">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        variant="warning"
        title="Sign out?"
        description="You'll be redirected to the Home page."
        confirmLabel="Sign out"
        cancelLabel="Stay"
        isLoading={signingOut}
        onConfirm={async () => {
          setSigningOut(true);
          await logout();
          window.location.href = landingHome;
        }}
      />
    </div>
  );
}
