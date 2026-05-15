import { PortalAuthGate, ScalesLogoIcon } from '@repo/ui';
import type { ReactNode } from 'react';
import { authRoutes, hasAccessToken } from '../../lib/auth';
import { brand } from '../../lib/brand';

interface RequireAuthProps {
  readonly children: ReactNode;
}

const ADMIN_PORTAL_LOGO = (
  <div className="flex items-center gap-3">
    <div className="flex size-8 shrink-0 items-center justify-center rounded bg-gold">
      <ScalesLogoIcon size={18} stroke="#0F1F3D" gold="#0F1F3D" />
    </div>
    <div>
      <div className="mb-0.5 font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-gold">
        Admin Portal
      </div>
      <div className="font-heading text-[17px] font-semibold leading-tight text-white">
        {brand.name}
      </div>
    </div>
  </div>
);

export function RequireAuth({ children }: RequireAuthProps) {
  if (hasAccessToken()) return <>{children}</>;

  return (
    <PortalAuthGate
      portal="admin"
      logo={ADMIN_PORTAL_LOGO}
      signInHref={authRoutes.signIn}
      homeHref={authRoutes.home}
    />
  );
}
