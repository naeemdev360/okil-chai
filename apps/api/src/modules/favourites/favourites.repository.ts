import { Inject, Injectable } from '@nestjs/common';
import { ConsultationType, VerificationStatus } from '@repo/shared';
import type { LawyerPublicProfileResponse, SearchPaginationQuery } from '@repo/shared';
import { and, count, eq, ilike, inArray, or } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import {
  lawyerFavourites,
  lawyerLanguages,
  lawyerProfiles,
  lawyerSpecializations,
  specializations,
} from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import { buildPagination } from '../../common/utils/pagination.util';
import type {
  FavouriteExistsResult,
  IFavouritesRepository,
} from './interfaces/favourites.interfaces';

@Injectable()
export class FavouritesRepository extends BaseRepository implements IFavouritesRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async findByUserIdAndLawyerId(userId: string, lawyerId: string): Promise<FavouriteExistsResult> {
    const [row] = await this.db
      .select({ id: lawyerFavourites.id })
      .from(lawyerFavourites)
      .where(
        and(
          eq(lawyerFavourites.userId, userId),
          eq(lawyerFavourites.lawyerId, lawyerId),
        ),
      )
      .limit(1);

    return row ? { exists: true, id: row.id } : { exists: false, id: null };
  }

  async insert(userId: string, lawyerId: string): Promise<void> {
    await this.db.insert(lawyerFavourites).values({ userId, lawyerId });
  }

  async deleteById(id: string): Promise<void> {
    await this.db.delete(lawyerFavourites).where(eq(lawyerFavourites.id, id));
  }

  async findFavouritesByUserId(
    userId: string,
    query: SearchPaginationQuery,
  ): Promise<{ lawyers: LawyerPublicProfileResponse[]; total: number }> {
    const { limit, offset } = buildPagination(query);
    const searchTerm = query.search?.trim();
    const searchFilter = searchTerm
      ? or(
          ilike(lawyerProfiles.firstName, `%${searchTerm}%`),
          ilike(lawyerProfiles.lastName, `%${searchTerm}%`),
        )
      : undefined;

    const baseCondition = and(
      eq(lawyerFavourites.userId, userId),
      eq(lawyerProfiles.isPublished, true),
      eq(lawyerProfiles.verificationStatus, VerificationStatus.APPROVED),
      searchFilter,
    );

    const [countResult, rows] = await Promise.all([
      this.db
        .select({ total: count() })
        .from(lawyerFavourites)
        .innerJoin(lawyerProfiles, eq(lawyerFavourites.lawyerId, lawyerProfiles.id))
        .where(baseCondition),
      this.db
        .select({
          id: lawyerProfiles.id,
          firstName: lawyerProfiles.firstName,
          lastName: lawyerProfiles.lastName,
          photoUrl: lawyerProfiles.photoUrl,
          bio: lawyerProfiles.bio,
          yearsOfExperience: lawyerProfiles.yearsOfExperience,
          city: lawyerProfiles.city,
          country: lawyerProfiles.country,
          pricePerHour: lawyerProfiles.pricePerHour,
          consultationTypes: lawyerProfiles.consultationTypes,
          avgRating: lawyerProfiles.avgRating,
          totalReviews: lawyerProfiles.totalReviews,
          totalConsultations: lawyerProfiles.totalConsultations,
          isInstantBooking: lawyerProfiles.isInstantBooking,
          createdAt: lawyerProfiles.createdAt,
        })
        .from(lawyerFavourites)
        .innerJoin(lawyerProfiles, eq(lawyerFavourites.lawyerId, lawyerProfiles.id))
        .where(baseCondition)
        .orderBy(lawyerFavourites.createdAt)
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0]?.total ?? 0;
    const lawyerIds = rows.map((r) => r.id);

    if (lawyerIds.length === 0) return { lawyers: [], total };

    const [langRows, specRows] = await Promise.all([
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

    const lawyers: LawyerPublicProfileResponse[] = rows.map((p) => ({
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

    return { lawyers, total };
  }

  async countByUserId(userId: string): Promise<number> {
    const [row] = await this.db
      .select({ total: count() })
      .from(lawyerFavourites)
      .where(eq(lawyerFavourites.userId, userId));
    return row?.total ?? 0;
  }
}
