import { createAxiosInstance } from './core/axios-instance';
import { createHttp } from './core/http';
import { createAuthApi } from './modules/auth.api';
import { createLawyersApi } from './modules/lawyers.api';
import { createAppointmentsApi } from './modules/appointments.api';
import { createReviewsApi } from './modules/reviews.api';
import { createAdminApi } from './modules/admin.api';
import type { ApiClientConfig } from './core/types';

export function createApiClient(config: ApiClientConfig) {
  const instance = createAxiosInstance(config);
  const http = createHttp(instance);

  return {
    auth: createAuthApi(http),
    lawyers: createLawyersApi(http),
    appointments: createAppointmentsApi(http),
    reviews: createReviewsApi(http),
    admin: createAdminApi(http),
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
