import { createApiClient } from '@repo/api-client';

export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  // The httpOnly refresh cookie is sent automatically; the access token lives in memory.
  // When a silent refresh fails mid-session, send the user to sign in again.
  onAuthFailure: () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
  },
});
