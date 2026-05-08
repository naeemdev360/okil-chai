import { createAxiosInstance } from './core/axios-instance';
import { createHttp } from './core/http';
import { createAuthApi } from './modules/auth.api';
import { createLawyersApi } from './modules/lawyers.api';
import { createAppointmentsApi } from './modules/appointments.api';
import { createReviewsApi } from './modules/reviews.api';
import { createAdminApi } from './modules/admin.api';
export function createApiClient(config) {
    const instance = createAxiosInstance(config);
    const http = createHttp(instance);
    return {
        auth: createAuthApi(http),
        lawyers: createLawyersApi(http),
        appointments: createAppointmentsApi(http),
        reviews: createReviewsApi(http),
        admin: createAdminApi(http),
    };
}
export { ApiError, isApiError } from './core/errors';
// Query key factories
export * from './keys';
