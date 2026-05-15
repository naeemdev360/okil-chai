import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const start = Date.now();

    // Hook into response completion so logs include final status for both success and failures.
    response.on("finish", () => {
      const durationMs = Date.now() - start;
      this.logger.log(`${method} ${url} ${response.statusCode} - ${durationMs}ms`);
    });

    return next.handle();
  }
}
