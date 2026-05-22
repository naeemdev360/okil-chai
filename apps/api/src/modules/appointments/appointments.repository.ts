import { Inject, Injectable } from '@nestjs/common';
import { AppointmentStatus, ConsultationType } from '@repo/shared';
import { and, count, desc, eq, gt, gte, inArray, lt, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { appointments, lawyerProfiles, users } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import type {
  AppointmentContactInfo,
  AppointmentRow,
  IAppointmentsRepository,
  InsertAppointmentData,
  ListAppointmentsQuery,
} from './interfaces/appointments.interfaces';

const CONFLICT_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING_PAYMENT,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.IN_PROGRESS,
];

const APPOINTMENT_SELECT = {
  id: appointments.id,
  clientId: appointments.clientId,
  lawyerId: appointments.lawyerId,
  consultationType: appointments.consultationType,
  caseCategory: appointments.caseCategory,
  startAt: appointments.startAt,
  endAt: appointments.endAt,
  status: appointments.status,
  clientNotes: appointments.clientNotes,
  externalPaymentId: appointments.externalPaymentId,
  createdAt: appointments.createdAt,
  updatedAt: appointments.updatedAt,
  clientFirstName: users.firstName,
  clientLastName: users.lastName,
  clientAvatarUrl: users.avatarUrl,
  lawyerUserId: lawyerProfiles.userId,
  lawyerFirstName: lawyerProfiles.firstName,
  lawyerLastName: lawyerProfiles.lastName,
  lawyerPhotoUrl: lawyerProfiles.photoUrl,
};

@Injectable()
export class AppointmentsRepository extends BaseRepository implements IAppointmentsRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async insert(data: InsertAppointmentData): Promise<AppointmentRow> {
    const [inserted] = await this.db
      .insert(appointments)
      .values({
        clientId: data.clientId,
        lawyerId: data.lawyerId,
        consultationType: data.consultationType as ConsultationType,
        caseCategory: data.caseCategory,
        startAt: data.startAt,
        endAt: data.endAt,
        clientNotes: data.clientNotes,
        externalPaymentId: data.externalPaymentId,
        status: data.status as AppointmentStatus,
      })
      .returning({ id: appointments.id });

    const row = await this.findById(inserted!.id);
    return row!;
  }

  async findById(id: string): Promise<AppointmentRow | null> {
    const [row] = await this.db
      .select(APPOINTMENT_SELECT)
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .innerJoin(lawyerProfiles, eq(appointments.lawyerId, lawyerProfiles.id))
      .where(eq(appointments.id, id))
      .limit(1);

    return (row as AppointmentRow | undefined) ?? null;
  }

  async findByParticipant(
    userId: string,
    isLawyer: boolean,
    query: ListAppointmentsQuery,
  ): Promise<{ items: AppointmentRow[]; total: number }> {
    const { status, page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const participantCondition = isLawyer
      ? eq(lawyerProfiles.userId, userId)
      : eq(appointments.clientId, userId);

    const where = status
      ? and(participantCondition, eq(appointments.status, status as AppointmentStatus))
      : participantCondition;

    const [countRow] = await this.db
      .select({ total: count() })
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .innerJoin(lawyerProfiles, eq(appointments.lawyerId, lawyerProfiles.id))
      .where(where);

    const rows = await this.db
      .select(APPOINTMENT_SELECT)
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .innerJoin(lawyerProfiles, eq(appointments.lawyerId, lawyerProfiles.id))
      .where(where)
      .orderBy(desc(appointments.startAt))
      .limit(limit)
      .offset(offset);

    return {
      items: rows as AppointmentRow[],
      total: countRow?.total ?? 0,
    };
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<void> {
    await this.db
      .update(appointments)
      .set({ status: status as AppointmentStatus, updatedAt: new Date() })
      .where(eq(appointments.id, id));
  }

  async updateExternalPaymentId(id: string, externalPaymentId: string): Promise<void> {
    await this.db
      .update(appointments)
      .set({ externalPaymentId, updatedAt: new Date() })
      .where(eq(appointments.id, id));
  }

  async findByExternalPaymentId(externalPaymentId: string): Promise<AppointmentRow | null> {
    const [row] = await this.db
      .select(APPOINTMENT_SELECT)
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .innerJoin(lawyerProfiles, eq(appointments.lawyerId, lawyerProfiles.id))
      .where(eq(appointments.externalPaymentId, externalPaymentId))
      .limit(1);

    return (row as AppointmentRow | undefined) ?? null;
  }

  async hasConflict(lawyerId: string, startAt: Date, endAt: Date): Promise<boolean> {
    const [row] = await this.db
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.lawyerId, lawyerId),
          inArray(appointments.status, CONFLICT_STATUSES),
          lt(appointments.startAt, endAt),
          gt(appointments.endAt, startAt),
        ),
      )
      .limit(1);

    return !!row;
  }

  async findContactInfo(appointmentId: string): Promise<AppointmentContactInfo | null> {
    const lawyerUser = alias(users, 'lawyer_user');

    const [row] = await this.db
      .select({
        clientEmail: users.email,
        clientFirstName: users.firstName,
        lawyerEmail: lawyerUser.email,
        lawyerFirstName: lawyerProfiles.firstName,
        startAt: appointments.startAt,
        endAt: appointments.endAt,
        consultationType: appointments.consultationType,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .innerJoin(lawyerProfiles, eq(appointments.lawyerId, lawyerProfiles.id))
      .innerJoin(lawyerUser, eq(lawyerProfiles.userId, lawyerUser.id))
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    return (row as AppointmentContactInfo | undefined) ?? null;
  }

  async findUpcomingByLawyerProfileId(
    lawyerProfileId: string,
    limit: number,
  ): Promise<AppointmentRow[]> {
    const rows = await this.db
      .select(APPOINTMENT_SELECT)
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .innerJoin(lawyerProfiles, eq(appointments.lawyerId, lawyerProfiles.id))
      .where(
        and(
          eq(appointments.lawyerId, lawyerProfileId),
          inArray(appointments.status, [AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS]),
          gte(appointments.startAt, new Date()),
        ),
      )
      .orderBy(appointments.startAt)
      .limit(limit);

    return rows as AppointmentRow[];
  }

  async getMonthlyStatsByLawyerProfileId(
    lawyerProfileId: string,
  ): Promise<{ completedThisMonth: number; cancelledThisMonth: number }> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const CANCELLED_STATUSES = [
      AppointmentStatus.CANCELLED_BY_CLIENT,
      AppointmentStatus.CANCELLED_BY_LAWYER,
      AppointmentStatus.CANCELLED_BY_ADMIN,
    ];

    const [row] = await this.db
      .select({
        completedThisMonth: sql<number>`COUNT(*) FILTER (WHERE ${appointments.status} = ${AppointmentStatus.COMPLETED})`,
        cancelledThisMonth: sql<number>`COUNT(*) FILTER (WHERE ${appointments.status} = ANY(ARRAY[${sql.join(CANCELLED_STATUSES.map((s) => sql`${s}`), sql`, `)}]))`,
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.lawyerId, lawyerProfileId),
          gte(appointments.updatedAt, monthStart),
        ),
      );

    return {
      completedThisMonth: Number(row?.completedThisMonth ?? 0),
      cancelledThisMonth: Number(row?.cancelledThisMonth ?? 0),
    };
  }
}
