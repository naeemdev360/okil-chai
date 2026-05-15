import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@repo/shared';
import type { Request } from 'express';
import type { RequestUser } from '../../modules/auth/interfaces/auth.interfaces';

/**
 * Global guard that activates for any path matching /admin.
 *
 * Applied AFTER JwtAuthGuard (req.user already populated).
 * Cannot be bypassed by @Public() — admin paths are never public:
 * if @Public() accidentally skips JWT validation, req.user is undefined
 * and this guard throws UnauthorizedException before the handler runs.
 *
 * Role assignment to PLATFORM_ADMIN must happen directly in the DB; no
 * API endpoint may grant that role. This guard is the last app-level
 * enforcement before the controller.
 */
@Injectable()
export class AdminRouteGuard implements CanActivate {
  private static readonly ADMIN_PATH_RE = /\/admin(\/|$)/;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user?: RequestUser }>();

    if (!AdminRouteGuard.ADMIN_PATH_RE.test(request.path)) return true;

    const user = request.user;
    if (!user) throw new UnauthorizedException();
    if (!user.roles.includes(Role.PLATFORM_ADMIN)) throw new ForbiddenException();

    return true;
  }
}
