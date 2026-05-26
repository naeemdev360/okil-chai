import { PortalKind } from '../enums/portal-kind.enum.js';
import { Role } from '../enums/role.enum.js';

const ADMIN_ROLES: readonly Role[] = [Role.PLATFORM_ADMIN, Role.SUPPORT_AGENT];
const LAWYER_ROLES: readonly Role[] = [Role.LAWYER, Role.FIRM_ADMIN, Role.FIRM_MANAGER];

/** Single source of truth for which portal a set of roles belongs to. Admin > Lawyer > Client. */
export function getPortalKind(roles: readonly Role[]): PortalKind {
  if (roles.some((role) => ADMIN_ROLES.includes(role))) return PortalKind.ADMIN;
  if (roles.some((role) => LAWYER_ROLES.includes(role))) return PortalKind.LAWYER;
  return PortalKind.CLIENT;
}
