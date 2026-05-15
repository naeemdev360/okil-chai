import type { PaginationMeta, PaginationQuery, Role, VerificationStatus } from '@repo/shared';

export const ADMIN_SERVICE = Symbol('ADMIN_SERVICE');
export const ADMIN_REPOSITORY = Symbol('ADMIN_REPOSITORY');

// ── Aggregated domain views ──────────────────────────────────────────────────

export interface AdminUserSummary {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly roles: readonly Role[];
  readonly isVerified: boolean;
  readonly isActive: boolean;
  readonly createdAt: Date;
}

export interface AdminLawyerSummary {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly verificationStatus: VerificationStatus;
  readonly isPublished: boolean;
  readonly verificationNotes: string | null;
  readonly createdAt: Date;
}

export interface PlatformStats {
  readonly totalUsers: number;
  readonly totalLawyers: number;
  readonly pendingVerifications: number;
  readonly activeLawyers: number;
}

// ── Filter shapes ────────────────────────────────────────────────────────────

export interface UserListFilters extends PaginationQuery {
  readonly search?: string;
  readonly role?: Role;
  readonly isActive?: boolean;
}

export interface LawyerListFilters extends PaginationQuery {
  readonly verificationStatus?: VerificationStatus;
  readonly search?: string;
}

export interface PaginatedResult<TItem> {
  readonly items: readonly TItem[];
  readonly meta: PaginationMeta;
}

// ── Repository contract ──────────────────────────────────────────────────────

export interface IAdminRepository {
  listUsers(filters: UserListFilters): Promise<PaginatedResult<AdminUserSummary>>;
  getUserById(id: string): Promise<AdminUserSummary | null>;
  setUserActiveStatus(userId: string, isActive: boolean): Promise<void>;
  assignRole(userId: string, role: Role, grantedBy: string): Promise<void>;
  revokeRole(userId: string, role: Role): Promise<void>;
  listLawyers(filters: LawyerListFilters): Promise<PaginatedResult<AdminLawyerSummary>>;
  updateLawyerVerification(
    userId: string,
    status: VerificationStatus,
    notes: string | null,
    verifiedBy: string,
  ): Promise<void>;
  getPlatformStats(): Promise<PlatformStats>;
}

// ── Service contract ─────────────────────────────────────────────────────────

export interface IAdminService {
  listUsers(filters: UserListFilters): Promise<PaginatedResult<AdminUserSummary>>;
  getUserById(id: string): Promise<AdminUserSummary>;
  suspendUser(targetId: string, adminId: string): Promise<void>;
  activateUser(targetId: string, adminId: string): Promise<void>;
  assignRole(targetId: string, role: Role, adminId: string): Promise<void>;
  revokeRole(targetId: string, role: Role, adminId: string): Promise<void>;
  listLawyers(filters: LawyerListFilters): Promise<PaginatedResult<AdminLawyerSummary>>;
  updateLawyerVerification(
    lawyerId: string,
    status: VerificationStatus,
    notes: string | null,
    adminId: string,
  ): Promise<void>;
  getPlatformStats(): Promise<PlatformStats>;
}
