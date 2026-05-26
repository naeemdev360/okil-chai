import type { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';
import { SESSION_HINT_COOKIE } from '@repo/shared';

export const REFRESH_COOKIE_NAME = 'okilchai_rt';

/** Base cookie attributes (everything except `maxAge`). Set and clear MUST share these or the browser won't remove the cookie. */
function baseCookieOptions(config: ConfigService): CookieOptions {
  const domain = config.get<string>('auth.cookieDomain');
  return {
    httpOnly: true,
    secure: config.get<boolean>('auth.cookieSecure') ?? false,
    sameSite: config.get<'lax' | 'strict' | 'none'>('auth.cookieSameSite') ?? 'lax',
    domain: domain ? domain : undefined,
    path: '/',
  };
}

/** Session-hint cookie shares the refresh cookie's scope but is readable by JS (not httpOnly). */
function hintCookieOptions(config: ConfigService): CookieOptions {
  return { ...baseCookieOptions(config), httpOnly: false };
}

/** Set the httpOnly refresh cookie plus its JS-readable hint mirror, both with the same lifetime. */
export function setSessionCookies(res: Response, token: string, config: ConfigService): void {
  const maxAge = config.get<number>('auth.refreshCookieMaxAgeMs');
  res.cookie(REFRESH_COOKIE_NAME, token, { ...baseCookieOptions(config), maxAge });
  res.cookie(SESSION_HINT_COOKIE, '1', { ...hintCookieOptions(config), maxAge });
}

/** Clear both the refresh cookie and its hint mirror. Options must match those used when setting. */
export function clearSessionCookies(res: Response, config: ConfigService): void {
  res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions(config));
  res.clearCookie(SESSION_HINT_COOKIE, hintCookieOptions(config));
}

export function readRefreshCookie(req: Request): string | null {
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.[REFRESH_COOKIE_NAME] ?? null;
}
