import type { PaginationMeta } from './pagination.types';

export interface ApiResponse<TData> {
  readonly data: TData;
  readonly meta?: PaginationMeta;
}

export interface ApiError {
  readonly statusCode: number;
  readonly message: string;
  readonly errorCode: string;
  readonly timestamp: string;
  readonly path: string;
}
