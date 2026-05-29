import { z } from 'zod';
import { CaseAssignmentStatus } from '../enums/case-assignment-status.enum.js';
import { CaseCategory } from '../enums/case-category.enum.js';
import { CaseHearingType } from '../enums/case-hearing-type.enum.js';
import { CaseStage } from '../enums/case-stage.enum.js';
import { CaseStatus } from '../enums/case-status.enum.js';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 5000;
const NOTE_MAX = 2000;
const VENUE_MAX = 300;
const REFERENCE_MAX = 100;

// ── Request schemas ───────────────────────────────────────────────────────────

export const CreateCaseRequestSchema = z.object({
  title: z.string().trim().min(1).max(TITLE_MAX),
  description: z.string().trim().max(DESCRIPTION_MAX).optional(),
  caseCategory: z.nativeEnum(CaseCategory),
  assignedLawyerId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  // Required when the creator is a lawyer opening the case on behalf of an existing client.
  // Ignored when the creator is the client (the API uses the authenticated user's id).
  clientUserId: z.string().uuid().optional(),
});
export type CreateCaseRequest = z.infer<typeof CreateCaseRequestSchema>;

export const UpdateCaseRequestSchema = z.object({
  title: z.string().trim().min(1).max(TITLE_MAX).optional(),
  description: z.string().trim().max(DESCRIPTION_MAX).optional(),
  referenceNumber: z.string().trim().max(REFERENCE_MAX).optional().nullable(),
  estimatedCompletionAt: z.string().datetime({ offset: true }).optional().nullable(),
});
export type UpdateCaseRequest = z.infer<typeof UpdateCaseRequestSchema>;

export const AssignLawyerRequestSchema = z.object({
  lawyerId: z.string().uuid(),
});
export type AssignLawyerRequest = z.infer<typeof AssignLawyerRequestSchema>;

export const StageTransitionRequestSchema = z.object({
  toStage: z.nativeEnum(CaseStage),
  note: z.string().trim().max(NOTE_MAX).optional(),
});
export type StageTransitionRequest = z.infer<typeof StageTransitionRequestSchema>;

export const CreateHearingRequestSchema = z.object({
  scheduledAt: z.string().datetime({ offset: true }),
  venue: z.string().trim().max(VENUE_MAX).optional(),
  hearingType: z.nativeEnum(CaseHearingType),
  notes: z.string().trim().max(NOTE_MAX).optional(),
});
export type CreateHearingRequest = z.infer<typeof CreateHearingRequestSchema>;

export const UpdateHearingRequestSchema = z.object({
  scheduledAt: z.string().datetime({ offset: true }).optional(),
  venue: z.string().trim().max(VENUE_MAX).optional(),
  hearingType: z.nativeEnum(CaseHearingType).optional(),
  notes: z.string().trim().max(NOTE_MAX).optional().nullable(),
  outcome: z.string().trim().max(NOTE_MAX).optional().nullable(),
});
export type UpdateHearingRequest = z.infer<typeof UpdateHearingRequestSchema>;

export const LinkAppointmentRequestSchema = z.object({
  appointmentId: z.string().uuid(),
});
export type LinkAppointmentRequest = z.infer<typeof LinkAppointmentRequestSchema>;

// ── Response schemas ──────────────────────────────────────────────────────────

const CaseParticipantSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  photoUrl: z.string().nullable(),
});

const CaseLawyerSchema = CaseParticipantSchema.extend({
  // The participant id of a lawyer is the lawyer_profile id; the user id is exposed separately for cross-referencing
  userId: z.string().uuid(),
});

export const CaseStageEventResponseSchema = z.object({
  id: z.string().uuid(),
  fromStage: z.nativeEnum(CaseStage).nullable(),
  toStage: z.nativeEnum(CaseStage),
  actor: CaseParticipantSchema,
  note: z.string().nullable(),
  occurredAt: z.coerce.date(),
});
export type CaseStageEventResponse = z.infer<typeof CaseStageEventResponseSchema>;

export const CaseHearingResponseSchema = z.object({
  id: z.string().uuid(),
  scheduledAt: z.coerce.date(),
  venue: z.string().nullable(),
  hearingType: z.nativeEnum(CaseHearingType),
  notes: z.string().nullable(),
  outcome: z.string().nullable(),
  createdAt: z.coerce.date(),
});
export type CaseHearingResponse = z.infer<typeof CaseHearingResponseSchema>;

export const CaseDocumentResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int(),
  uploader: CaseParticipantSchema,
  downloadUrl: z.string(),
  uploadedAt: z.coerce.date(),
});
export type CaseDocumentResponse = z.infer<typeof CaseDocumentResponseSchema>;

export const CaseAssignmentHistoryItemSchema = z.object({
  id: z.string().uuid(),
  lawyer: CaseLawyerSchema,
  invitedBy: CaseParticipantSchema,
  status: z.nativeEnum(CaseAssignmentStatus),
  invitedAt: z.coerce.date(),
  respondedAt: z.coerce.date().nullable(),
  releasedAt: z.coerce.date().nullable(),
  releaseReason: z.string().nullable(),
});
export type CaseAssignmentHistoryItem = z.infer<typeof CaseAssignmentHistoryItemSchema>;

export const ReleaseAssignmentRequestSchema = z.object({
  reason: z.string().trim().max(NOTE_MAX).optional(),
});
export type ReleaseAssignmentRequest = z.infer<typeof ReleaseAssignmentRequestSchema>;

export const CaseLinkedAppointmentSchema = z.object({
  id: z.string().uuid(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  status: z.string(),
  linkedAt: z.coerce.date(),
});
export type CaseLinkedAppointment = z.infer<typeof CaseLinkedAppointmentSchema>;

export const CaseSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  caseCategory: z.nativeEnum(CaseCategory),
  currentStage: z.nativeEnum(CaseStage),
  status: z.nativeEnum(CaseStatus),
  assignmentStatus: z.nativeEnum(CaseAssignmentStatus),
  client: CaseParticipantSchema,
  assignedLawyer: CaseLawyerSchema.nullable(),
  nextHearingAt: z.coerce.date().nullable(),
  estimatedCompletionAt: z.coerce.date().nullable(),
  openedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type CaseSummary = z.infer<typeof CaseSummarySchema>;

export const CaseDetailSchema = CaseSummarySchema.extend({
  description: z.string().nullable(),
  referenceNumber: z.string().nullable(),
  closedAt: z.coerce.date().nullable(),
  stageHistory: z.array(CaseStageEventResponseSchema),
  hearings: z.array(CaseHearingResponseSchema),
  documents: z.array(CaseDocumentResponseSchema),
  linkedAppointments: z.array(CaseLinkedAppointmentSchema),
  assignmentHistory: z.array(CaseAssignmentHistoryItemSchema),
});
export type CaseDetail = z.infer<typeof CaseDetailSchema>;

export const PaginatedCasesSchema = z.object({
  data: z.array(CaseSummarySchema),
  meta: z.object({
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  }),
});
export type PaginatedCasesResponse = z.infer<typeof PaginatedCasesSchema>;