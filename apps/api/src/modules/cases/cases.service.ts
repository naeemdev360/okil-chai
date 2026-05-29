import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CaseAssignmentHistoryItem,
  CaseDetail,
  CaseDocumentResponse,
  CaseHearingResponse,
  CaseLinkedAppointment,
  CaseStageEventResponse,
  CaseSummary,
  PaginatedCasesResponse,
} from '@repo/shared';
import {
  CaseAssignmentStatus,
  CaseStage,
  CaseStatus,
  NotificationType,
  Role,
} from '@repo/shared';
import { buildPaginationMeta } from '../../common/utils/pagination.util';
import {
  LAWYERS_SERVICE,
  type ILawyersService,
} from '../lawyers/interfaces/lawyers.interfaces';
import {
  NOTIFICATIONS_SERVICE,
  type INotificationsService,
} from '../notifications/interfaces/notifications.interfaces';
import {
  STORAGE_SERVICE,
  type IStorageService,
} from '../storage/interfaces/storage.interfaces';
import {
  USERS_SERVICE,
  type IUsersService,
} from '../users/interfaces/users.interfaces';
import {
  CASES_REPOSITORY,
  type AssignmentHistoryRow,
  type CaseRow,
  type CreateCaseInput,
  type CreateHearingInput,
  type DocumentRow,
  type HearingRow,
  type ICasesRepository,
  type ICasesService,
  type LinkedAppointmentRow,
  type ListCasesQuery,
  type StageEventRow,
  type StageTransitionInput,
  type UpdateCaseInput,
  type UpdateHearingInput,
  type UploadDocumentInput,
} from './interfaces/cases.interfaces';

const STAGES_REQUIRING_LAWYER: ReadonlyArray<CaseStage> = [
  CaseStage.DISCOVERY,
  CaseStage.PRE_FILING,
  CaseStage.FILED,
  CaseStage.HEARING_SCHEDULED,
  CaseStage.IN_TRIAL,
  CaseStage.JUDGMENT,
  CaseStage.APPEAL,
  CaseStage.SETTLEMENT,
];

const TERMINAL_STAGES: ReadonlyArray<CaseStage> = [CaseStage.CLOSED];

const CASE_DOCUMENT_FOLDER = 'case-documents';
const DOCUMENT_URL_TTL_SECONDS = 300;

@Injectable()
export class CasesService implements ICasesService {
  constructor(
    @Inject(CASES_REPOSITORY)
    private readonly casesRepository: ICasesRepository,
    @Inject(LAWYERS_SERVICE)
    private readonly lawyersService: ILawyersService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: INotificationsService,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    @Inject(USERS_SERVICE)
    private readonly usersService: IUsersService,
  ) {}

  // ── Public service methods ─────────────────────────────────────────────────

  async createCase(
    userId: string,
    roles: readonly Role[],
    input: CreateCaseInput,
  ): Promise<CaseDetail> {
    const isLawyer = roles.includes(Role.LAWYER);
    const isClient = roles.includes(Role.CLIENT);

    if (!isClient && !isLawyer) {
      throw new ForbiddenException('Only clients or lawyers can open a case');
    }

    if (isLawyer) {
      return this.createCaseAsLawyer(userId, roles, input);
    }

    // Client opening their own case.
    const row = await this.casesRepository.insert({
      clientId: userId,
      assignedLawyerId: null,
      title: input.title,
      description: input.description,
      caseCategory: input.caseCategory,
      currentStage: CaseStage.INTAKE,
      assignmentStatus: CaseAssignmentStatus.UNASSIGNED,
    });

    await this.casesRepository.insertStageEvent({
      caseId: row.id,
      fromStage: null,
      toStage: CaseStage.INTAKE,
      actorUserId: userId,
      note: null,
    });

    if (input.assignedLawyerId) {
      await this.assignLawyer(userId, row.id, input.assignedLawyerId);
    }

    if (input.appointmentId) {
      await this.linkAppointment(userId, roles, row.id, input.appointmentId);
    }

    return this.getCase(userId, roles, row.id);
  }

