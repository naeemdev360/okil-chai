import { Role } from '@repo/shared';

const CLIENT_PORTAL_URL = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL ?? '/portal';
const LAWYER_PORTAL_URL = process.env.NEXT_PUBLIC_LAWYER_PORTAL_URL ?? '/lawyer-portal';

const LAWYER_SIDE_ROLES: ReadonlySet<Role> = new Set([
  Role.LAWYER,
  Role.FIRM_ADMIN,
  Role.FIRM_MANAGER,
]);

const ROLE_PRIORITY: readonly Role[] = [
  Role.PLATFORM_ADMIN, Role.LAWYER, Role.FIRM_ADMIN,
  Role.FIRM_MANAGER, Role.SUPPORT_AGENT, Role.CLIENT,
];

/** Derive the single most-privileged role from an array (backend returns an array). */
export function getPrimaryRole(roles: readonly Role[]): Role {
  for (const r of ROLE_PRIORITY) {
    if (roles.includes(r)) return r;
  }
  return Role.CLIENT;
}

export function usesLawyerPortal(role: Role): boolean {
  return LAWYER_SIDE_ROLES.has(role);
}

export function getPortalUrl(role: Role): string {
  return usesLawyerPortal(role) ? LAWYER_PORTAL_URL : CLIENT_PORTAL_URL;
}
