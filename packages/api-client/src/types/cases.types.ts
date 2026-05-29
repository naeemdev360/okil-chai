import type {
  CaseAssignmentStatus,
  CaseCategory,
  CaseDetail,
  CaseDocumentResponse,
  CaseHearingType,
  CasesSortField,
  CaseStage,
  CaseStatus,
  CaseSummary,
} from '@repo/shared';

export type Case = CaseSummary;
export type CaseDetailView = CaseDetail;
export type CaseDocument = CaseDocumentResponse;

export interface ListCasesParams {
  readonly status?: CaseStatus;
  readonly stage?: CaseStage;
  readonly category?: CaseCategory;
  readonly search?: string;
  readonly sortBy?: CasesSortField;
  readonly sortDir?: 'asc' | 'desc';
  /** ISO 8601 date string — filters cases opened on or after this date */
  readonly openedFrom?: string;
  /** ISO 8601 date string — filters cases opened on or before this date (inclusive) */
  readonly openedTo?: string;
  readonly page?: number;
  readonly limit?: number;
}

export interface CreateCaseDto {
  readonly title: string;
  readonly description?: string;
  readonly caseCategory: CaseCategory;
  readonly assignedLawyerId?: string;
  readonly appointmentId?: string;
  /** Required when a lawyer opens the case for an existing client. */
  readonly clientUserId?: string;
}

export interface UpdateCaseDto {
  readonly title?: string;
  readonly description?: string;
  readonly referenceNumber?: string | null;
  readonly estimatedCompletionAt?: string | null;
}

export interface AssignLawyerDto {
  readonly lawyerId: string;
}

export interface ReleaseAssignmentDto {
  readonly reason?: string;
}

export interface StageTransitionDto {
  readonly toStage: CaseStage;
  readonly note?: string;
}

export interface CreateHearingDto {
  readonly scheduledAt: string;
  readonly venue?: string;
  readonly hearingType: CaseHearingType;
  readonly notes?: string;
}

export interface UpdateHearingDto {
  readonly scheduledAt?: string;
  readonly venue?: string;
  readonly hearingType?: CaseHearingType;
  readonly notes?: string | null;
  readonly outcome?: string | null;
}

export interface LinkAppointmentDto {
  readonly appointmentId: string;
}

// Re-export shared enums via the api-client for callers that don't want to import @repo/shared directly
export type {
  CaseAssignmentStatus,
  CaseCategory,
  CaseHearingType,
  CasesSortField,
  CaseStage,
  CaseStatus,
};
