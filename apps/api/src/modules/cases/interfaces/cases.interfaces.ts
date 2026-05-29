import type {
  CaseDetail,
  CaseDocumentResponse,
  CaseSummary,
  PaginatedCasesResponse,
} from '@repo/shared';
import {
  CaseAssignmentStatus,
  CaseCategory,
  CaseHearingType,
  CasesSortField,
  CaseStage,
  CaseStatus,
  Role,
} from '@repo/shared';

export const CASES_REPOSITORY = Symbol('CASES_REPOSITORY');
export const CASES_SERVICE = Symbol('CASES_SERVICE');

// ── Row shapes ────────────────────────────────────────────────────────────────

export interface CaseRow {
  readonly id: string;
  readonly clientId: string;
  readonly assignedLawyerId: string | null;
  readonly title: string;
  readonly description: string | null;
  readonly caseCategory: CaseCategory;
  readonly referenceNumber: string | null;
  readonly currentStage: CaseStage;
  readonly status: CaseStatus;
  readonly assignmentStatus: CaseAssignmentStatus;
  readonly estimatedCompletionAt: Date | null;
  readonly openedAt: Date;
  readonly closedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly clientFirstName: string;
  readonly clientLastName: string;
  readonly clientAvatarUrl: string | null;
  readonly lawyerUserId: string | null;
  readonly lawyerFirstName: string | null;
  readonly lawyerLastName: string | null;
  readonly lawyerPhotoUrl: string | null;
  readonly nextHearingAt: Date | null;
}

export interface StageEventRow {
  readonly id: string;
  readonly fromStage: CaseStage | null;
  readonly toStage: CaseStage;
  readonly note: string | null;
  readonly occurredAt: Date;
  readonly actorUserId: string;
  readonly actorFirstName: string;
  readonly actorLastName: string;
  readonly actorAvatarUrl: string | null;
}

export interface HearingRow {
  readonly id: string;
  readonly scheduledAt: Date;
  readonly venue: string | null;
  readonly hearingType: CaseHearingType;
  readonly notes: string | null;
  readonly outcome: string | null;
  readonly createdAt: Date;
}

export interface DocumentRow {
  readonly id: string;
  readonly name: string;
  readonly storageKey: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly createdAt: Date;
  readonly uploaderUserId: string;
  readonly uploaderFirstName: string;
  readonly uploaderLastName: string;
  readonly uploaderAvatarUrl: string | null;
}

export interface LinkedAppointmentRow {
  readonly id: string;
  readonly startAt: Date;
  readonly endAt: Date;
  readonly status: string;
  readonly linkedAt: Date;
}

export interface AssignmentHistoryRow {
  readonly id: string;
  readonly status: CaseAssignmentStatus;
  readonly invitedAt: Date;
  readonly respondedAt: Date | null;
  readonly releasedAt: Date | null;
  readonly releaseReason: string | null;
  readonly lawyerId: string;
  readonly lawyerUserId: string;
  readonly lawyerFirstName: string;
  readonly lawyerLastName: string;
  readonly lawyerPhotoUrl: string | null;
  readonly invitedByUserId: string;
  readonly invitedByFirstName: string;
  readonly invitedByLastName: string;
  readonly invitedByAvatarUrl: string | null;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateCaseInput {
  readonly title: string;
  readonly description: string | null;
  readonly caseCategory: CaseCategory;
  readonly assignedLawyerId: string | null;
  readonly appointmentId: string | null;
  // Set when the creator is a lawyer; ignored for client-initiated creation
  readonly clientUserId: string | null;
}

export interface UpdateCaseInput {
  readonly title?: string;
  readonly description?: string;
  readonly referenceNumber?: string | null;
  readonly estimatedCompletionAt?: Date | null;
}

export interface ListCasesQuery {
  readonly status?: CaseStatus;
  readonly stage?: CaseStage;
  readonly category?: CaseCategory;
  readonly search?: string;
  readonly sortBy?: CasesSortField;
  readonly sortDir?: 'asc' | 'desc';
  readonly openedFrom?: Date;
  readonly openedTo?: Date;
  readonly page?: number;
  readonly limit?: number;
}

export interface StageTransitionInput {
  readonly toStage: CaseStage;
  readonly note: string | null;
}

export interface CreateHearingInput {
  readonly scheduledAt: Date;
  readonly venue: string | null;
  readonly hearingType: CaseHearingType;
  readonly notes: string | null;
}

export interface UpdateHearingInput {
  readonly scheduledAt?: Date;
  readonly venue?: string | null;
  readonly hearingType?: CaseHearingType;
  readonly notes?: string | null;
  readonly outcome?: string | null;
}

export interface InsertCaseData {
  readonly clientId: string;
  readonly assignedLawyerId: string | null;
  readonly title: string;
  readonly description: string | null;
  readonly caseCategory: CaseCategory;
  readonly currentStage: CaseStage;
  readonly assignmentStatus: CaseAssignmentStatus;
}

// ── Repository contract ───────────────────────────────────────────────────────

export interface ICasesRepository {
  insert(data: InsertCaseData): Promise<CaseRow>;
  findById(caseId: string): Promise<CaseRow | null>;
  findByParticipant(
    userId: string,
    lawyerProfileId: string | null,
    query: ListCasesQuery,
  ): Promise<{ items: CaseRow[]; total: number }>;
  update(caseId: string, patch: Partial<{
    title: string;
    description: string | null;
    referenceNumber: string | null;
    estimatedCompletionAt: Date | null;
    assignedLawyerId: string | null;
    assignmentStatus: CaseAssignmentStatus;
    currentStage: CaseStage;
    status: CaseStatus;
    closedAt: Date | null;
  }>): Promise<void>;

