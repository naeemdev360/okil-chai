import { createApiClient } from '@repo/api-client';
import { signInUrl } from '../auth';

export const api = createApiClient({
  baseUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? '',
  // The httpOnly refresh cookie is sent automatically; when a silent refresh fails, return to sign-in.
  onAuthFailure: () => {
    if (typeof window !== 'undefined') {
      window.location.href = signInUrl();
    }
  },
});
