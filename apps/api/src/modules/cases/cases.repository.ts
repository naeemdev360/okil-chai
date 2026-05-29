import { Inject, Injectable } from '@nestjs/common';
import {
  CaseAssignmentStatus,
  CaseCategory,
  CasesSortField,
  CaseStage,
  CaseStatus,
} from '@repo/shared';
import { and, asc, count, desc, eq, gt, gte, ilike, lt, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import {
  appointments,
  caseAppointmentLinks,
  caseDocuments,
  caseHearings,
  caseLawyerAssignments,
  caseStageEvents,
  cases,
  lawyerProfiles,
  users,
} from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import type {
  AssignmentHistoryRow,
  CaseRow,
  CreateHearingInput,
  DocumentRow,
  HearingRow,
  ICasesRepository,
  InsertCaseData,
  LinkedAppointmentRow,
  ListCasesQuery,
  StageEventRow,
  UpdateHearingInput,
} from './interfaces/cases.interfaces';

const CASE_SELECT = {
  id: cases.id,
  clientId: cases.clientId,
  assignedLawyerId: cases.assignedLawyerId,
  title: cases.title,
  description: cases.description,
  caseCategory: cases.caseCategory,
  referenceNumber: cases.referenceNumber,
  currentStage: cases.currentStage,
  status: cases.status,
  assignmentStatus: cases.assignmentStatus,
  estimatedCompletionAt: cases.estimatedCompletionAt,
  openedAt: cases.openedAt,
  closedAt: cases.closedAt,
  createdAt: cases.createdAt,
  updatedAt: cases.updatedAt,
  clientFirstName: users.firstName,
  clientLastName: users.lastName,
  clientAvatarUrl: users.avatarUrl,
  lawyerUserId: lawyerProfiles.userId,
  lawyerFirstName: lawyerProfiles.firstName,
  lawyerLastName: lawyerProfiles.lastName,
  lawyerPhotoUrl: lawyerProfiles.photoUrl,
  // Earliest future hearing — surfaced on list/detail views
  nextHearingAt: sql<Date | null>`(
    SELECT MIN(${caseHearings.scheduledAt})
    FROM ${caseHearings}
    WHERE ${caseHearings.caseId} = ${cases.id}
      AND ${caseHearings.scheduledAt} > NOW()
  )`,
};

@Injectable()
export class CasesRepository extends BaseRepository implements ICasesRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  // ── Cases ──────────────────────────────────────────────────────────────────

  async insert(data: InsertCaseData): Promise<CaseRow> {
    const [inserted] = await this.db
      .insert(cases)
      .values({
        clientId: data.clientId,
        assignedLawyerId: data.assignedLawyerId,
        title: data.title,
        description: data.description,
        caseCategory: data.caseCategory,
        currentStage: data.currentStage,
        assignmentStatus: data.assignmentStatus,
      })
      .returning({ id: cases.id });

    const row = await this.findById(inserted!.id);
    return row!;
  }

  async findById(caseId: string): Promise<CaseRow | null> {
    const [row] = await this.db
      .select(CASE_SELECT)
      .from(cases)
      .innerJoin(users, eq(cases.clientId, users.id))
      .leftJoin(lawyerProfiles, eq(cases.assignedLawyerId, lawyerProfiles.id))
      .where(eq(cases.id, caseId))
      .limit(1);

    return (row as CaseRow | undefined) ?? null;
  }

  async findByParticipant(
    userId: string,
    lawyerProfileId: string | null,
    query: ListCasesQuery,
  ): Promise<{ items: CaseRow[]; total: number }> {
    const {
      status, stage, category,
      search, sortBy, sortDir,
      openedFrom, openedTo,
      page = 1, limit = 20,
    } = query;
    const offset = (page - 1) * limit;

    // A user can see a case if they are the client OR they have ever held the assignment
    // (covers both currently-assigned and historically-assigned lawyers).
    const participantCondition = lawyerProfileId
      ? sql`(${cases.clientId} = ${userId} OR ${cases.assignedLawyerId} = ${lawyerProfileId} OR EXISTS (
          SELECT 1 FROM ${caseLawyerAssignments}
          WHERE ${caseLawyerAssignments.caseId} = ${cases.id}
            AND ${caseLawyerAssignments.lawyerId} = ${lawyerProfileId}
        ))`
      : eq(cases.clientId, userId);

    const conditions = [participantCondition];
    if (status) conditions.push(eq(cases.status, status as CaseStatus));
    if (stage) conditions.push(eq(cases.currentStage, stage as CaseStage));
    if (category) conditions.push(eq(cases.caseCategory, category as CaseCategory));
    if (openedFrom) conditions.push(gte(cases.openedAt, openedFrom));
    if (openedTo) {
      // Advance by one day so the selected end date is inclusive.
      const nextDay = new Date(openedTo);
      nextDay.setDate(nextDay.getDate() + 1);
      conditions.push(lt(cases.openedAt, nextDay));
    }
    if (search) {
      const pattern = `%${search}%`;
      // Match the case title or the counterparty's name: a lawyer searches by the
      // client's name (users), while a client searches by the assigned lawyer's name.
      const counterpartyName = lawyerProfileId
        ? or(ilike(users.firstName, pattern), ilike(users.lastName, pattern))
        : or(ilike(lawyerProfiles.firstName, pattern), ilike(lawyerProfiles.lastName, pattern));
      const searchCond = or(ilike(cases.title, pattern), counterpartyName);
      if (searchCond) conditions.push(searchCond);
    }

    const where = and(...conditions);

    // Build ORDER BY clause. nextHearingAt is a correlated subquery so it must
    // be expressed as raw SQL; scalar columns use the typed asc/desc helpers.
    const dirFn = sortDir === 'asc' ? asc : desc;
    const orderClause = sortBy === CasesSortField.NEXT_HEARING_AT
      ? sql`(
          SELECT MIN(${caseHearings.scheduledAt})
          FROM ${caseHearings}
          WHERE ${caseHearings.caseId} = ${cases.id}
            AND ${caseHearings.scheduledAt} > NOW()
        ) ${sortDir === 'asc' ? sql`ASC` : sql`DESC`} NULLS LAST`
      : sortBy === CasesSortField.OPENED_AT
        ? dirFn(cases.openedAt)
        : dirFn(cases.updatedAt);

    const [countRow] = await this.db
      .select({ total: count() })
      .from(cases)
      .innerJoin(users, eq(cases.clientId, users.id))
      .leftJoin(lawyerProfiles, eq(cases.assignedLawyerId, lawyerProfiles.id))
      .where(where);

    const rows = await this.db
      .select(CASE_SELECT)
      .from(cases)
      .innerJoin(users, eq(cases.clientId, users.id))
      .leftJoin(lawyerProfiles, eq(cases.assignedLawyerId, lawyerProfiles.id))
      .where(where)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    return {
      items: rows as CaseRow[],
      total: countRow?.total ?? 0,
    };
  }

  async update(
    caseId: string,
    patch: Partial<{
      title: string;
      description: string | null;
      referenceNumber: string | null;
      estimatedCompletionAt: Date | null;
      assignedLawyerId: string | null;
      assignmentStatus: CaseAssignmentStatus;
      currentStage: CaseStage;
      status: CaseStatus;
      closedAt: Date | null;
    }>,
  ): Promise<void> {
    await this.db
      .update(cases)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(cases.id, caseId));
  }

  // ── Stage events ───────────────────────────────────────────────────────────

  async insertStageEvent(data: {
    caseId: string;
    fromStage: CaseStage | null;
    toStage: CaseStage;
    actorUserId: string;
    note: string | null;
  }): Promise<void> {
    await this.db.insert(caseStageEvents).values({
      caseId: data.caseId,
      fromStage: data.fromStage,
      toStage: data.toStage,
      actorUserId: data.actorUserId,
      note: data.note,
    });
  }

  async findStageHistory(caseId: string): Promise<StageEventRow[]> {
    const rows = await this.db
      .select({
        id: caseStageEvents.id,
        fromStage: caseStageEvents.fromStage,
        toStage: caseStageEvents.toStage,
        note: caseStageEvents.note,
        occurredAt: caseStageEvents.occurredAt,
        actorUserId: caseStageEvents.actorUserId,
        actorFirstName: users.firstName,
        actorLastName: users.lastName,
        actorAvatarUrl: users.avatarUrl,
      })
      .from(caseStageEvents)
      .innerJoin(users, eq(caseStageEvents.actorUserId, users.id))
      .where(eq(caseStageEvents.caseId, caseId))
      .orderBy(asc(caseStageEvents.occurredAt));

    return rows as StageEventRow[];
  }

  // ── Hearings ───────────────────────────────────────────────────────────────

  async insertHearing(data: { caseId: string } & CreateHearingInput): Promise<HearingRow> {
    const [inserted] = await this.db
      .insert(caseHearings)
      .values({
        caseId: data.caseId,
        scheduledAt: data.scheduledAt,
        venue: data.venue,
        hearingType: data.hearingType,
        notes: data.notes,
      })
      .returning({
        id: caseHearings.id,
        scheduledAt: caseHearings.scheduledAt,
        venue: caseHearings.venue,
        hearingType: caseHearings.hearingType,
        notes: caseHearings.notes,
        outcome: caseHearings.outcome,
        createdAt: caseHearings.createdAt,
      });

    return inserted as HearingRow;
  }

  async findHearing(hearingId: string): Promise<{ caseId: string } | null> {
    const [row] = await this.db
      .select({ caseId: caseHearings.caseId })
      .from(caseHearings)
      .where(eq(caseHearings.id, hearingId))
      .limit(1);

    return row ?? null;
  }

  async updateHearing(hearingId: string, patch: UpdateHearingInput): Promise<HearingRow | null> {
    const [updated] = await this.db
      .update(caseHearings)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(caseHearings.id, hearingId))
      .returning({
        id: caseHearings.id,
        scheduledAt: caseHearings.scheduledAt,
        venue: caseHearings.venue,
        hearingType: caseHearings.hearingType,
        notes: caseHearings.notes,
        outcome: caseHearings.outcome,
        createdAt: caseHearings.createdAt,
      });

    return (updated as HearingRow | undefined) ?? null;
  }

  async deleteHearing(hearingId: string): Promise<void> {
    await this.db.delete(caseHearings).where(eq(caseHearings.id, hearingId));
  }

  async findHearings(caseId: string): Promise<HearingRow[]> {
    const rows = await this.db
      .select({
        id: caseHearings.id,
        scheduledAt: caseHearings.scheduledAt,
        venue: caseHearings.venue,
        hearingType: caseHearings.hearingType,
        notes: caseHearings.notes,
        outcome: caseHearings.outcome,
        createdAt: caseHearings.createdAt,
      })
      .from(caseHearings)
      .where(eq(caseHearings.caseId, caseId))
      .orderBy(asc(caseHearings.scheduledAt));

    return rows as HearingRow[];
  }

  async findNextHearingAt(caseId: string): Promise<Date | null> {
    const [row] = await this.db
      .select({ scheduledAt: caseHearings.scheduledAt })
      .from(caseHearings)
      .where(and(eq(caseHearings.caseId, caseId), gt(caseHearings.scheduledAt, new Date())))
      .orderBy(asc(caseHearings.scheduledAt))
      .limit(1);

    return row?.scheduledAt ?? null;
  }

  // ── Documents ──────────────────────────────────────────────────────────────

  async insertDocument(data: {
    caseId: string;
    uploaderUserId: string;
    name: string;
    storageKey: string;
    mimeType: string;
    sizeBytes: number;
  }): Promise<DocumentRow> {
    const [inserted] = await this.db
      .insert(caseDocuments)
      .values({
        caseId: data.caseId,
        uploaderUserId: data.uploaderUserId,
        name: data.name,
        storageKey: data.storageKey,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
      })
      .returning({ id: caseDocuments.id });

    const docs = await this.findDocuments(data.caseId);
    return docs.find((d) => d.id === inserted!.id)!;
  }

  async findDocument(documentId: string): Promise<{
    caseId: string;
    uploaderUserId: string;
    storageKey: string;
  } | null> {
    const [row] = await this.db
      .select({
        caseId: caseDocuments.caseId,
        uploaderUserId: caseDocuments.uploaderUserId,
        storageKey: caseDocuments.storageKey,
      })
      .from(caseDocuments)
      .where(eq(caseDocuments.id, documentId))
      .limit(1);

    return row ?? null;
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.db.delete(caseDocuments).where(eq(caseDocuments.id, documentId));
  }

  async findDocuments(caseId: string): Promise<DocumentRow[]> {
    const rows = await this.db
      .select({
        id: caseDocuments.id,
        name: caseDocuments.name,
        storageKey: caseDocuments.storageKey,
        mimeType: caseDocuments.mimeType,
        sizeBytes: caseDocuments.sizeBytes,
        createdAt: caseDocuments.createdAt,
        uploaderUserId: caseDocuments.uploaderUserId,
        uploaderFirstName: users.firstName,
        uploaderLastName: users.lastName,
        uploaderAvatarUrl: users.avatarUrl,
      })
      .from(caseDocuments)
      .innerJoin(users, eq(caseDocuments.uploaderUserId, users.id))
      .where(eq(caseDocuments.caseId, caseId))
      .orderBy(desc(caseDocuments.createdAt));

    return rows as DocumentRow[];
  }

  // ── Appointment links ──────────────────────────────────────────────────────

  async linkAppointment(caseId: string, appointmentId: string): Promise<void> {
    await this.db
      .insert(caseAppointmentLinks)
      .values({ caseId, appointmentId })
      .onConflictDoNothing();
  }

  async unlinkAppointment(caseId: string, appointmentId: string): Promise<void> {
    await this.db
      .delete(caseAppointmentLinks)
      .where(
        and(
          eq(caseAppointmentLinks.caseId, caseId),
          eq(caseAppointmentLinks.appointmentId, appointmentId),
        ),
      );
  }

  async findLinkedAppointments(caseId: string): Promise<LinkedAppointmentRow[]> {
    const rows = await this.db
      .select({
        id: appointments.id,
        startAt: appointments.startAt,
        endAt: appointments.endAt,
        status: appointments.status,
        linkedAt: caseAppointmentLinks.linkedAt,
      })
      .from(caseAppointmentLinks)
      .innerJoin(appointments, eq(caseAppointmentLinks.appointmentId, appointments.id))
      .where(eq(caseAppointmentLinks.caseId, caseId))
      .orderBy(desc(appointments.startAt));

    return rows as LinkedAppointmentRow[];
  }

  async isAppointmentParticipant(
    appointmentId: string,
    userId: string,
    lawyerProfileId: string | null,
  ): Promise<boolean> {
    const condition = lawyerProfileId
      ? sql`(${appointments.clientId} = ${userId} OR ${appointments.lawyerId} = ${lawyerProfileId})`
      : eq(appointments.clientId, userId);

    const [row] = await this.db
      .select({ id: appointments.id })
      .from(appointments)
      .where(and(eq(appointments.id, appointmentId), condition))
      .limit(1);

    return !!row;
  }

  // ── Assignments ────────────────────────────────────────────────────────────

  async findLawyerUserIdByProfileId(lawyerProfileId: string): Promise<string | null> {
    const [row] = await this.db
      .select({ userId: lawyerProfiles.userId })
      .from(lawyerProfiles)
      .where(eq(lawyerProfiles.id, lawyerProfileId))
      .limit(1);

    return row?.userId ?? null;
  }

  async insertAssignment(data: {
    caseId: string;
    lawyerId: string;
    invitedByUserId: string;
  }): Promise<{ id: string }> {
    const [inserted] = await this.db
      .insert(caseLawyerAssignments)
      .values({
        caseId: data.caseId,
        lawyerId: data.lawyerId,
        invitedByUserId: data.invitedByUserId,
      })
      .returning({ id: caseLawyerAssignments.id });

    return { id: inserted!.id };
  }

  async findPendingAssignmentForLawyer(
    caseId: string,
    lawyerUserId: string,
  ): Promise<{ id: string; lawyerId: string } | null> {
    const [row] = await this.db
      .select({
        id: caseLawyerAssignments.id,
        lawyerId: caseLawyerAssignments.lawyerId,
      })
      .from(caseLawyerAssignments)
      .innerJoin(lawyerProfiles, eq(caseLawyerAssignments.lawyerId, lawyerProfiles.id))
      .where(
        and(
          eq(caseLawyerAssignments.caseId, caseId),
          eq(caseLawyerAssignments.status, CaseAssignmentStatus.PENDING),
          eq(lawyerProfiles.userId, lawyerUserId),
        ),
      )
      .orderBy(desc(caseLawyerAssignments.invitedAt))
      .limit(1);

    return row ?? null;
  }

  async updateAssignmentStatus(
    assignmentId: string,
    status: CaseAssignmentStatus,
    extras: { respondedAt?: Date; releasedAt?: Date; releaseReason?: string },
  ): Promise<void> {
    await this.db
      .update(caseLawyerAssignments)
      .set({
        status,
        respondedAt: extras.respondedAt,
        releasedAt: extras.releasedAt,
        releaseReason: extras.releaseReason,
        updatedAt: new Date(),
      })
      .where(eq(caseLawyerAssignments.id, assignmentId));
  }

  async findActiveAcceptedAssignment(
    caseId: string,
  ): Promise<{ id: string; lawyerId: string } | null> {
    const [row] = await this.db
      .select({
        id: caseLawyerAssignments.id,
        lawyerId: caseLawyerAssignments.lawyerId,
      })
      .from(caseLawyerAssignments)
      .where(
        and(
          eq(caseLawyerAssignments.caseId, caseId),
          eq(caseLawyerAssignments.status, CaseAssignmentStatus.ACCEPTED),
        ),
      )
      .orderBy(desc(caseLawyerAssignments.respondedAt))
      .limit(1);

    return row ?? null;
  }

  async findAssignmentHistory(caseId: string): Promise<AssignmentHistoryRow[]> {
    const invitedBy = alias(users, 'invited_by_user');

    const rows = await this.db
      .select({
        id: caseLawyerAssignments.id,
        status: caseLawyerAssignments.status,
        invitedAt: caseLawyerAssignments.invitedAt,
        respondedAt: caseLawyerAssignments.respondedAt,
        releasedAt: caseLawyerAssignments.releasedAt,
        releaseReason: caseLawyerAssignments.releaseReason,
        lawyerId: lawyerProfiles.id,
        lawyerUserId: lawyerProfiles.userId,
        lawyerFirstName: lawyerProfiles.firstName,
        lawyerLastName: lawyerProfiles.lastName,
        lawyerPhotoUrl: lawyerProfiles.photoUrl,
        invitedByUserId: invitedBy.id,
        invitedByFirstName: invitedBy.firstName,
        invitedByLastName: invitedBy.lastName,
        invitedByAvatarUrl: invitedBy.avatarUrl,
      })
      .from(caseLawyerAssignments)
      .innerJoin(lawyerProfiles, eq(caseLawyerAssignments.lawyerId, lawyerProfiles.id))
      .innerJoin(invitedBy, eq(caseLawyerAssignments.invitedByUserId, invitedBy.id))
      .where(eq(caseLawyerAssignments.caseId, caseId))
      .orderBy(asc(caseLawyerAssignments.invitedAt));

    return rows as AssignmentHistoryRow[];
  }
}
