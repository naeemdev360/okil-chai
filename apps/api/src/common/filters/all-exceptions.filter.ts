import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorShape {
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'Internal server error';

    const errorCode =
      exception instanceof HttpException
        ? exception.constructor.name.replace(/Exception$/, '').toUpperCase()
        : 'INTERNAL_SERVER_ERROR';

    if (status >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.message : 'Unknown error',
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const body: ErrorShape = {
      statusCode: status,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(body);
  }

  private extractMessage(exception: HttpException): string {
    const raw = exception.getResponse();
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'object' && raw !== null) {
      const obj = raw as Record<string, unknown>;
      if (Array.isArray(obj['message'])) return (obj['message'] as string[]).join(', ');
      if (typeof obj['message'] === 'string') return obj['message'];
    }
    return exception.message;
  }
}
