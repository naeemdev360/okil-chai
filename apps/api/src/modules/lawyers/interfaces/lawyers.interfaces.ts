import type {
  AvailabilityRuleResponse,
  AvailabilitySlot,
  CompleteOnboardingRequest,
  ConsultationType,
  DocumentType,
  LawyerProfileResponse,
  LawyerPublicProfileResponse,
  PaginatedLawyersResponse,
  VerificationStatus,
} from '@repo/shared';

export interface OnboardingFiles {
  profilePhoto?: Express.Multer.File[];
  documents?: Express.Multer.File[];
}

export const LAWYERS_REPOSITORY = Symbol('LAWYERS_REPOSITORY');
export const LAWYERS_SERVICE = Symbol('LAWYERS_SERVICE');

export interface UploadedDocument {
  readonly file: Express.Multer.File;
  readonly type: DocumentType;
}

export interface CompleteOnboardingInput {
  readonly userId: string;
  readonly dto: CompleteOnboardingRequest;
  readonly profilePhoto?: Express.Multer.File;
  readonly documents?: UploadedDocument[];
}

/** Backend-only — storageKey is never sent to the client */
export interface StoredDocument {
  readonly id: string;
  readonly storageKey: string;
}



// Derived from the shared canonical schema — add fields there, not here
export type ProfileUpdateData = Pick<
  LawyerProfileResponse,
  | 'phone'
  | 'yearsOfExperience'
  | 'bio'
  | 'barNumber'
  | 'yearAdmitted'
  | 'barCouncil'
  | 'city'
  | 'country'
  | 'pricePerHour'
  | 'photoUrl'
  | 'onboardingStep'
>;

export interface DocumentRecord {
  readonly type: DocumentType;
  readonly name: string;
  readonly storageKey: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

export interface LawyerSearchFilters {
  readonly specialization?: string;
  readonly city?: string;
  readonly lang?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly rating?: number;
  readonly page?: number;
  readonly limit?: number;
}

export interface AvailabilityRule {
  readonly dayOfWeek: number;
  readonly startTime: string;
  readonly endTime: string;
}

export interface CreateAvailabilityRuleInput {
  readonly dayOfWeek: number;
  readonly startTime: string;
  readonly endTime: string;
}

export interface ILawyersService {
  completeOnboarding(input: CompleteOnboardingInput): Promise<LawyerProfileResponse>;
  submitOnboarding(userId: string): Promise<LawyerProfileResponse>;
  getProfile(userId: string): Promise<LawyerProfileResponse>;
  deleteDocument(userId: string, documentId: string): Promise<void>;
  searchLawyers(filters: LawyerSearchFilters): Promise<PaginatedLawyersResponse>;
  getPublicProfile(lawyerId: string): Promise<LawyerPublicProfileResponse>;
  getAvailabilitySlots(lawyerId: string, from: string, to: string): Promise<AvailabilitySlot[]>;
  listAvailabilityRules(userId: string): Promise<AvailabilityRuleResponse[]>;
  createAvailabilityRule(userId: string, input: CreateAvailabilityRuleInput): Promise<AvailabilityRuleResponse>;
  deleteAvailabilityRule(userId: string, ruleId: string): Promise<void>;
  replaceAvailabilityRules(userId: string, rules: CreateAvailabilityRuleInput[]): Promise<AvailabilityRuleResponse[]>;
}

export interface ILawyersRepository {
  findProfileByUserId(userId: string): Promise<LawyerProfileResponse | null>;
  updateProfile(lawyerId: string, data: Partial<ProfileUpdateData>): Promise<void>;
  updateVerificationStatus(lawyerId: string, status: VerificationStatus): Promise<void>;
  upsertConsultationTypes(lawyerId: string, types: ConsultationType[]): Promise<void>;
  upsertLanguages(lawyerId: string, languages: string[]): Promise<void>;
  upsertSpecializations(lawyerId: string, slugs: string[]): Promise<void>;
  insertDocument(lawyerId: string, doc: DocumentRecord): Promise<void>;
  findDocumentByIdAndLawyerId(documentId: string, lawyerId: string): Promise<StoredDocument | null>;
  deleteDocument(documentId: string): Promise<void>;
  searchLawyers(filters: LawyerSearchFilters): Promise<{ lawyers: LawyerPublicProfileResponse[]; total: number }>;
  findPublicProfileById(lawyerId: string): Promise<LawyerPublicProfileResponse | null>;
  findAvailabilityByLawyerId(lawyerId: string): Promise<AvailabilityRule[]>;
  findAvailabilityRulesByLawyerId(lawyerId: string): Promise<AvailabilityRuleResponse[]>;
  insertAvailabilityRule(lawyerId: string, input: CreateAvailabilityRuleInput): Promise<AvailabilityRuleResponse>;
  findAvailabilityRuleByIdAndLawyerId(ruleId: string, lawyerId: string): Promise<AvailabilityRuleResponse | null>;
  deleteAvailabilityRuleById(ruleId: string): Promise<void>;
  replaceAvailabilityRules(lawyerId: string, rules: CreateAvailabilityRuleInput[]): Promise<AvailabilityRuleResponse[]>;
}