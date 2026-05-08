import type { PaginationMeta } from './pagination.types.js';

export interface ResponseContext {
  readonly timestamp: string;
  readonly path: string;
  readonly requestId?: string;
}

export interface ApiResponse<TData> {
  readonly success: true;
  readonly data: TData;
  readonly meta?: PaginationMeta;
  readonly context: ResponseContext;
}

export interface ApiError {
  readonly success: false;
  readonly statusCode: number;
  readonly message: string;
  readonly errorCode: string;
  readonly context: ResponseContext;
}
