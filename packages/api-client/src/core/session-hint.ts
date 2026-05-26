import { SESSION_HINT_COOKIE } from '@repo/shared';

/**
 * True when the JS-readable session-hint cookie is present — the API sets it alongside the
 * httpOnly refresh cookie. Lets the SPA skip `/auth/refresh` entirely for anonymous visitors.
 * SSR-safe: returns false when there's no `document` (server render).
 */
export function hasSessionHint(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split('; ')
    .some((entry) => entry.startsWith(`${SESSION_HINT_COOKIE}=`));
}
