import { registerAs } from '@nestjs/config';

const MS_PER_SECOND = 1_000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const SEVEN_DAYS_MS = 7 * MS_PER_DAY;

const DURATION_UNIT_MS: Record<'s' | 'm' | 'h' | 'd', number> = {
  s: MS_PER_SECOND,
  m: MS_PER_MINUTE,
  h: MS_PER_HOUR,
  d: MS_PER_DAY,
};

/** Convert a duration string like `7d`, `15m`, `24h` (or a plain ms number) into milliseconds. */
function parseDurationMs(value: string): number {
  const match = /^(\d+)\s*([smhd])$/.exec(value.trim());
  if (!match) return Number(value) || SEVEN_DAYS_MS;
  const amount = Number(match[1]);
  const unit = match[2] as 's' | 'm' | 'h' | 'd';
  return amount * DURATION_UNIT_MS[unit];
}

export default registerAs('auth', () => ({
  jwtSecret: process.env['JWT_SECRET'],
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '15m',
  refreshSecret: process.env['JWT_REFRESH_SECRET'],
  refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  googleClientId: process.env['GOOGLE_CLIENT_ID'],
  googleClientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  googleCallbackUrl: process.env['GOOGLE_CALLBACK_URL'],
  facebookAppId: process.env['FACEBOOK_APP_ID'],
  facebookAppSecret: process.env['FACEBOOK_APP_SECRET'],
  facebookCallbackUrl: process.env['FACEBOOK_CALLBACK_URL'],
  clientPortalUrl: process.env['CLIENT_PORTAL_URL'] ?? 'http://localhost:3001',
  lawyerPortalUrl: process.env['LAWYER_PORTAL_URL'] ?? 'http://localhost:3002',
  adminPortalUrl: process.env['ADMIN_PORTAL_URL'] ?? 'http://localhost:3003',
  landingUrl: process.env['LANDING_URL'] ?? 'http://localhost:3000',
  // Refresh-token cookie. In prod set cookieDomain to the shared parent (e.g. `.okilchai.com`)
  // and cookieSecure=true; SameSite=Lax blocks cross-site CSRF while allowing same-site subdomains.
  cookieDomain: process.env['AUTH_COOKIE_DOMAIN'] ?? '',
  cookieSecure: (process.env['AUTH_COOKIE_SECURE'] ?? 'false') === 'true',
  cookieSameSite: (process.env['AUTH_COOKIE_SAMESITE'] ?? 'lax') as 'lax' | 'strict' | 'none',
  refreshCookieMaxAgeMs: parseDurationMs(process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d'),
}));
