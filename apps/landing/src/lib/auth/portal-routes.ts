import { Role } from '@okil-chai/shared';

const CLIENT_PORTAL_URL = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL ?? '/portal';
const LAWYER_PORTAL_URL = process.env.NEXT_PUBLIC_LAWYER_PORTAL_URL ?? '/lawyer-portal';

export function getPortalUrl(role: Role): string {
  return role === Role.LAWYER ? LAWYER_PORTAL_URL : CLIENT_PORTAL_URL;
}
