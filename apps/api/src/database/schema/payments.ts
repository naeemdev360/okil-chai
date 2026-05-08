import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { appointments } from './appointments';

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  appointmentId: uuid('appointment_id')
    .notNull()
    .references(() => appointments.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('usd'),
  stripeChargeId: text('stripe_charge_id'),
  status: text('status').notNull().default('pending'),
  platformFee: numeric('platform_fee', { precision: 10, scale: 2 }),
  lawyerPayout: numeric('lawyer_payout', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
