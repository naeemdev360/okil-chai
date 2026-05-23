import { Inject, Injectable } from '@nestjs/common';
import { ConsultationType, DocumentStatus, DocumentType, VerificationStatus } from '@repo/shared';
import type { AvailabilityRuleResponse, LawyerDocumentResponse, LawyerProfileResponse, LawyerPublicProfileResponse } from '@repo/shared';
import { and, count, eq, gte, ilike, inArray, lte, sql } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import {
  availability,
  lawyerDocuments,
  lawyerLanguages,
  lawyerProfiles,
  lawyerSpecializations,
  specializations,
} from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import type {
  AvailabilityRule,
  CreateAvailabilityRuleInput,
  DocumentRecord,
  ILawyersRepository,
  LawyerSearchFilters,
  ProfileUpdateData,
  StoredDocument,
} from './interfaces/lawyers.interfaces';

@Injectable()
export class LawyersRepository extends BaseRepository implements ILawyersRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async findProfileByUserId(userId: string): Promise<LawyerProfileResponse | null> {
    const [profile] = await this.db
      .select()
      .from(lawyerProfiles)
      .where(eq(lawyerProfiles.userId, userId))
      .limit(1);

    if (!profile) return null;

    const [langRows, specRows, docRows] = await Promise.all([
      this.db
        .select({ language: lawyerLanguages.language })
        .from(lawyerLanguages)
        .where(eq(lawyerLanguages.lawyerId, profile.id)),
      this.db
        .select({
          slug: specializations.slug,
          name: specializations.name,
          isPrimary: lawyerSpecializations.isPrimary,
        })
        .from(lawyerSpecializations)
        .innerJoin(specializations, eq(lawyerSpecializations.specializationId, specializations.id))
        .where(eq(lawyerSpecializations.lawyerId, profile.id)),
      this.db
        .select({
          id: lawyerDocuments.id,
          type: lawyerDocuments.type,
          name: lawyerDocuments.name,
          sizeBytes: lawyerDocuments.sizeBytes,
          status: lawyerDocuments.status,
        })
        .from(lawyerDocuments)
        .where(eq(lawyerDocuments.lawyerId, profile.id)),
    ]);

