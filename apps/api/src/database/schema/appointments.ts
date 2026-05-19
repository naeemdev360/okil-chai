import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { AppointmentStatus } from '@repo/shared';

import { appointmentStatusEnum, caseCategoryEnum, consultationTypeEnum } from './enums';
import { baseColumns } from './base-columns';
import { lawyerProfiles } from './lawyer-profiles';
import { users } from './users';

export const appointments = pgTable(
  'appointments',
  {
    ...baseColumns,
    clientId: uuid('client_id')
      .notNull()
      .references(() => users.id),
    lawyerId: uuid('lawyer_id')
      .notNull()
      .references(() => lawyerProfiles.id),
    consultationType: consultationTypeEnum('consultation_type').notNull(),
    caseCategory: caseCategoryEnum('case_category').notNull(),
    startAt: timestamp('start_at', { withTimezone: true }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true }).notNull(),
    status: appointmentStatusEnum('status').notNull().default(AppointmentStatus.DRAFT),
    externalPaymentId: text('external_payment_id'),
    clientNotes: text('client_notes'),
  },
  (table) => ([
    index('idx_appointments_client_id').on(table.clientId),
    index('idx_appointments_lawyer_id').on(table.lawyerId),
    index('idx_appointments_status').on(table.status),
    index('idx_appointments_start_at').on(table.startAt),
  ]),
);
