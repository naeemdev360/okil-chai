import { createAxiosInstance } from './core/axios-instance';
import { createHttp } from './core/http';
import { hasSessionHint } from './core/session-hint';
import { createAuthApi } from './modules/auth.api';
import { createLawyersApi } from './modules/lawyers.api';
import { createAppointmentsApi } from './modules/appointments.api';
import { createReviewsApi } from './modules/reviews.api';
import { createAdminApi } from './modules/admin.api';
import { createAiMatchApi } from './modules/ai-match.api';
import type { ApiClientConfig, TokenStore } from './core/types';
import type { UserProfile } from './types/auth.types';

export function createApiClient(config: ApiClientConfig) {
  let accessToken: string | null = null;
  const tokens: TokenStore = {
    get: () => accessToken,
    set: (token) => { accessToken = token; },
  };

  const instance = createAxiosInstance(config, tokens);
  const http = createHttp(instance);
  const auth = createAuthApi(http);

  return {
    auth,
    lawyers:      createLawyersApi(http),
    appointments: createAppointmentsApi(http),
    reviews:      createReviewsApi(http),
    admin:        createAdminApi(http),
    aiMatch:      createAiMatchApi(http),

    setAccessToken: (token: string | null): void => tokens.set(token),
    getAccessToken: (): string | null => tokens.get(),

    /** Silently restore a session: mint an access token from the refresh cookie, then load the profile. Returns null when no valid session exists. */
    bootstrap: async (): Promise<UserProfile | null> => {
      // Skip the network round-trip when no session-hint cookie is present (anonymous visitor).
      if (!hasSessionHint()) return null;
      try {
        const { accessToken: token } = await auth.refresh();
        tokens.set(token);
        return await auth.getMe();
      } catch {
        tokens.set(null);
        return null;
      }
    },
  } as const;
}

export type ApiClient = ReturnType<typeof createApiClient>;

// Core
export type { ApiClientConfig } from './core/types';
export { ApiError, isApiError } from './core/errors';

// Query key factories
export * from './keys';

// Domain types — single import path for callers
export type * from './types/auth.types';
export type * from './types/lawyers.types';
export type * from './types/appointments.types';
export type * from './types/reviews.types';
export type * from './types/admin.types';
export type * from './types/ai-match.types';
