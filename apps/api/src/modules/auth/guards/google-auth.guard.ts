import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@repo/shared';
import type { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // Passes the ?role= query param as OAuth state so GoogleStrategy can read the intent after callback.
  // Note: state is not CSRF-signed in this implementation — acceptable for MVP, add a state store for production.
  override getAuthenticateOptions(context: ExecutionContext): object {
    const req = context.switchToHttp().getRequest<Request>();
    const role = req.query['role'] === Role.LAWYER ? Role.LAWYER : Role.CLIENT;
    return { state: role };
  }
}