    const documents: LawyerDocumentResponse[] = docRows.map((d) => ({
      id: d.id,
      type: d.type as DocumentType,
      name: d.name,
      sizeBytes: d.sizeBytes,
      status: d.status as DocumentStatus,
    }));

    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      photoUrl: profile.photoUrl,
      bio: profile.bio,
      yearsOfExperience: profile.yearsOfExperience,
      barNumber: profile.barNumber,
      yearAdmitted: profile.yearAdmitted,
      barCouncil: profile.barCouncil,
      city: profile.city,
      country: profile.country,
      pricePerHour: profile.pricePerHour,
      consultationTypes: (profile.consultationTypes ?? []) as ConsultationType[],
      specializations: specRows.map((s) => ({
        slug: s.slug,
        name: s.name,
        isPrimary: s.isPrimary,
      })),
      languages: langRows.map((l) => l.language),
      documents,
      verificationStatus: profile.verificationStatus as VerificationStatus,
      onboardingStep: profile.onboardingStep,
      isPublished: profile.isPublished,
      createdAt: profile.createdAt,
    };
  }

  async updateProfile(lawyerId: string, data: Partial<ProfileUpdateData>): Promise<void> {
    await this.db
      .update(lawyerProfiles)
      .set(data)
      .where(eq(lawyerProfiles.id, lawyerId));
  }

  async updateVerificationStatus(lawyerId: string, status: VerificationStatus): Promise<void> {
    await this.db
      .update(lawyerProfiles)
      .set({ verificationStatus: status })
      .where(eq(lawyerProfiles.id, lawyerId));
  }

  async upsertConsultationTypes(lawyerId: string, types: ConsultationType[]): Promise<void> {
    await this.db
      .update(lawyerProfiles)
      .set({ consultationTypes: types })
      .where(eq(lawyerProfiles.id, lawyerId));
  }

  async upsertLanguages(lawyerId: string, languages: string[]): Promise<void> {
    await this.transaction(async (tx) => {
      await tx.delete(lawyerLanguages).where(eq(lawyerLanguages.lawyerId, lawyerId));
      if (languages.length > 0) {
        await tx.insert(lawyerLanguages).values(
          languages.map((language) => ({ lawyerId, language })),
        );
      }
    });
  }

  async upsertSpecializations(lawyerId: string, slugs: string[]): Promise<void> {
    const specRows = await this.db
      .select({ id: specializations.id, slug: specializations.slug })
      .from(specializations)
      .where(and(inArray(specializations.slug, slugs), eq(specializations.isActive, true)));

    await this.transaction(async (tx) => {
      await tx.delete(lawyerSpecializations).where(eq(lawyerSpecializations.lawyerId, lawyerId));
      if (specRows.length > 0) {
        await tx.insert(lawyerSpecializations).values(
          specRows.map((s, i) => ({
            lawyerId,
            specializationId: s.id,
            isPrimary: i === 0,
          })),
        );
      }
    });
  }

  async insertDocument(lawyerId: string, doc: DocumentRecord): Promise<void> {
    await this.db.insert(lawyerDocuments).values({
      lawyerId,
      type: doc.type as DocumentType,
      name: doc.name,
      storageKey: doc.storageKey,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
    });
  }

  async findDocumentByIdAndLawyerId(documentId: string, lawyerId: string): Promise<StoredDocument | null> {
    const [doc] = await this.db
      .select({ id: lawyerDocuments.id, storageKey: lawyerDocuments.storageKey })
      .from(lawyerDocuments)
      .where(and(eq(lawyerDocuments.id, documentId), eq(lawyerDocuments.lawyerId, lawyerId)))
      .limit(1);
    return doc ?? null;
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.db.delete(lawyerDocuments).where(eq(lawyerDocuments.id, documentId));
  }

  async searchLawyers(
    filters: LawyerSearchFilters,
  ): Promise<{ lawyers: LawyerPublicProfileResponse[]; total: number }> {
    const { specialization, city, lang, minPrice, maxPrice, rating, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(lawyerProfiles.isPublished, true),
      eq(lawyerProfiles.verificationStatus, VerificationStatus.APPROVED),
    ];

    if (city) conditions.push(ilike(lawyerProfiles.city, `%${city}%`));
    if (minPrice !== undefined) conditions.push(gte(lawyerProfiles.pricePerHour, String(minPrice)));
    if (maxPrice !== undefined) conditions.push(lte(lawyerProfiles.pricePerHour, String(maxPrice)));
    if (rating !== undefined) conditions.push(gte(lawyerProfiles.avgRating, String(rating)));

    if (specialization) {
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${lawyerSpecializations}
          INNER JOIN ${specializations} ON ${lawyerSpecializations.specializationId} = ${specializations.id}
          WHERE ${lawyerSpecializations.lawyerId} = ${lawyerProfiles.id}
            AND ${specializations.slug} = ${specialization}
        )`,
      );
    }

    if (lang) {
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${lawyerLanguages}
          WHERE ${lawyerLanguages.lawyerId} = ${lawyerProfiles.id}
            AND lower(${lawyerLanguages.language}) = lower(${lang})
        )`,
      );
    }

    const where = and(...conditions);

    const countResult = await this.db
      .select({ total: count() })
      .from(lawyerProfiles)
      .where(where);
    const total = countResult[0]?.total ?? 0;

    const rows = await this.db
      .select()
      .from(lawyerProfiles)
      .where(where)
      .limit(limit)
      .offset(offset);

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

  async findPublicProfileById(lawyerId: string): Promise<LawyerPublicProfileResponse | null> {
    const [profile] = await this.db
      .select()
      .from(lawyerProfiles)
      .where(
        and(
          eq(lawyerProfiles.id, lawyerId),
          eq(lawyerProfiles.isPublished, true),
          eq(lawyerProfiles.verificationStatus, VerificationStatus.APPROVED),
        ),
      )
      .limit(1);

    if (!profile) return null;

    const [langRows, specRows] = await Promise.all([
      this.db
        .select({ language: lawyerLanguages.language })
        .from(lawyerLanguages)
        .where(eq(lawyerLanguages.lawyerId, profile.id)),
      this.db
        .select({
          slug: specializations.slug,
          name: specializations.name,
          isPrimary: lawyerSpecializations.isPrimary,
        })
        .from(lawyerSpecializations)
        .innerJoin(specializations, eq(lawyerSpecializations.specializationId, specializations.id))
        .where(eq(lawyerSpecializations.lawyerId, profile.id)),
    ]);

    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      photoUrl: profile.photoUrl,
      bio: profile.bio,
      yearsOfExperience: profile.yearsOfExperience,
      city: profile.city,
      country: profile.country,
      pricePerHour: profile.pricePerHour,
      consultationTypes: (profile.consultationTypes ?? []) as ConsultationType[],
      specializations: specRows,
      languages: langRows.map((l) => l.language),
      avgRating: profile.avgRating,
      totalReviews: profile.totalReviews,
      totalConsultations: profile.totalConsultations,
      isInstantBooking: profile.isInstantBooking,
      createdAt: profile.createdAt,
    };
  }

  async findAvailabilityByLawyerId(lawyerId: string): Promise<AvailabilityRule[]> {
    const rows = await this.db
      .select({
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime,
      })
      .from(availability)
      .where(and(eq(availability.lawyerId, lawyerId), eq(availability.isRecurring, true)));

    return rows;
  }

  async findAvailabilityRulesByLawyerId(lawyerId: string): Promise<AvailabilityRuleResponse[]> {
    const rows = await this.db
      .select({
        id: availability.id,
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime,
        isRecurring: availability.isRecurring,
      })
      .from(availability)
      .where(eq(availability.lawyerId, lawyerId));

    return rows;
  }

  async insertAvailabilityRule(lawyerId: string, input: CreateAvailabilityRuleInput): Promise<AvailabilityRuleResponse> {
    const [row] = await this.db
      .insert(availability)
      .values({
        lawyerId,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
        isRecurring: true,
      })
      .returning({
        id: availability.id,
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime,
        isRecurring: availability.isRecurring,
      });

    return row!;
  }

  async findAvailabilityRuleByIdAndLawyerId(ruleId: string, lawyerId: string): Promise<AvailabilityRuleResponse | null> {
    const [row] = await this.db
      .select({
        id: availability.id,
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime,
        isRecurring: availability.isRecurring,
      })
      .from(availability)
      .where(and(eq(availability.id, ruleId), eq(availability.lawyerId, lawyerId)))
      .limit(1);

    return row ?? null;
  }

  async deleteAvailabilityRuleById(ruleId: string): Promise<void> {
    await this.db.delete(availability).where(eq(availability.id, ruleId));
  }

  async replaceAvailabilityRules(lawyerId: string, rules: CreateAvailabilityRuleInput[]): Promise<AvailabilityRuleResponse[]> {
    return this.transaction(async (tx) => {
      await tx.delete(availability).where(eq(availability.lawyerId, lawyerId));

      if (rules.length === 0) return [];

      return tx
        .insert(availability)
        .values(rules.map((r) => ({ lawyerId, dayOfWeek: r.dayOfWeek, startTime: r.startTime, endTime: r.endTime, isRecurring: true })))
        .returning({
          id: availability.id,
          dayOfWeek: availability.dayOfWeek,
          startTime: availability.startTime,
          endTime: availability.endTime,
          isRecurring: availability.isRecurring,
        });
    });
  }
}
