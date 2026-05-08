import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { appointments } from './appointments';
import { lawyerProfiles } from './lawyer-profiles';
import { users } from './users';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
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
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
