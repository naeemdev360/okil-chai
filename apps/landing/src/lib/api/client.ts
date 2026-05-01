import { createApiClient } from '@okil-chai/api-client';

export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  // Only relevant for client components. RSC pages call the API directly server-side.
  getToken: () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null),
});
