import { z } from 'zod';
import { ConsultationType } from '../enums/consultation-type.enum.js';
import { DocumentType } from '../enums/document-type.enum.js';
import { VerificationStatus } from '../enums/verification-status.enum.js';

const currentYear = new Date().getFullYear();

// ── Onboarding request (multipart/form-data — all fields arrive as strings) ──

export const CompleteOnboardingSchema = z.object({
  phone: z.string().min(7).max(20).optional(),
  yearsOfExperience: z.coerce.number().int().min(0).max(70).optional(),
  bio: z.string().min(10).max(2000).optional(),

  barNumber: z.string().min(1).max(100).optional(),
  yearAdmitted: z.coerce.number().int().min(1900).max(currentYear).optional(),
  barCouncil: z.string().min(1).max(200).optional(),

  city: z.string().min(1).max(100).optional(),
  country: z.string().length(2).optional(),

  pricePerHour: z.coerce.number().positive().max(10_000).optional(),

  /** JSON-encoded string → parsed to array, e.g. '["VIDEO","PHONE"]' */
  consultationTypes: z
    .string()
    .transform((v) => JSON.parse(v) as unknown)
    .pipe(z.array(z.nativeEnum(ConsultationType)).min(1))
    .optional(),

  /** JSON-encoded slugs, e.g. '["criminal-law","family-law"]' */
  specializationSlugs: z
    .string()
    .transform((v) => JSON.parse(v) as unknown)
    .pipe(z.array(z.string().min(1)).min(1).max(5))
    .optional(),

  /** JSON-encoded language names, e.g. '["English","Bengali"]' */
  languages: z
    .string()
    .transform((v) => JSON.parse(v) as unknown)
    .pipe(z.array(z.string().min(1)).min(1))
    .optional(),

  /**
   * DocumentType for each uploaded document file — must be parallel to
   * the `documents` files array, e.g. '["BAR_CERTIFICATE","LAW_DEGREE"]'
   */
  documentTypes: z
    .string()
    .transform((v) => JSON.parse(v) as unknown)
    .pipe(z.array(z.nativeEnum(DocumentType)).min(1))
    .optional(),
});

export type CompleteOnboardingRequest = z.infer<typeof CompleteOnboardingSchema>;

// ── Response schemas ──────────────────────────────────────────────────────────

export const LawyerProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  photoUrl: z.string().url().nullable(),
  bio: z.string().nullable(),
  yearsOfExperience: z.number().nullable(),
  barNumber: z.string().nullable(),
  yearAdmitted: z.number().nullable(),
  barCouncil: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  pricePerHour: z.string().nullable(),
  consultationTypes: z.array(z.nativeEnum(ConsultationType)),
  specializations: z.array(z.object({ slug: z.string(), name: z.string(), isPrimary: z.boolean() })),
  languages: z.array(z.string()),
  verificationStatus: z.nativeEnum(VerificationStatus),
  onboardingStep: z.number().int(),
  isPublished: z.boolean(),
  createdAt: z.coerce.date(),
});

export type LawyerProfileResponse = z.infer<typeof LawyerProfileSchema>;

// ── Public-facing profile (safe to expose to unauthenticated clients) ─────────

export const LawyerPublicProfileSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  photoUrl: z.string().url().nullable(),
  bio: z.string().nullable(),
  yearsOfExperience: z.number().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  pricePerHour: z.string().nullable(),
  consultationTypes: z.array(z.nativeEnum(ConsultationType)),
  specializations: z.array(z.object({ slug: z.string(), name: z.string(), isPrimary: z.boolean() })),
  languages: z.array(z.string()),
  avgRating: z.string().nullable(),
  totalReviews: z.number().int(),
  totalConsultations: z.number().int(),
  isInstantBooking: z.boolean(),
  createdAt: z.coerce.date(),
});

export type LawyerPublicProfileResponse = z.infer<typeof LawyerPublicProfileSchema>;

export const PaginatedLawyersSchema = z.object({
  data: z.array(LawyerPublicProfileSchema),
  meta: z.object({
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type PaginatedLawyersResponse = z.infer<typeof PaginatedLawyersSchema>;

// ── Availability slots ────────────────────────────────────────────────────────

export const AvailabilitySlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
});

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