  // Lawyer opens a case on behalf of an existing client and is auto-assigned
  // as ACCEPTED — skipping the invite/accept round-trip (SRS § 3.4.7).
  private async createCaseAsLawyer(
    lawyerUserId: string,
    roles: readonly Role[],
    input: CreateCaseInput,
  ): Promise<CaseDetail> {
    if (!input.clientUserId) {
      throw new BadRequestException(
        'clientUserId is required when a lawyer opens a case (look up the client by email first)',
      );
    }

    const lawyerProfileId = await this.tryGetLawyerProfileId(lawyerUserId, roles);
    if (!lawyerProfileId) {
      throw new ForbiddenException('Your lawyer profile must be approved before opening cases');
    }

    // Validates the target exists and has the CLIENT role.
    await this.usersService.getClientById(input.clientUserId);

    const row = await this.casesRepository.insert({
      clientId: input.clientUserId,
      assignedLawyerId: lawyerProfileId,
      title: input.title,
      description: input.description,
      caseCategory: input.caseCategory,
      currentStage: CaseStage.LAWYER_ASSIGNED,
      assignmentStatus: CaseAssignmentStatus.ACCEPTED,
    });

    // Audit trail: INTAKE → LAWYER_ASSIGNED, both recorded.
    await this.casesRepository.insertStageEvent({
      caseId: row.id,
      fromStage: null,
      toStage: CaseStage.INTAKE,
      actorUserId: lawyerUserId,
      note: null,
    });
    await this.casesRepository.insertStageEvent({
      caseId: row.id,
      fromStage: CaseStage.INTAKE,
      toStage: CaseStage.LAWYER_ASSIGNED,
      actorUserId: lawyerUserId,
      note: null,
    });

    // Append an ACCEPTED assignment row so the handoff history is consistent.
    const assignment = await this.casesRepository.insertAssignment({
      caseId: row.id,
      lawyerId: lawyerProfileId,
      invitedByUserId: lawyerUserId,
    });
    await this.casesRepository.updateAssignmentStatus(
      assignment.id,
      CaseAssignmentStatus.ACCEPTED,
      { respondedAt: new Date() },
    );

    if (input.appointmentId) {
      await this.linkAppointment(lawyerUserId, roles, row.id, input.appointmentId);
    }

    await this.notifyUser(input.clientUserId, {
      type: NotificationType.CASE_ASSIGNMENT_ACCEPTED,
      title: 'Your lawyer opened a case for you',
      body: `${row.lawyerFirstName ?? 'Your lawyer'} ${row.lawyerLastName ?? ''} opened "${row.title}" on your behalf.`,
      payload: { caseId: row.id },
    });

    return this.getCase(lawyerUserId, roles, row.id);
  }