  insertStageEvent(data: {
    caseId: string;
    fromStage: CaseStage | null;
    toStage: CaseStage;
    actorUserId: string;
    note: string | null;
  }): Promise<void>;
  findStageHistory(caseId: string): Promise<StageEventRow[]>;

  insertHearing(data: { caseId: string } & CreateHearingInput): Promise<HearingRow>;
  findHearing(hearingId: string): Promise<{ caseId: string } | null>;
  updateHearing(hearingId: string, patch: UpdateHearingInput): Promise<HearingRow | null>;
  deleteHearing(hearingId: string): Promise<void>;
  findHearings(caseId: string): Promise<HearingRow[]>;
  findNextHearingAt(caseId: string): Promise<Date | null>;

  insertDocument(data: {
    caseId: string;
    uploaderUserId: string;
    name: string;
    storageKey: string;
    mimeType: string;
    sizeBytes: number;
  }): Promise<DocumentRow>;
  findDocument(documentId: string): Promise<{ caseId: string; uploaderUserId: string; storageKey: string } | null>;
  deleteDocument(documentId: string): Promise<void>;
  findDocuments(caseId: string): Promise<DocumentRow[]>;

  linkAppointment(caseId: string, appointmentId: string): Promise<void>;
  unlinkAppointment(caseId: string, appointmentId: string): Promise<void>;
  findLinkedAppointments(caseId: string): Promise<LinkedAppointmentRow[]>;
  isAppointmentParticipant(appointmentId: string, userId: string, lawyerProfileId: string | null): Promise<boolean>;

  findLawyerUserIdByProfileId(lawyerProfileId: string): Promise<string | null>;
  insertAssignment(data: {
    caseId: string;
    lawyerId: string;
    invitedByUserId: string;
  }): Promise<{ id: string }>;
  findPendingAssignmentForLawyer(caseId: string, lawyerUserId: string): Promise<{ id: string; lawyerId: string } | null>;
  updateAssignmentStatus(
    assignmentId: string,
    status: CaseAssignmentStatus,
    extras: { respondedAt?: Date; releasedAt?: Date; releaseReason?: string },
  ): Promise<void>;
  findActiveAcceptedAssignment(caseId: string): Promise<{ id: string; lawyerId: string } | null>;
  findAssignmentHistory(caseId: string): Promise<AssignmentHistoryRow[]>;
}

// ── Service contract ──────────────────────────────────────────────────────────

export interface UploadDocumentInput {
  readonly file: Express.Multer.File;
}

export interface ICasesService {
  createCase(userId: string, roles: readonly Role[], input: CreateCaseInput): Promise<CaseDetail>;
  listCases(userId: string, roles: readonly Role[], query: ListCasesQuery): Promise<PaginatedCasesResponse>;
  getCase(userId: string, roles: readonly Role[], caseId: string): Promise<CaseDetail>;
  updateCase(userId: string, roles: readonly Role[], caseId: string, input: UpdateCaseInput): Promise<CaseSummary>;

  assignLawyer(userId: string, caseId: string, lawyerId: string): Promise<void>;
  acceptAssignment(userId: string, caseId: string): Promise<void>;
  declineAssignment(userId: string, caseId: string): Promise<void>;
  releaseAssignment(userId: string, caseId: string, reason: string | null): Promise<void>;

  transitionStage(userId: string, caseId: string, input: StageTransitionInput): Promise<void>;
  closeCase(userId: string, caseId: string): Promise<void>;

  createHearing(userId: string, caseId: string, input: CreateHearingInput): Promise<void>;
  updateHearing(userId: string, caseId: string, hearingId: string, input: UpdateHearingInput): Promise<void>;
  deleteHearing(userId: string, caseId: string, hearingId: string): Promise<void>;

  uploadDocument(userId: string, roles: readonly Role[], caseId: string, input: UploadDocumentInput): Promise<CaseDocumentResponse>;
  deleteDocument(userId: string, caseId: string, documentId: string): Promise<void>;

  linkAppointment(userId: string, roles: readonly Role[], caseId: string, appointmentId: string): Promise<void>;
  unlinkAppointment(userId: string, roles: readonly Role[], caseId: string, appointmentId: string): Promise<void>;
}
