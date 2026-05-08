import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import type { ApiResponse } from '@okil-chai/shared';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<TData>
  implements NestInterceptor<TData | ApiResponse<TData>, ApiResponse<TData>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<TData | ApiResponse<TData>>,
  ): Observable<ApiResponse<TData>> {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(map((payload) => this.toApiResponse(payload, request)));
  }

  private toApiResponse(
    payload: TData | ApiResponse<TData>,
    request: Request,
  ): ApiResponse<TData> {
    const context = {
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: this.extractRequestId(request),
    };

    if (this.isApiResponse(payload)) {
      return {
        success: true,
        data: payload.data,
        meta: payload.meta,
        context: payload.context ?? context,
      };
    }

    return {
      success: true,
      data: payload,
      context,
    };
  }

  private isApiResponse(value: unknown): value is ApiResponse<TData> {
    return this.isRecord(value) && 'data' in value;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private extractRequestId(request: Request): string | undefined {
    const value = request.headers['x-request-id'];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }
}
