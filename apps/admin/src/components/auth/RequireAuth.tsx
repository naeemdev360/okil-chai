import { usePortalGuard } from '@repo/hooks';
import { PageLoader } from '@repo/ui';
import type { ReactNode } from 'react';
import { getPortalUrlForRoles, PORTAL_KIND, signInUrl } from '../../lib/auth';

interface RequireAuthProps {
  readonly children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const state = usePortalGuard({
    portalKind: PORTAL_KIND,
    signInUrl: signInUrl(),
    resolvePortalUrl: getPortalUrlForRoles,
  });

  if (state !== 'authorized') return <PageLoader />;
  return <>{children}</>;
}
