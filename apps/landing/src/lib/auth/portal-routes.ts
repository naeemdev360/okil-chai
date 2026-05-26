import { getPortalKind, PortalKind, Role } from '@repo/shared';

const PORTAL_URL: Record<PortalKind, string> = {
  [PortalKind.CLIENT]: process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL ?? '/portal',
  [PortalKind.LAWYER]: process.env.NEXT_PUBLIC_LAWYER_PORTAL_URL ?? '/lawyer-portal',
  [PortalKind.ADMIN]:  process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL ?? '/admin-portal',
};

const ROLE_PRIORITY: readonly Role[] = [
  Role.PLATFORM_ADMIN, Role.LAWYER, Role.FIRM_ADMIN,
  Role.FIRM_MANAGER, Role.SUPPORT_AGENT, Role.CLIENT,
];

/** Derive the single most-privileged role from an array — used for display (e.g. role label). */
export function getPrimaryRole(roles: readonly Role[]): Role {
  for (const r of ROLE_PRIORITY) {
    if (roles.includes(r)) return r;
  }
  return Role.CLIENT;
}

export function usesLawyerPortal(role: Role): boolean {
  return getPortalKind([role]) === PortalKind.LAWYER;
}

export function getPortalUrl(role: Role): string {
  return PORTAL_URL[getPortalKind([role])];
}

/** Portal landing URL for a user's full role set — used for post-login redirects. */
export function getPortalUrlForRoles(roles: readonly Role[]): string {
  return PORTAL_URL[getPortalKind(roles)];
}

/** Pick where to send a user after login: a validated returnUrl if present, else their role's portal. */
export function resolvePostLoginRedirect(returnUrl: string | undefined, roles: readonly Role[]): string {
  if (returnUrl && isAllowedRedirect(returnUrl)) return returnUrl;
  return getPortalUrlForRoles(roles);
}

/** Guard against open redirects: only allow same-app relative paths or known portal origins. */
function isAllowedRedirect(target: string): boolean {
  if (target.startsWith('/')) return true;
  try {
    const origin = new URL(target).origin;
    return Object.values(PORTAL_URL).some((base) => {
      try {
        return new URL(base).origin === origin;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}