  async listCases(
    userId: string,
    roles: readonly Role[],
    query: ListCasesQuery,
  ): Promise<PaginatedCasesResponse> {
    const lawyerProfileId = await this.tryGetLawyerProfileId(userId, roles);
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { items, total } = await this.casesRepository.findByParticipant(
      userId,
      lawyerProfileId,
      query,
    );

    return {
      data: items.map((row) => this.toSummary(row)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getCase(
    userId: string,
    roles: readonly Role[],
    caseId: string,
  ): Promise<CaseDetail> {
    const row = await this.loadCaseAndAuthorize(userId, roles, caseId);

    const [stageHistory, hearings, documents, linkedAppointments, assignmentHistory] =
      await Promise.all([
        this.casesRepository.findStageHistory(caseId),
        this.casesRepository.findHearings(caseId),
        this.casesRepository.findDocuments(caseId),
        this.casesRepository.findLinkedAppointments(caseId),
        this.casesRepository.findAssignmentHistory(caseId),
      ]);

    const documentResponses = await Promise.all(
      documents.map((doc) => this.toDocumentResponse(doc)),
    );

    return {
      ...this.toSummary(row),
      description: row.description,
      referenceNumber: row.referenceNumber,
      closedAt: row.closedAt,
      stageHistory: stageHistory.map((e) => this.toStageEventResponse(e)),
      hearings: hearings.map((h) => this.toHearingResponse(h)),
      documents: documentResponses,
      linkedAppointments: linkedAppointments.map((a) => this.toLinkedAppointmentResponse(a)),
      assignmentHistory: assignmentHistory.map((a) => this.toAssignmentHistoryResponse(a)),
    };
  }

  async updateCase(
    userId: string,
    roles: readonly Role[],
    caseId: string,
    input: UpdateCaseInput,
  ): Promise<CaseSummary> {
    const row = await this.loadCaseAndAuthorize(userId, roles, caseId);
    this.assertWritable(row);

    // referenceNumber and estimatedCompletionAt are lawyer-only fields per § 3.4.3.
    if (
      (input.referenceNumber !== undefined || input.estimatedCompletionAt !== undefined) &&
      !(await this.isAssignedLawyer(userId, roles, row))
    ) {
      throw new ForbiddenException(
        'Only the assigned lawyer can update referenceNumber or estimatedCompletionAt',
      );
    }

    await this.casesRepository.update(caseId, {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.referenceNumber !== undefined && { referenceNumber: input.referenceNumber }),
      ...(input.estimatedCompletionAt !== undefined && {
        estimatedCompletionAt: input.estimatedCompletionAt,
      }),
    });

    const fresh = await this.casesRepository.findById(caseId);
    return this.toSummary(fresh!);
  }

  // ── Assignment flow ────────────────────────────────────────────────────────

  async assignLawyer(userId: string, caseId: string, lawyerId: string): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');
    if (row.clientId !== userId) {
      throw new ForbiddenException('Only the client can invite or change the assigned lawyer');
    }
    this.assertWritable(row);

    // Reassigning to the same currently-active lawyer is a no-op.
    if (
      row.assignedLawyerId === lawyerId &&
      row.assignmentStatus === CaseAssignmentStatus.ACCEPTED
    ) {
      throw new ConflictException('This lawyer is already assigned to the case');
    }

    // Validate the lawyer exists and is approved (throws NotFound otherwise).
    await this.lawyersService.getPublicProfile(lawyerId);
    const invitedUserId = await this.casesRepository.findLawyerUserIdByProfileId(lawyerId);
    if (!invitedUserId) throw new NotFoundException('Lawyer profile has no associated user');

    await this.casesRepository.insertAssignment({
      caseId,
      lawyerId,
      invitedByUserId: userId,
    });

    await this.casesRepository.update(caseId, {
      assignmentStatus: CaseAssignmentStatus.PENDING,
    });

    await this.notifyUser(invitedUserId, {
      type: NotificationType.CASE_ASSIGNMENT_REQUESTED,
      title: 'New case assignment request',
      body: `${row.clientFirstName} ${row.clientLastName} invited you to take on "${row.title}".`,
      payload: { caseId },
    });
  }

  async acceptAssignment(userId: string, caseId: string): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');
    this.assertWritable(row);

    const assignment = await this.casesRepository.findPendingAssignmentForLawyer(
      caseId,
      userId,
    );
    if (!assignment) {
      throw new NotFoundException('No pending assignment for this user on this case');
    }

    // Release any currently ACCEPTED lawyer (reassignment handoff).
    const previous = await this.casesRepository.findActiveAcceptedAssignment(caseId);
    if (previous && previous.id !== assignment.id) {
      await this.casesRepository.updateAssignmentStatus(
        previous.id,
        CaseAssignmentStatus.RELEASED,
        { releasedAt: new Date(), releaseReason: 'reassigned_by_client' },
      );
    }

    await this.casesRepository.updateAssignmentStatus(
      assignment.id,
      CaseAssignmentStatus.ACCEPTED,
      { respondedAt: new Date() },
    );

    const transitioned =
      row.currentStage === CaseStage.INTAKE
        ? CaseStage.LAWYER_ASSIGNED
        : row.currentStage;

    await this.casesRepository.update(caseId, {
      assignedLawyerId: assignment.lawyerId,
      assignmentStatus: CaseAssignmentStatus.ACCEPTED,
      currentStage: transitioned,
    });

    if (transitioned !== row.currentStage) {
      await this.casesRepository.insertStageEvent({
        caseId,
        fromStage: row.currentStage,
        toStage: transitioned,
        actorUserId: userId,
        note: null,
      });
    }

    await this.notifyUser(row.clientId, {
      type: NotificationType.CASE_ASSIGNMENT_ACCEPTED,
      title: 'Lawyer accepted your case',
      body: `Your case "${row.title}" has been accepted.`,
      payload: { caseId },
    });
  }

