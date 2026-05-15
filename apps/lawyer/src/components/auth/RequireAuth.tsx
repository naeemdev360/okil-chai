import { PortalAuthGate } from '@repo/ui';
import type { ReactNode } from 'react';
import { authRoutes, hasAccessToken } from '../../lib/auth';
import { LAWYER_PORTAL_LOGO } from '../layout/lawyer-portal.constants';

interface RequireAuthProps {
  readonly children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  if (hasAccessToken()) return <>{children}</>;

  return (
    <PortalAuthGate
      portal="lawyer"
      logo={LAWYER_PORTAL_LOGO}
      signInHref={authRoutes.signIn}
      signUpHref={authRoutes.signUp}
      homeHref={authRoutes.home}
    />
  );
}
