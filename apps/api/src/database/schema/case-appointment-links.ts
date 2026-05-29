import { index, pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';

import { appointments } from './appointments';
import { cases } from './cases';

// Many-to-many join: an appointment can be associated with the case it discusses.
export const caseAppointmentLinks = pgTable(
  'case_appointment_links',
  {
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    appointmentId: uuid('appointment_id')
      .notNull()
      .references(() => appointments.id, { onDelete: 'cascade' }),
    linkedAt: timestamp('linked_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ([
    primaryKey({ columns: [table.caseId, table.appointmentId] }),
    index('idx_case_appointment_links_appointment_id').on(table.appointmentId),
  ]),
);
