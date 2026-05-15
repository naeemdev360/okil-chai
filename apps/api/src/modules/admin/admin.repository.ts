import { Inject, Injectable } from '@nestjs/common';
import { Role, VerificationStatus } from '@repo/shared';
import { and, count, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { lawyerProfiles, userRoles, users } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import { buildPagination, buildPaginationMeta } from '../../common/utils/pagination.util';
import type {
  AdminLawyerSummary,
  AdminUserSummary,
  IAdminRepository,
  LawyerListFilters,
  PaginatedResult,
  PlatformStats,
  UserListFilters,
} from './interfaces/admin.interfaces';

@Injectable()
export class AdminRepository extends BaseRepository implements IAdminRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async listUsers(filters: UserListFilters): Promise<PaginatedResult<AdminUserSummary>> {
    const { offset, limit, page } = buildPagination(filters);
    const whereConditions = this.buildUserWhereConditions(filters);

    const [userRows, countResult] = await Promise.all([
      this.db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          isVerified: users.isVerified,
          isActive: users.isActive,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(whereConditions)
        .orderBy(users.createdAt)
        .limit(limit)
        .offset(offset),

      this.db
        .select({ total: count() })
        .from(users)
        .where(whereConditions),
    ]);

    const roleRows = userRows.length
      ? await this.db
          .select({ userId: userRoles.userId, role: userRoles.role })
          .from(userRoles)
          .where(inArray(userRoles.userId, userRows.map((u) => u.id)))
      : [];

    const rolesByUserId = roleRows.reduce<Record<string, Role[]>>((acc, row) => {
      (acc[row.userId] ??= []).push(row.role as Role);
      return acc;
    }, {});

    const items: AdminUserSummary[] = userRows.map((u) => ({
      ...u,
      roles: rolesByUserId[u.id] ?? [],
    }));

    return { items, meta: buildPaginationMeta(countResult[0]?.total ?? 0, page, limit) };
  }

  async getUserById(id: string): Promise<AdminUserSummary | null> {
    const [userRow] = await this.db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        isVerified: users.isVerified,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!userRow) return null;

    const roleRows = await this.db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, id));

    return { ...userRow, roles: roleRows.map((r) => r.role as Role) };
  }

  async setUserActiveStatus(userId: string, isActive: boolean): Promise<void> {
    await this.db.update(users).set({ isActive }).where(eq(users.id, userId));
  }

  async assignRole(userId: string, role: Role, grantedBy: string): Promise<void> {
    await this.queryGuarded(
      () =>
        this.db
          .insert(userRoles)
          .values({ userId, role, grantedBy })
          .onConflictDoNothing(),
      { message: 'User already has this role', errorCode: 'ROLE_ALREADY_ASSIGNED' },
    );
  }

  async revokeRole(userId: string, role: Role): Promise<void> {
    await this.db
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.role, role)));
  }

  async listLawyers(filters: LawyerListFilters): Promise<PaginatedResult<AdminLawyerSummary>> {
    const { offset, limit, page } = buildPagination(filters);
    const whereConditions = this.buildLawyerWhereConditions(filters);

    const [rows, lawyerCountResult] = await Promise.all([
      this.db
        .select({
          userId: lawyerProfiles.userId,
          firstName: lawyerProfiles.firstName,
          lastName: lawyerProfiles.lastName,
          verificationStatus: lawyerProfiles.verificationStatus,
          isPublished: lawyerProfiles.isPublished,
          verificationNotes: lawyerProfiles.verificationNotes,
          createdAt: lawyerProfiles.createdAt,
        })
        .from(lawyerProfiles)
        .where(whereConditions)
        .orderBy(lawyerProfiles.createdAt)
        .limit(limit)
        .offset(offset),

      this.db
        .select({ total: count() })
        .from(lawyerProfiles)
        .where(whereConditions),
    ]);

    const items: AdminLawyerSummary[] = rows.map((r) => ({
      ...r,
      verificationStatus: r.verificationStatus as VerificationStatus,
    }));

    return { items, meta: buildPaginationMeta(lawyerCountResult[0]?.total ?? 0, page, limit) };
  }

  async updateLawyerVerification(
    userId: string,
    status: VerificationStatus,
    notes: string | null,
    verifiedBy: string,
  ): Promise<void> {
    const isPublished = status === VerificationStatus.APPROVED;
    await this.db
      .update(lawyerProfiles)
      .set({
        verificationStatus: status,
        verificationNotes: notes,
        verifiedBy,
        verifiedAt: new Date(),
        isPublished,
      })
      .where(eq(lawyerProfiles.userId, userId));
  }

  async getPlatformStats(): Promise<PlatformStats> {
    const [totalUsersResult, totalLawyersResult, pendingResult, activeResult] = await Promise.all([
      this.db.select({ total: count() }).from(users),
      this.db.select({ total: count() }).from(lawyerProfiles),
      this.db
        .select({ total: count() })
        .from(lawyerProfiles)
        .where(eq(lawyerProfiles.verificationStatus, VerificationStatus.PENDING)),
      this.db
        .select({ total: count() })
        .from(lawyerProfiles)
        .where(
          and(
            eq(lawyerProfiles.verificationStatus, VerificationStatus.APPROVED),
            eq(lawyerProfiles.isPublished, true),
          ),
        ),
    ]);

    return {
      totalUsers: totalUsersResult[0]?.total ?? 0,
      totalLawyers: totalLawyersResult[0]?.total ?? 0,
      pendingVerifications: pendingResult[0]?.total ?? 0,
      activeLawyers: activeResult[0]?.total ?? 0,
    };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private buildUserWhereConditions(filters: UserListFilters) {
    const conditions = [];

    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(users.email, term),
          ilike(users.firstName, term),
          ilike(users.lastName, term),
        ),
      );
    }

    if (filters.isActive !== undefined) {
      conditions.push(eq(users.isActive, filters.isActive));
    }

    if (filters.role) {
      const targetRole = filters.role;
      conditions.push(
        inArray(
          users.id,
          sql`(SELECT user_id FROM user_roles WHERE role = ${targetRole})`,
        ),
      );
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  private buildLawyerWhereConditions(filters: LawyerListFilters) {
    const conditions = [];

    if (filters.verificationStatus) {
      conditions.push(eq(lawyerProfiles.verificationStatus, filters.verificationStatus));
    }

    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(lawyerProfiles.firstName, term),
          ilike(lawyerProfiles.lastName, term),
        ),
      );
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }
}
