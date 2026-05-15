import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { LawyerProfileResponse } from '@repo/shared';
import { STORAGE_SERVICE, type IStorageService } from '../storage/interfaces/storage.interfaces';
import {
  LAWYERS_REPOSITORY,
  type CompleteOnboardingInput,
  type ILawyersRepository,
  type ILawyersService,
  type ProfileUpdateData,
} from './interfaces/lawyers.interfaces';

@Injectable()
export class LawyersService implements ILawyersService {
  constructor(
    @Inject(LAWYERS_REPOSITORY) private readonly lawyersRepository: ILawyersRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}

  async completeOnboarding({
    userId,
    dto,
    profilePhoto,
    documents = [],
  }: CompleteOnboardingInput): Promise<LawyerProfileResponse> {
    const profile = await this.lawyersRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Lawyer profile not found');

    const profileUpdate: Partial<ProfileUpdateData> = {};

    if (dto.phone !== undefined) profileUpdate.phone = dto.phone;
    if (dto.yearsOfExperience !== undefined) profileUpdate.yearsOfExperience = dto.yearsOfExperience;
    if (dto.bio !== undefined) profileUpdate.bio = dto.bio;
    if (dto.barNumber !== undefined) profileUpdate.barNumber = dto.barNumber;
    if (dto.yearAdmitted !== undefined) profileUpdate.yearAdmitted = dto.yearAdmitted;
    if (dto.barCouncil !== undefined) profileUpdate.barCouncil = dto.barCouncil;
    if (dto.city !== undefined) profileUpdate.city = dto.city;
    if (dto.country !== undefined) profileUpdate.country = dto.country;
    if (dto.pricePerHour !== undefined) profileUpdate.pricePerHour = String(dto.pricePerHour);

    if (profilePhoto) {
      const { url } = await this.storageService.upload({ file: profilePhoto, folder: 'avatars' });
      profileUpdate.photoUrl = url;
    }

    if (Object.keys(profileUpdate).length > 0) {
      await this.lawyersRepository.updateProfile(profile.id, profileUpdate);
    }

    if (dto.languages?.length) {
      await this.lawyersRepository.upsertLanguages(profile.id, dto.languages);
    }

    if (dto.specializationSlugs?.length) {
      await this.lawyersRepository.upsertSpecializations(profile.id, dto.specializationSlugs);
    }

    for (const { file, type } of documents) {
      const { key } = await this.storageService.upload({ file, folder: 'lawyer-documents' });
      await this.lawyersRepository.insertDocument(profile.id, {
        type,
        name: file.originalname,
        storageKey: key,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      });
    }

    return this.lawyersRepository.findProfileByUserId(userId) as Promise<LawyerProfileResponse>;
  }

  async getProfile(userId: string): Promise<LawyerProfileResponse> {
    const profile = await this.lawyersRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Lawyer profile not found');
    return profile;
  }

  async deleteDocument(userId: string, documentId: string): Promise<void> {
    const profile = await this.lawyersRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Lawyer profile not found');

    const document = await this.lawyersRepository.findDocumentByIdAndLawyerId(documentId, profile.id);
    if (!document) throw new NotFoundException('Document not found');

    // DB first: makes the record invisible immediately; an orphaned storage object
    // is recoverable, but a DB record pointing to a deleted file is not.
    await this.lawyersRepository.deleteDocument(documentId);
    await this.storageService.delete(document.storageKey);
  }
}
