import { Inject, Injectable } from '@nestjs/common';
import { ConsultationType, DocumentType, VerificationStatus } from '@repo/shared';
import type { LawyerProfileResponse } from '@repo/shared';
import { and, eq, inArray } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import {
  lawyerDocuments,
  lawyerLanguages,
  lawyerProfiles,
  lawyerSpecializations,
  specializations,
} from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import type {
  DocumentRecord,
  ILawyersRepository,
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
}
