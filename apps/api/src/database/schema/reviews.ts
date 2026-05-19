import { sql } from 'drizzle-orm';
import { boolean, check, integer, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { appointments } from './appointments';
import { lawyerProfiles } from './lawyer-profiles';
import { users } from './users';

export const reviews = pgTable(
  'reviews',
  {
    ...baseColumns,
    appointmentId: uuid('appointment_id')
      .notNull()
      .references(() => appointments.id),
    clientId: uuid('client_id')
      .notNull()
      .references(() => users.id),
    lawyerId: uuid('lawyer_id')
      .notNull()
      .references(() => lawyerProfiles.id),
    rating: integer('rating').notNull(),
    text: text('text'),
    isModerated: boolean('is_moderated').notNull().default(false),
  },
  (table) => ([
    uniqueIndex('uq_review_appointment_client').on(table.appointmentId, table.clientId),
    check('chk_rating_range', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  ]),
);
