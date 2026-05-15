import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { AppointmentStatus } from '@repo/shared';

import { appointmentStatusEnum, consultationTypeEnum } from './enums';
import { lawyerProfiles } from './lawyer-profiles';
import { users } from './users';

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => users.id),
  lawyerId: uuid('lawyer_id')
    .notNull()
    .references(() => lawyerProfiles.id),
  consultationType: consultationTypeEnum('consultation_type').notNull(),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at').notNull(),
  status: appointmentStatusEnum('status').notNull().default(AppointmentStatus.DRAFT),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  clientNotes: text('client_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
