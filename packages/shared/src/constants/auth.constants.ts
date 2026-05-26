/**
 * Non-httpOnly companion to the refresh cookie. The API sets/clears it in lock-step with
 * the (httpOnly) refresh cookie so the SPA can tell whether a session *might* exist without
 * making a network call. Carries no token or sensitive value — it is a hint, never a
 * security boundary, and may be a stale false-positive until the next refresh.
 */
export const SESSION_HINT_COOKIE = 'okilchai_session';
