import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role, VerificationStatus } from '@repo/shared';
import { AdminOnly } from '../../common/decorators/admin-only.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ListLawyersQueryDto } from './dto/list-lawyers-query.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import {
  ADMIN_SERVICE,
  type IAdminService,
  type PaginatedResult,
  type AdminUserSummary,
  type AdminLawyerSummary,
  type PlatformStats,
} from './interfaces/admin.interfaces';

@ApiTags('Admin')
@AdminOnly()
@Controller('admin')
export class AdminController {
  constructor(@Inject(ADMIN_SERVICE) private readonly adminService: IAdminService) {}

  // ── Platform stats ──────────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get platform-wide statistics' })
  getStats(): Promise<PlatformStats> {
    return this.adminService.getPlatformStats();
  }

  // ── User management ─────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users with optional filters' })
  listUsers(@Query() query: ListUsersQueryDto): Promise<PaginatedResult<AdminUserSummary>> {
    return this.adminService.listUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  getUser(@Param('id', ParseUUIDPipe) id: string): Promise<AdminUserSummary> {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend a user account' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  suspendUser(
    @Param('id', ParseUUIDPipe) targetId: string,
    @CurrentUser() admin: RequestUser,
  ): Promise<void> {
    return this.adminService.suspendUser(targetId, admin.userId);
  }

  @Patch('users/:id/activate')
  @ApiOperation({ summary: 'Re-activate a suspended user account' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  activateUser(
    @Param('id', ParseUUIDPipe) targetId: string,
    @CurrentUser() admin: RequestUser,
  ): Promise<void> {
    return this.adminService.activateUser(targetId, admin.userId);
  }

  @Post('users/:id/roles')
  @ApiOperation({ summary: 'Assign a role to a user (PLATFORM_ADMIN excluded)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  assignRole(
    @Param('id', ParseUUIDPipe) targetId: string,
    @Body() dto: AssignRoleDto,
    @CurrentUser() admin: RequestUser,
  ): Promise<void> {
    return this.adminService.assignRole(targetId, dto.role, admin.userId);
  }

  @Delete('users/:id/roles/:role')
  @ApiOperation({ summary: 'Revoke a role from a user (PLATFORM_ADMIN excluded)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiParam({ name: 'role', enum: Role })
  revokeRole(
    @Param('id', ParseUUIDPipe) targetId: string,
    @Param('role', new ParseEnumPipe(Role)) role: Role,
    @CurrentUser() admin: RequestUser,
  ): Promise<void> {
    return this.adminService.revokeRole(targetId, role, admin.userId);
  }

  // ── Lawyer verification ─────────────────────────────────────────────────────

  @Get('lawyers')
  @ApiOperation({ summary: 'List all lawyers with optional verification status filter' })
  listLawyers(@Query() query: ListLawyersQueryDto): Promise<PaginatedResult<AdminLawyerSummary>> {
    return this.adminService.listLawyers(query);
  }

  @Patch('lawyers/:id/verification')
  @ApiOperation({ summary: 'Update a lawyer\'s verification status' })
  @ApiParam({ name: 'id', description: 'Lawyer user UUID' })
  updateVerification(
    @Param('id', ParseUUIDPipe) lawyerId: string,
    @Body() dto: UpdateVerificationDto,
    @CurrentUser() admin: RequestUser,
  ): Promise<void> {
    return this.adminService.updateLawyerVerification(
      lawyerId,
      dto.status,
      dto.notes ?? null,
      admin.userId,
    );
  }
}
