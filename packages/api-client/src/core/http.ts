import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@repo/shared';

/**
 * Typed wrapper around AxiosInstance.
 *
 * - get / post / patch / remove  →  unwrap the { data } envelope, return T directly.
 * - list                         →  keep the envelope, return ApiResponse<T[]> so callers
 *                                   can access PaginationMeta alongside the items.
 * - upload                       →  POST FormData; axios sets multipart/form-data + boundary.
 */
export interface Http {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  list<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<readonly T[]>>;
  post<T = void>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = void>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  upload<T = void>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T>;
  remove<T = void>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export function createHttp(instance: AxiosInstance): Http {
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.get<ApiResponse<T>>(url, config).then((r) => r.data.data),

    list: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.get<ApiResponse<readonly T[]>>(url, config).then((r) => r.data),

    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      instance.post<ApiResponse<T>>(url, data, config).then((r) => r.data.data),

    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      instance.patch<ApiResponse<T>>(url, data, config).then((r) => r.data.data),

    upload: <T>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
      instance.post<ApiResponse<T>>(url, formData, config).then((r) => r.data.data),

    remove: <T>(url: string, config?: AxiosRequestConfig) =>
      instance.delete<ApiResponse<T>>(url, config).then((r) => r.data.data),
  };
}