  async declineAssignment(userId: string, caseId: string): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');

    const assignment = await this.casesRepository.findPendingAssignmentForLawyer(
      caseId,
      userId,
    );
    if (!assignment) {
      throw new NotFoundException('No pending assignment for this user on this case');
    }

    await this.casesRepository.updateAssignmentStatus(
      assignment.id,
      CaseAssignmentStatus.DECLINED,
      { respondedAt: new Date(), releaseReason: 'declined' },
    );

    // Only flip the case-level status if no other ACCEPTED lawyer exists.
    const stillAccepted = await this.casesRepository.findActiveAcceptedAssignment(caseId);
    if (!stillAccepted) {
      await this.casesRepository.update(caseId, {
        assignmentStatus: CaseAssignmentStatus.UNASSIGNED,
      });
    }

    await this.notifyUser(row.clientId, {
      type: NotificationType.CASE_ASSIGNMENT_DECLINED,
      title: 'Lawyer declined your case',
      body: `Your case "${row.title}" was declined. Invite another lawyer.`,
      payload: { caseId },
    });
  }

  async releaseAssignment(
    userId: string,
    caseId: string,
    reason: string | null,
  ): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');

    const active = await this.casesRepository.findActiveAcceptedAssignment(caseId);
    if (!active || row.lawyerUserId !== userId) {
      throw new ForbiddenException('Only the currently assigned lawyer can release this case');
    }

    await this.casesRepository.updateAssignmentStatus(
      active.id,
      CaseAssignmentStatus.RELEASED,
      {
        releasedAt: new Date(),
        releaseReason: reason ?? 'released_by_lawyer',
      },
    );

    await this.casesRepository.update(caseId, {
      assignedLawyerId: null,
      assignmentStatus: CaseAssignmentStatus.UNASSIGNED,
    });

    await this.notifyUser(row.clientId, {
      type: NotificationType.CASE_ASSIGNMENT_RELEASED,
      title: 'Lawyer released your case',
      body: `Your lawyer has withdrawn from "${row.title}". You can invite another lawyer.`,
      payload: { caseId, reason: reason ?? null },
    });
  }

  // ── Stage transitions ──────────────────────────────────────────────────────

  async transitionStage(
    userId: string,
    caseId: string,
    input: StageTransitionInput,
  ): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');
    this.assertWritable(row);

    if (!row.lawyerUserId || row.lawyerUserId !== userId) {
      throw new ForbiddenException('Only the assigned lawyer can transition stages');
    }

    if (row.currentStage === input.toStage) {
      throw new BadRequestException('Case is already at this stage');
    }

    if (
      STAGES_REQUIRING_LAWYER.includes(input.toStage) &&
      row.assignmentStatus !== CaseAssignmentStatus.ACCEPTED
    ) {
      throw new BadRequestException(
        'A lawyer must be assigned and have accepted before this stage',
      );
    }

    if (TERMINAL_STAGES.includes(input.toStage)) {
      throw new BadRequestException('Use the close-case endpoint to close a case');
    }

    await this.casesRepository.update(caseId, { currentStage: input.toStage });
    await this.casesRepository.insertStageEvent({
      caseId,
      fromStage: row.currentStage,
      toStage: input.toStage,
      actorUserId: userId,
      note: input.note,
    });

    await this.notifyUser(row.clientId, {
      type: NotificationType.CASE_STAGE_CHANGED,
      title: 'Case stage updated',
      body: `"${row.title}" moved to ${input.toStage.replace(/_/g, ' ').toLowerCase()}.`,
      payload: { caseId, fromStage: row.currentStage, toStage: input.toStage },
    });
  }

  async closeCase(userId: string, caseId: string): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');
    if (!row.lawyerUserId || row.lawyerUserId !== userId) {
      throw new ForbiddenException('Only the assigned lawyer can close this case');
    }
    if (row.status === CaseStatus.CLOSED) {
      throw new BadRequestException('Case is already closed');
    }

    const closedAt = new Date();

    await this.casesRepository.update(caseId, {
      status: CaseStatus.CLOSED,
      currentStage: CaseStage.CLOSED,
      closedAt,
    });
    await this.casesRepository.insertStageEvent({
      caseId,
      fromStage: row.currentStage,
      toStage: CaseStage.CLOSED,
      actorUserId: userId,
      note: null,
    });

    await this.notifyUser(row.clientId, {
      type: NotificationType.CASE_CLOSED,
      title: 'Case closed',
      body: `Your case "${row.title}" has been closed.`,
      payload: { caseId },
    });
  }

  // ── Hearings ───────────────────────────────────────────────────────────────

  async createHearing(
    userId: string,
    caseId: string,
    input: CreateHearingInput,
  ): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');
    this.assertWritable(row);
    if (!row.lawyerUserId || row.lawyerUserId !== userId) {
      throw new ForbiddenException('Only the assigned lawyer can create hearings');
    }

    if (input.scheduledAt < new Date()) {
      throw new BadRequestException('Hearing date must be in the future');
    }

    await this.casesRepository.insertHearing({ caseId, ...input });

    // TODO(SRS § 3.4.4): schedule T-24h and T-1h reminder jobs via BullMQ. For now
    // emit a single in-app "scheduled" notification at create time; lifecycle reminders are deferred.
    await Promise.all([
      this.notifyUser(row.clientId, {
        type: NotificationType.CASE_HEARING_SCHEDULED,
        title: 'New hearing scheduled',
        body: input.venue
          ? `Hearing for "${row.title}" at ${input.venue} on ${input.scheduledAt.toUTCString()}.`
          : `Hearing for "${row.title}" on ${input.scheduledAt.toUTCString()}.`,
        payload: { caseId, scheduledAt: input.scheduledAt.toISOString() },
      }),
    ]);
  }

  async updateHearing(
    userId: string,
    caseId: string,
    hearingId: string,
    input: UpdateHearingInput,
  ): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');
    this.assertWritable(row);
    if (!row.lawyerUserId || row.lawyerUserId !== userId) {
      throw new ForbiddenException('Only the assigned lawyer can edit hearings');
    }

    const existing = await this.casesRepository.findHearing(hearingId);
    if (!existing || existing.caseId !== caseId) {
      throw new NotFoundException('Hearing not found on this case');
    }

    if (input.scheduledAt && input.scheduledAt < new Date()) {
      throw new BadRequestException('Hearing date must be in the future');
    }

    const updated = await this.casesRepository.updateHearing(hearingId, input);
    if (!updated) throw new NotFoundException('Hearing not found');

    await this.notifyUser(row.clientId, {
      type: NotificationType.CASE_HEARING_UPDATED,
      title: 'Hearing updated',
      body: `A hearing on "${row.title}" was updated.`,
      payload: { caseId, hearingId },
    });
  }

  async deleteHearing(userId: string, caseId: string, hearingId: string): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');
    this.assertWritable(row);
    if (!row.lawyerUserId || row.lawyerUserId !== userId) {
      throw new ForbiddenException('Only the assigned lawyer can cancel hearings');
    }

    const existing = await this.casesRepository.findHearing(hearingId);
    if (!existing || existing.caseId !== caseId) {
      throw new NotFoundException('Hearing not found on this case');
    }

    await this.casesRepository.deleteHearing(hearingId);

    await this.notifyUser(row.clientId, {
      type: NotificationType.CASE_HEARING_UPDATED,
      title: 'Hearing cancelled',
      body: `A hearing on "${row.title}" was cancelled.`,
      payload: { caseId, hearingId },
    });
  }

  // ── Documents ──────────────────────────────────────────────────────────────

  async uploadDocument(
    userId: string,
    roles: readonly Role[],
    caseId: string,
    input: UploadDocumentInput,
  ): Promise<CaseDocumentResponse> {
    const row = await this.loadCaseAndAuthorize(userId, roles, caseId);
    this.assertWritable(row);

    const uploaded = await this.storageService.upload({
      file: input.file,
      folder: `${CASE_DOCUMENT_FOLDER}/${caseId}`,
    });

    const doc = await this.casesRepository.insertDocument({
      caseId,
      uploaderUserId: userId,
      name: input.file.originalname,
      storageKey: uploaded.key,
      mimeType: uploaded.mimeType,
      sizeBytes: uploaded.size,
    });

    // Notify the other party.
    const otherUserId = row.clientId === userId ? row.lawyerUserId : row.clientId;
    if (otherUserId) {
      await this.notifyUser(otherUserId, {
        type: NotificationType.CASE_DOCUMENT_UPLOADED,
        title: 'New case document',
        body: `A new document was uploaded to "${row.title}".`,
        payload: { caseId, documentId: doc.id },
      });
    }

    return this.toDocumentResponse(doc);
  }

  async deleteDocument(userId: string, caseId: string, documentId: string): Promise<void> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');
    this.assertWritable(row);

    const doc = await this.casesRepository.findDocument(documentId);
    if (!doc || doc.caseId !== caseId) {
      throw new NotFoundException('Document not found on this case');
    }
    if (doc.uploaderUserId !== userId) {
      throw new ForbiddenException('Only the uploader can delete this document');
    }

    await this.casesRepository.deleteDocument(documentId);
    await this.storageService.delete(doc.storageKey);
  }

  // ── Appointment links ──────────────────────────────────────────────────────

  async linkAppointment(
    userId: string,
    roles: readonly Role[],
    caseId: string,
    appointmentId: string,
  ): Promise<void> {
    const row = await this.loadCaseAndAuthorize(userId, roles, caseId);
    this.assertWritable(row);

    const lawyerProfileId = await this.tryGetLawyerProfileId(userId, roles);
    const allowed = await this.casesRepository.isAppointmentParticipant(
      appointmentId,
      userId,
      lawyerProfileId,
    );
    if (!allowed) {
      throw new ForbiddenException('You can only link appointments you are a participant of');
    }

    await this.casesRepository.linkAppointment(caseId, appointmentId);
  }

  async unlinkAppointment(
    userId: string,
    roles: readonly Role[],
    caseId: string,
    appointmentId: string,
  ): Promise<void> {
    const row = await this.loadCaseAndAuthorize(userId, roles, caseId);
    this.assertWritable(row);

    const lawyerProfileId = await this.tryGetLawyerProfileId(userId, roles);
    const allowed = await this.casesRepository.isAppointmentParticipant(
      appointmentId,
      userId,
      lawyerProfileId,
    );
    if (!allowed) {
      throw new ForbiddenException('You can only unlink appointments you are a participant of');
    }

    await this.casesRepository.unlinkAppointment(caseId, appointmentId);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async loadCaseAndAuthorize(
    userId: string,
    roles: readonly Role[],
    caseId: string,
  ): Promise<CaseRow> {
    const row = await this.casesRepository.findById(caseId);
    if (!row) throw new NotFoundException('Case not found');

    if (roles.includes(Role.PLATFORM_ADMIN)) return row;

    const isClient = row.clientId === userId;
    const isCurrentLawyer = !!row.lawyerUserId && row.lawyerUserId === userId;
    if (isClient || isCurrentLawyer) return row;

    // Historical lawyer access: allow any lawyer who was ever in the assignment history to view.
    const lawyerProfileId = await this.tryGetLawyerProfileId(userId, roles);
    if (lawyerProfileId) {
      const history = await this.casesRepository.findAssignmentHistory(caseId);
      if (history.some((h) => h.lawyerId === lawyerProfileId)) return row;
    }

    throw new ForbiddenException('You do not have access to this case');
  }

  private async isAssignedLawyer(
    userId: string,
    roles: readonly Role[],
    row: CaseRow,
  ): Promise<boolean> {
    if (!roles.includes(Role.LAWYER)) return false;
    return row.lawyerUserId === userId;
  }

  private async tryGetLawyerProfileId(
    userId: string,
    roles: readonly Role[],
  ): Promise<string | null> {
    if (!roles.includes(Role.LAWYER)) return null;
    try {
      const profile = await this.lawyersService.getProfile(userId);
      return profile.id;
    } catch {
      return null;
    }
  }

  private assertWritable(row: CaseRow): void {
    if (row.status === CaseStatus.CLOSED || row.currentStage === CaseStage.CLOSED) {
      throw new BadRequestException('Cannot modify a closed case');
    }
  }

  private async notifyUser(
    userId: string,
    data: {
      type: NotificationType;
      title: string;
      body: string;
      payload?: Record<string, unknown>;
    },
  ): Promise<void> {
    await this.notificationsService.create({ userId, ...data });
  }

  // ── Mappers ────────────────────────────────────────────────────────────────

  private toSummary(row: CaseRow): CaseSummary {
    return {
      id: row.id,
      title: row.title,
      caseCategory: row.caseCategory,
      currentStage: row.currentStage,
      status: row.status,
      assignmentStatus: row.assignmentStatus,
      client: {
        id: row.clientId,
        firstName: row.clientFirstName,
        lastName: row.clientLastName,
        photoUrl: row.clientAvatarUrl,
      },
      assignedLawyer:
        row.assignedLawyerId && row.lawyerUserId && row.lawyerFirstName && row.lawyerLastName
          ? {
              id: row.assignedLawyerId,
              userId: row.lawyerUserId,
              firstName: row.lawyerFirstName,
              lastName: row.lawyerLastName,
              photoUrl: row.lawyerPhotoUrl,
            }
          : null,
      nextHearingAt: row.nextHearingAt,
      estimatedCompletionAt: row.estimatedCompletionAt,
      openedAt: row.openedAt,
      updatedAt: row.updatedAt,
    };
  }

  private toStageEventResponse(row: StageEventRow): CaseStageEventResponse {
    return {
      id: row.id,
      fromStage: row.fromStage,
      toStage: row.toStage,
      actor: {
        id: row.actorUserId,
        firstName: row.actorFirstName,
        lastName: row.actorLastName,
        photoUrl: row.actorAvatarUrl,
      },
      note: row.note,
      occurredAt: row.occurredAt,
    };
  }

  private toHearingResponse(row: HearingRow): CaseHearingResponse {
    return {
      id: row.id,
      scheduledAt: row.scheduledAt,
      venue: row.venue,
      hearingType: row.hearingType,
      notes: row.notes,
      outcome: row.outcome,
      createdAt: row.createdAt,
    };
  }

  private async toDocumentResponse(row: DocumentRow): Promise<CaseDocumentResponse> {
    const downloadUrl = await this.storageService.getSignedUrl(
      row.storageKey,
      DOCUMENT_URL_TTL_SECONDS,
    );
    return {
      id: row.id,
      name: row.name,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      uploader: {
        id: row.uploaderUserId,
        firstName: row.uploaderFirstName,
        lastName: row.uploaderLastName,
        photoUrl: row.uploaderAvatarUrl,
      },
      downloadUrl,
      uploadedAt: row.createdAt,
    };
  }

  private toLinkedAppointmentResponse(row: LinkedAppointmentRow): CaseLinkedAppointment {
    return {
      id: row.id,
      startAt: row.startAt,
      endAt: row.endAt,
      status: row.status,
      linkedAt: row.linkedAt,
    };
  }

  private toAssignmentHistoryResponse(row: AssignmentHistoryRow): CaseAssignmentHistoryItem {
    return {
      id: row.id,
      lawyer: {
        id: row.lawyerId,
        userId: row.lawyerUserId,
        firstName: row.lawyerFirstName,
        lastName: row.lawyerLastName,
        photoUrl: row.lawyerPhotoUrl,
      },
      invitedBy: {
        id: row.invitedByUserId,
        firstName: row.invitedByFirstName,
        lastName: row.invitedByLastName,
        photoUrl: row.invitedByAvatarUrl,
      },
      status: row.status,
      invitedAt: row.invitedAt,
      respondedAt: row.respondedAt,
      releasedAt: row.releasedAt,
      releaseReason: row.releaseReason,
    };
  }
}
