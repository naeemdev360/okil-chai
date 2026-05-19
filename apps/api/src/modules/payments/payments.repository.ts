import { Inject, Injectable } from '@nestjs/common';
import { PaymentStatus } from '@repo/shared';
import { eq } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from '../../database/database.module';
import { payments } from '../../database/schema';
import { BaseRepository } from '../../common/utils/base.repository';
import type {
  InsertPaymentData,
  IPaymentsRepository,
  PaymentRecord,
} from './interfaces/payments.interfaces';

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
        status: PaymentStatus.COMPLETED,
      })
      .returning({
        id: payments.id,
        appointmentId: payments.appointmentId,
        amount: payments.amount,
        currency: payments.currency,
        trxId: payments.externalTrxId,
        status: payments.status,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
      });

    return row!;
  }

  async findByAppointmentId(appointmentId: string): Promise<PaymentRecord | null> {
    const [row] = await this.db
      .select({
        id: payments.id,
        appointmentId: payments.appointmentId,
        amount: payments.amount,
        currency: payments.currency,
        trxId: payments.externalTrxId,
        status: payments.status,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
      })
      .from(payments)
      .where(eq(payments.appointmentId, appointmentId))
      .limit(1);

    return row ?? null;
  }
}
