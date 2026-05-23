/**
 * Platform fee charged as commission on the lawyer's payout (deducted from consultation fee).
 * Change this one value to update the rate everywhere: onboarding preview, booking summary,
 * and the backend payment calculation (which falls back to this default via PLATFORM_FEE_PERCENT env).
 */
export const PLATFORM_FEE_RATE = 0.1; // 10%

/**
 * Service fee added on top of the consultation fee and charged to the client.
 */
export const CLIENT_SERVICE_FEE_RATE = 0.05; // 5%
