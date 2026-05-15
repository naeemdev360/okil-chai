import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, VerificationStatus } from '@repo/shared';
import {
  ADMIN_REPOSITORY,
  type AdminLawyerSummary,
  type AdminUserSummary,
  type IAdminRepository,
  type IAdminService,
  type LawyerListFilters,
  type PaginatedResult,
  type PlatformStats,
  type UserListFilters,
} from './interfaces/admin.interfaces';

const PROTECTED_ROLES = new Set<Role>([Role.PLATFORM_ADMIN]);

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject(ADMIN_REPOSITORY) private readonly repo: IAdminRepository,
  ) {}

  listUsers(filters: UserListFilters): Promise<PaginatedResult<AdminUserSummary>> {
    return this.repo.listUsers(filters);
  }

  async getUserById(id: string): Promise<AdminUserSummary> {
    const user = await this.repo.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async suspendUser(targetId: string, adminId: string): Promise<void> {
    this.preventSelfAction(targetId, adminId, 'suspend');
    const target = await this.requireUser(targetId);
    this.preventActingOnAdmin(target, 'suspend');
    if (!target.isActive) throw new BadRequestException('User is already suspended');
    await this.repo.setUserActiveStatus(targetId, false);
  }

  async activateUser(targetId: string, adminId: string): Promise<void> {
    this.preventSelfAction(targetId, adminId, 'activate');
    const target = await this.requireUser(targetId);
    if (target.isActive) throw new BadRequestException('User is already active');
    await this.repo.setUserActiveStatus(targetId, true);
  }

  async assignRole(targetId: string, role: Role, adminId: string): Promise<void> {
    this.preventSelfAction(targetId, adminId, 'assign a role to');
    this.preventProtectedRoleChange(role, 'assign');
    await this.requireUser(targetId);
    await this.repo.assignRole(targetId, role, adminId);
  }

  async revokeRole(targetId: string, role: Role, adminId: string): Promise<void> {
    this.preventSelfAction(targetId, adminId, 'revoke a role from');
    this.preventProtectedRoleChange(role, 'revoke');
    await this.requireUser(targetId);
    await this.repo.revokeRole(targetId, role);
  }

  listLawyers(filters: LawyerListFilters): Promise<PaginatedResult<AdminLawyerSummary>> {
    return this.repo.listLawyers(filters);
  }

  async updateLawyerVerification(
    lawyerId: string,
    status: VerificationStatus,
    notes: string | null,
    adminId: string,
  ): Promise<void> {
    if (status === VerificationStatus.REJECTED && !notes) {
      throw new BadRequestException('Rejection notes are required');
    }
    await this.repo.updateLawyerVerification(lawyerId, status, notes ?? null, adminId);
  }

  getPlatformStats(): Promise<PlatformStats> {
    return this.repo.getPlatformStats();
  }

  // ── Private guards ──────────────────────────────────────────────────────────

  private preventSelfAction(targetId: string, adminId: string, action: string): void {
    if (targetId === adminId) {
      throw new ForbiddenException(`You cannot ${action} your own account`);
    }
  }

  private preventActingOnAdmin(target: AdminUserSummary, action: string): void {
    if (target.roles.includes(Role.PLATFORM_ADMIN)) {
      throw new ForbiddenException(`You cannot ${action} another platform admin`);
    }
  }

  private preventProtectedRoleChange(role: Role, action: string): void {
    if (PROTECTED_ROLES.has(role)) {
      throw new ForbiddenException(
        `The ${role} role cannot be ${action === 'assign' ? 'assigned' : 'revoked'} via the API. Use a database migration.`,
      );
    }
  }

  private async requireUser(id: string): Promise<AdminUserSummary> {
    const user = await this.repo.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
