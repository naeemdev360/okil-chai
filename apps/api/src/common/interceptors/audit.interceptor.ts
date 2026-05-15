import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';
import type { RequestUser } from '../../modules/auth/interfaces/auth.interfaces';

interface AuditEntry {
  readonly type: 'ADMIN_ACTION';
  readonly actorId: string;
  readonly method: string;
  readonly path: string;
  readonly ip: string;
  readonly durationMs: number;
  readonly status: 'SUCCESS' | 'FAILED';
  readonly reason?: string;
}

/**
 * Writes a structured audit log entry for every admin controller action.
 * Apply via @AdminOnly() at the controller class level — not globally.
 * Ships to stdout as JSON; pipe to any log aggregator (Elastic, DataDog, CloudWatch).
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditLog');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { user?: RequestUser }>();
    const { method, path } = request;
    const ip = this.extractClientIp(request);
    const actorId = request.user?.userId ?? 'unauthenticated';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.log({ type: 'ADMIN_ACTION', actorId, method, path, ip, durationMs: Date.now() - start, status: 'SUCCESS' }),
        error: (err: unknown) => this.log({
          type: 'ADMIN_ACTION',
          actorId,
          method,
          path,
          ip,
          durationMs: Date.now() - start,
          status: 'FAILED',
          reason: err instanceof Error ? err.message : 'unknown',
        }),
      }),
    );
  }

  private log(entry: AuditEntry): void {
    this.logger.log(JSON.stringify(entry));
  }

  private extractClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0]?.trim() ?? '';
    }
    return request.socket.remoteAddress ?? '';
  }
}
