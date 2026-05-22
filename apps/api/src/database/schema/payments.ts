import { index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { PaymentStatus } from '@repo/shared';

import { baseColumns } from './base-columns';
import { paymentStatusEnum } from './enums';
import { appointments } from './appointments';

export const payments = pgTable(
  'payments',
  {
    ...baseColumns,
    appointmentId: uuid('appointment_id')
      .notNull()
      .references(() => appointments.id),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('BDT'),
    externalTrxId: text('external_trx_id'),
    status: paymentStatusEnum('status').notNull().default(PaymentStatus.PENDING),
    platformFee: numeric('platform_fee', { precision: 10, scale: 2 }),
    lawyerPayout: numeric('lawyer_payout', { precision: 10, scale: 2 }),
    payoutProcessedAt: timestamp('payout_processed_at', { withTimezone: true }),
  },
  (table) => ([
    index('idx_payments_appointment_id').on(table.appointmentId),
    index('idx_payments_payout_processed_at').on(table.payoutProcessedAt),
  ]),
);
