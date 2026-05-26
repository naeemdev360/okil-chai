import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError as ApiErrorShape, ApiResponse } from '@repo/shared';
import { ApiError } from './errors';
import type { ApiClientConfig, TokenStore } from './types';

const REFRESH_PATH = '/auth/refresh';
const UNAUTHORIZED = 401;

// Public auth endpoints where a 401 is terminal (bad credentials / expired link), NOT an
// expired access token — never attempt a silent refresh + retry for these.
const NO_REFRESH_PATHS: ReadonlySet<string> = new Set([
  '/auth/login',
  '/auth/signup',
  '/auth/signup/lawyer',
  '/auth/refresh',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
]);

interface RetriableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function createAxiosInstance(config: ApiClientConfig, tokens: TokenStore): AxiosInstance {
  const instance = axios.create({
    baseURL: `${config.baseUrl}/api/v1`,
    // No global Content-Type — axios auto-sets application/json for plain objects
    // and multipart/form-data (with boundary) when data is FormData.
    timeout: 15_000,
    // Send/receive the httpOnly refresh cookie on cross-subdomain requests.
    withCredentials: true,
  });

  instance.interceptors.request.use((req) => {
    const token = tokens.get();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  // Coalesce concurrent refreshes so a burst of 401s triggers a single /auth/refresh call.
  let pendingRefresh: Promise<string | null> | null = null;

  const refreshAccessToken = (): Promise<string | null> => {
    pendingRefresh ??= instance
      .post<ApiResponse<{ accessToken: string }>>(REFRESH_PATH)
      .then((res) => {
        const token = res.data.data.accessToken;
        tokens.set(token);
        return token;
      })
      .catch(() => {
        tokens.set(null);
        return null;
      })
      .finally(() => {
        pendingRefresh = null;
      });
    return pendingRefresh;
  };

  instance.interceptors.response.use(undefined, async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response == null) throw error;

    const original = error.config as RetriableRequest | undefined;
    const skipRefresh = original ? NO_REFRESH_PATHS.has(original.url ?? '') : true;

    if (error.response.status === UNAUTHORIZED && original && !original._retry && !skipRefresh) {
      original._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return instance.request(original);
      }
      config.onAuthFailure?.();
    }

    throw new ApiError(error.response.data as ApiErrorShape);
  });

  return instance;
}
