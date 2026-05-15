import { Role } from '@repo/shared';

const CLIENT_PORTAL_URL = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL ?? '/portal';
const LAWYER_PORTAL_URL = process.env.NEXT_PUBLIC_LAWYER_PORTAL_URL ?? '/lawyer-portal';

const LAWYER_SIDE_ROLES: ReadonlySet<Role> = new Set([
  Role.LAWYER,
  Role.FIRM_ADMIN,
  Role.FIRM_MANAGER,
]);

export function usesLawyerPortal(role: Role): boolean {
  return LAWYER_SIDE_ROLES.has(role);
}

export function getPortalUrl(role: Role): string {
  return usesLawyerPortal(role) ? LAWYER_PORTAL_URL : CLIENT_PORTAL_URL;
}
