import { Inject, Injectable } from '@nestjs/common';
import { PaymentStatus } from '@repo/shared';
import { and, count, eq, isNull, min, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { appointments, lawyerProfiles, payments, users } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import { buildPagination } from '../../common/utils/pagination.util';
import type {
  EarningsSummary,
  InsertPaymentData,
  IPaymentsRepository,
  PaymentHistoryItem,
  PaymentHistoryOptions,
  PaymentRecord,
  PendingPayoutItem,
} from './interfaces/payments.interfaces';

const PAYMENT_RECORD_SELECT = {
  id: payments.id,
  appointmentId: payments.appointmentId,
  amount: payments.amount,
  currency: payments.currency,
  trxId: payments.externalTrxId,
  status: payments.status,
  platformFee: payments.platformFee,
  lawyerPayout: payments.lawyerPayout,
  payoutProcessedAt: payments.payoutProcessedAt,
  createdAt: payments.createdAt,
  updatedAt: payments.updatedAt,
};

@Injectable()
export class PaymentsRepository extends BaseRepository implements IPaymentsRepository {
  constructor(@Inject(DATABASE_TOKEN) db: DatabaseInstance) {
    super(db);
  }

  async insert(data: InsertPaymentData): Promise<PaymentRecord> {
    const [row] = await this.db
      .insert(payments)
      .values({
        appointmentId: data.appointmentId,
        amount: data.amount,
        currency: data.currency,
        externalTrxId: data.trxId,
        platformFee: data.platformFee,
        lawyerPayout: data.lawyerPayout,
        status: PaymentStatus.COMPLETED,
      })
      .returning(PAYMENT_RECORD_SELECT);

    return row!;
  }

  async findByAppointmentId(appointmentId: string): Promise<PaymentRecord | null> {
    const [row] = await this.db
      .select(PAYMENT_RECORD_SELECT)
      .from(payments)
      .where(eq(payments.appointmentId, appointmentId))
      .limit(1);

    return row ?? null;
  }

  async updateStatusToRefunded(appointmentId: string): Promise<void> {
    await this.db
      .update(payments)
      .set({ status: PaymentStatus.REFUNDED, updatedAt: new Date() })
      .where(eq(payments.appointmentId, appointmentId));
  }

  async sumAmountByClientId(clientId: string): Promise<string> {
    const [row] = await this.db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .innerJoin(appointments, eq(payments.appointmentId, appointments.id))
      .where(
        and(
          eq(appointments.clientId, clientId),
          eq(payments.status, PaymentStatus.COMPLETED),
        ),
      );
    return row?.total ?? '0';
  }

  async findHistoryByClientId(
    clientId: string,
    opts: PaymentHistoryOptions,
  ): Promise<{ items: PaymentHistoryItem[]; total: number }> {
    const { limit, offset } = buildPagination(opts);
    const lawyerUser = alias(users, 'lawyer_user');
    const where = eq(appointments.clientId, clientId);

    const [countRow] = await this.db
      .select({ total: count() })
      .from(payments)
      .innerJoin(appointments, eq(payments.appointmentId, appointments.id))
      .where(where);

    const rows = await this.db
      .select({
        ...PAYMENT_RECORD_SELECT,
        appointmentStartAt: appointments.startAt,
        appointmentEndAt: appointments.endAt,
        counterpartFirstName: lawyerProfiles.firstName,
        counterpartLastName: lawyerProfiles.lastName,
      })
      .from(payments)
      .innerJoin(appointments, eq(payments.appointmentId, appointments.id))
      .innerJoin(lawyerProfiles, eq(appointments.lawyerId, lawyerProfiles.id))
      .innerJoin(lawyerUser, eq(lawyerProfiles.userId, lawyerUser.id))
      .where(where)
      .orderBy(sql`${payments.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    return { items: rows as PaymentHistoryItem[], total: countRow?.total ?? 0 };
  }

  async findHistoryByLawyerProfileId(
    lawyerProfileId: string,
    opts: PaymentHistoryOptions,
  ): Promise<{ items: PaymentHistoryItem[]; total: number }> {
    const { limit, offset } = buildPagination(opts);
    const where = eq(appointments.lawyerId, lawyerProfileId);

    const [countRow] = await this.db
      .select({ total: count() })
      .from(payments)
      .innerJoin(appointments, eq(payments.appointmentId, appointments.id))
      .where(where);

    const rows = await this.db
      .select({
        ...PAYMENT_RECORD_SELECT,
        appointmentStartAt: appointments.startAt,
        appointmentEndAt: appointments.endAt,
        counterpartFirstName: users.firstName,
        counterpartLastName: users.lastName,
      })
      .from(payments)
      .innerJoin(appointments, eq(payments.appointmentId, appointments.id))
      .innerJoin(users, eq(appointments.clientId, users.id))
      .where(where)
      .orderBy(sql`${payments.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    return { items: rows as PaymentHistoryItem[], total: countRow?.total ?? 0 };
  }

  async getEarningsSummaryByLawyerProfileId(lawyerProfileId: string): Promise<EarningsSummary> {
    const [row] = await this.db
      .select({
        totalEarned: sum(payments.lawyerPayout),
        pendingPayout: sql<string>`SUM(CASE WHEN ${payments.payoutProcessedAt} IS NULL THEN ${payments.lawyerPayout} ELSE 0 END)`,
        paidOut: sql<string>`SUM(CASE WHEN ${payments.payoutProcessedAt} IS NOT NULL THEN ${payments.lawyerPayout} ELSE 0 END)`,
        totalTransactions: count(),
      })
      .from(payments)
      .innerJoin(appointments, eq(payments.appointmentId, appointments.id))
      .where(
        and(
          eq(appointments.lawyerId, lawyerProfileId),
          eq(payments.status, PaymentStatus.COMPLETED),
        ),
      );

    return {
      totalEarned: row?.totalEarned ?? '0',
      pendingPayout: row?.pendingPayout ?? '0',
      paidOut: row?.paidOut ?? '0',
      totalTransactions: row?.totalTransactions ?? 0,
    };
  }

  async listPendingPayouts(): Promise<PendingPayoutItem[]> {
    const lawyerUser = alias(users, 'lawyer_user');

    const rows = await this.db
      .select({
        lawyerProfileId: lawyerProfiles.id,
        lawyerFirstName: lawyerProfiles.firstName,
        lawyerLastName: lawyerProfiles.lastName,
        lawyerEmail: lawyerUser.email,
        totalPending: sum(payments.lawyerPayout),
        transactionCount: count(),
        oldestUnpaidAt: min(payments.createdAt),
        paymentIds: sql<string[]>`array_agg(${payments.id}::text)`,
      })
      .from(payments)
      .innerJoin(appointments, eq(payments.appointmentId, appointments.id))
      .innerJoin(lawyerProfiles, eq(appointments.lawyerId, lawyerProfiles.id))
      .innerJoin(lawyerUser, eq(lawyerProfiles.userId, lawyerUser.id))
      .where(
        and(
          eq(payments.status, PaymentStatus.COMPLETED),
          isNull(payments.payoutProcessedAt),
        ),
      )
      .groupBy(
        lawyerProfiles.id,
        lawyerProfiles.firstName,
        lawyerProfiles.lastName,
        lawyerUser.email,
      );

    return rows.map((r) => ({
      lawyerProfileId: r.lawyerProfileId,
      lawyerFirstName: r.lawyerFirstName,
      lawyerLastName: r.lawyerLastName,
      lawyerEmail: r.lawyerEmail,
      totalPending: r.totalPending ?? '0',
      transactionCount: r.transactionCount,
      oldestUnpaidAt: r.oldestUnpaidAt!,
      paymentIds: r.paymentIds ?? [],
    }));
  }

  async markPayoutsProcessed(paymentIds: readonly string[]): Promise<void> {
    if (paymentIds.length === 0) return;

    await this.db
      .update(payments)
      .set({ payoutProcessedAt: new Date(), updatedAt: new Date() })
      .where(sql`${payments.id} = ANY(ARRAY[${sql.join(paymentIds.map((id) => sql`${id}::uuid`), sql`, `)}])`);
  }
}
