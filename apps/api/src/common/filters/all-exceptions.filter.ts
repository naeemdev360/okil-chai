import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { ApiError } from '@okil-chai/shared';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)
  private static readonly INTERNAL_ERROR_MESSAGE = 'Internal server error';
  private static readonly INTERNAL_ERROR_CODE = 'INTERNAL_SERVER_ERROR';

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Normalize all throwables into an HTTP status so unknown errors are still client-safe.
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Prefer explicit exception payload details; fallback keeps internal failures opaque.
    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : AllExceptionsFilter.INTERNAL_ERROR_MESSAGE;

    // Expose a stable error code that clients can map to UX behavior.
    const errorCode =
      exception instanceof HttpException
        ? this.extractErrorCode(exception)
        : AllExceptionsFilter.INTERNAL_ERROR_CODE;

    if (status >= 500) {
      // Log only server-side failures to reduce noise from expected client validation errors.
      this.logger.error(
        exception instanceof Error ? exception.message : 'Unknown error',
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const body: ApiError = {
      success: false,
      statusCode: status,
      message,
      errorCode,
      context: {
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: this.extractRequestId(request),
      },
    };

    response.status(status).json(body);
  }

  private extractMessage(exception: HttpException): string {
    const raw = exception.getResponse();
    if (typeof raw === 'string') return raw;
    if (this.isRecord(raw)) {
      if (Array.isArray(raw.message)) {
        // Validation pipes often return message arrays; flatten for predictable API output.
        const messages = raw.message.filter((item): item is string => typeof item === 'string');
        if (messages.length > 0) return messages.join(', ');
      }
      if (typeof raw.message === 'string') return raw.message;
    }
    return exception.message;
  }

  private extractErrorCode(exception: HttpException): string {
    const raw = exception.getResponse();
    if (this.isRecord(raw) && typeof raw.errorCode === 'string') {
      return raw.errorCode;
    }

    // Fall back to exception class names for consistent machine-readable error identifiers.
    return exception.constructor.name.replace(/Exception$/, '').toUpperCase();
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private extractRequestId(request: Request): string | undefined {
    const value = request.headers['x-request-id'];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }
}
