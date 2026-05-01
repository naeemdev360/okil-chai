import { createApiClient } from '@okil-chai/api-client';

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL as string,
  // Token will be sourced from the auth store once it exists.
  // Using localStorage directly until apps/admin/src/lib/store/auth.store.ts is built.
  getToken: () => localStorage.getItem('accessToken'),
});
