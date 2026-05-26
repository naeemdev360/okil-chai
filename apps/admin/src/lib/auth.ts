import { getPortalKind, PortalKind, type Role } from '@repo/shared';

const LANDING_URL = (import.meta.env.VITE_LANDING_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/** The portal this app serves — used to redirect users whose roles belong elsewhere. */
export const PORTAL_KIND = PortalKind.ADMIN;

const PORTAL_URL: Record<PortalKind, string> = {
  [PortalKind.CLIENT]: (import.meta.env.VITE_CLIENT_PORTAL_URL ?? 'http://localhost:3001').replace(/\/$/, ''),
  [PortalKind.LAWYER]: (import.meta.env.VITE_LAWYER_PORTAL_URL ?? 'http://localhost:3002').replace(/\/$/, ''),
  [PortalKind.ADMIN]:  (import.meta.env.VITE_ADMIN_PORTAL_URL ?? 'http://localhost:3003').replace(/\/$/, ''),
};

export function getPortalUrlForRoles(roles: readonly Role[]): string {
  return PORTAL_URL[getPortalKind(roles)];
}

/** Landing sign-in URL that returns the user to where they are now after authenticating. */
export function signInUrl(): string {
  const returnUrl = typeof window !== 'undefined' ? window.location.href : '';
  return `${LANDING_URL}/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`;
}

export const landingHome = `${LANDING_URL}/`;
