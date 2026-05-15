import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_VERIFIED_KEY } from '../decorators/require-verified.decorator';
import type { RequestUser } from '../../modules/auth/interfaces/auth.interfaces';

@Injectable()
export class VerifiedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireVerified = this.reflector.getAllAndOverride<boolean>(REQUIRE_VERIFIED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireVerified) return true;

    const user: RequestUser = context.switchToHttp().getRequest<{ user: RequestUser }>().user;
    if (!user?.isVerified) {
      throw new ForbiddenException('Email verification required. Please check your inbox.');
    }
    return true;
  }
}
