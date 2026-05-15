import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from '@repo/shared';
import { AuditInterceptor } from '../interceptors/audit.interceptor';
import { RequireVerified } from './require-verified.decorator';
import { Roles } from './roles.decorator';

/**
 * Composite decorator for admin controller classes and methods.
 *
 * Applies:
 *   - @Roles(PLATFORM_ADMIN) → picked up by RolesGuard (redundant with AdminRouteGuard, intentional)
 *   - @RequireVerified()     → admin must have a verified email
 *   - @UseInterceptors(AuditInterceptor) → every action is audit-logged
 *   - Swagger security annotations
 *
 * AdminRouteGuard (global, APP_GUARD) is the primary enforcement layer.
 * This decorator is the secondary layer and documentation signal.
 */
export const AdminOnly = (): ClassDecorator & MethodDecorator =>
  applyDecorators(
    Roles(Role.PLATFORM_ADMIN),
    RequireVerified(),
    UseInterceptors(AuditInterceptor),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiForbiddenResponse({ description: 'Insufficient privileges' }),
  );
