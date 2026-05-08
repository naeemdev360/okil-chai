import type { ApiError as ApiErrorShape } from '@okil-chai/shared';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly timestamp: string;
  readonly path: string;
  readonly requestId?: string;

  constructor(shape: ApiErrorShape) {
    super(shape.message);
    this.name = 'ApiError';
    this.statusCode = shape.statusCode;
    this.errorCode = shape.errorCode;
    this.timestamp = shape.context.timestamp;
    this.path = shape.context.path;
    this.requestId = shape.context.requestId;
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
