import { Inject, Injectable } from '@nestjs/common';
import { ConsultationType, LAWYER_ONBOARDING_TOTAL_STEPS, Role } from '@repo/shared';
import type { LawyerPublicProfileResponse, UpdateUserProfileRequest, UserProfileResponse } from '@repo/shared';
import type { PaginationQuery } from '@repo/shared';
import { and, count, eq, inArray } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { lawyerFavourites, lawyerLanguages, lawyerProfiles, lawyerSpecializations, specializations, userRoles, users } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import { buildPagination } from '../../common/utils/pagination.util';
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

    const [roleRows, [lawyerRow]] = await Promise.all([
      this.db.select({ role: userRoles.role }).from(userRoles).where(eq(userRoles.userId, userId)),
      this.db.select({ onboardingStep: lawyerProfiles.onboardingStep }).from(lawyerProfiles).where(eq(lawyerProfiles.userId, userId)).limit(1),
    ]);

    return {
      ...userRow,
      roles: roleRows.map((r) => r.role as Role),
      onboardingComplete: lawyerRow !== undefined && lawyerRow.onboardingStep >= LAWYER_ONBOARDING_TOTAL_STEPS,
      onboardingStep: lawyerRow?.onboardingStep ?? null,
    };
  }

  async updateProfile(userId: string, data: UpdateUserProfileRequest): Promise<void> {
    await this.db.update(users).set(data).where(eq(users.id, userId));
  }

  async addFavourite(userId: string, lawyerId: string): Promise<void> {
    await this.db
      .insert(lawyerFavourites)
      .values({ userId, lawyerId })
      .onConflictDoNothing();
  }

  async removeFavourite(userId: string, lawyerId: string): Promise<void> {
    await this.db
      .delete(lawyerFavourites)
      .where(and(eq(lawyerFavourites.userId, userId), eq(lawyerFavourites.lawyerId, lawyerId)));
  }

  async isFavourite(userId: string, lawyerId: string): Promise<boolean> {
    const [row] = await this.db
      .select({ id: lawyerFavourites.id })
      .from(lawyerFavourites)
      .where(and(eq(lawyerFavourites.userId, userId), eq(lawyerFavourites.lawyerId, lawyerId)))
      .limit(1);
    return row !== undefined;
  }

  async findFavourites(
    userId: string,
    query: PaginationQuery,
  ): Promise<{ items: LawyerPublicProfileResponse[]; total: number }> {
    const { offset, limit } = buildPagination(query);

    const [countResult, favRows] = await Promise.all([
      this.db
        .select({ total: count() })
        .from(lawyerFavourites)
        .where(eq(lawyerFavourites.userId, userId)),
      this.db
        .select({ lawyerId: lawyerFavourites.lawyerId })
        .from(lawyerFavourites)
        .where(eq(lawyerFavourites.userId, userId))
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0]?.total ?? 0;
    const lawyerIds = favRows.map((r) => r.lawyerId);
    if (lawyerIds.length === 0) return { items: [], total };

    const [profiles, langRows, specRows] = await Promise.all([
      this.db
        .select()
        .from(lawyerProfiles)
        .where(inArray(lawyerProfiles.id, lawyerIds)),
      this.db
        .select({ lawyerId: lawyerLanguages.lawyerId, language: lawyerLanguages.language })
        .from(lawyerLanguages)
        .where(inArray(lawyerLanguages.lawyerId, lawyerIds)),
      this.db
        .select({
          lawyerId: lawyerSpecializations.lawyerId,
          slug: specializations.slug,
          name: specializations.name,
          isPrimary: lawyerSpecializations.isPrimary,
        })
        .from(lawyerSpecializations)
        .innerJoin(specializations, eq(lawyerSpecializations.specializationId, specializations.id))
        .where(inArray(lawyerSpecializations.lawyerId, lawyerIds)),
    ]);

    const langMap = new Map<string, string[]>();
    for (const { lawyerId, language } of langRows) {
      const arr = langMap.get(lawyerId) ?? [];
      arr.push(language);
      langMap.set(lawyerId, arr);
    }

    const specMap = new Map<string, { slug: string; name: string; isPrimary: boolean }[]>();
    for (const { lawyerId, slug, name, isPrimary } of specRows) {
      const arr = specMap.get(lawyerId) ?? [];
      arr.push({ slug, name, isPrimary });
      specMap.set(lawyerId, arr);
    }

    const items: LawyerPublicProfileResponse[] = profiles.map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      photoUrl: p.photoUrl,
      bio: p.bio,
      yearsOfExperience: p.yearsOfExperience,
      city: p.city,
      country: p.country,
      pricePerHour: p.pricePerHour,
      consultationTypes: (p.consultationTypes ?? []) as ConsultationType[],
      specializations: specMap.get(p.id) ?? [],
      languages: langMap.get(p.id) ?? [],
      avgRating: p.avgRating,
      totalReviews: p.totalReviews,
      totalConsultations: p.totalConsultations,
      isInstantBooking: p.isInstantBooking,
      createdAt: p.createdAt,
    }));

    return { items, total };
  }
}
