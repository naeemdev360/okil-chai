import { Inject, Injectable } from '@nestjs/common';
import { Role } from '@repo/shared';
import type { UpdateUserProfileRequest, UserProfileResponse } from '@repo/shared';
import { eq } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { userRoles, users } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import type { IUsersRepository } from './interfaces/users.interfaces';

@Injectable()
export class UsersRepository extends BaseRepository implements IUsersRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async findProfileById(userId: string): Promise<UserProfileResponse | null> {
    const [userRow] = await this.db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        avatarUrl: users.avatarUrl,
        phone: users.phone,
        preferredLanguage: users.preferredLanguage,
        isVerified: users.isVerified,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userRow) return null;

    const roleRows = await this.db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    return {
      ...userRow,
      roles: roleRows.map((r) => r.role as Role),
    };
  }

  async updateProfile(userId: string, data: UpdateUserProfileRequest): Promise<void> {
    await this.db.update(users).set(data).where(eq(users.id, userId));
  }
}
