import { PortalAuthGate } from '@repo/ui';
import type { ReactNode } from 'react';
import { authRoutes, hasAccessToken } from '../../lib/auth';
import { CLIENT_PORTAL_LOGO } from '../layout/client-portal.constants';

interface RequireAuthProps {
  readonly children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  if (hasAccessToken()) return <>{children}</>;

  return (
    <PortalAuthGate
      portal="client"
      logo={CLIENT_PORTAL_LOGO}
      signInHref={authRoutes.signIn}
      signUpHref={authRoutes.signUp}
      homeHref={authRoutes.home}
    />
  );
}
