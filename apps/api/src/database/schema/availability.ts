import { boolean, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { lawyerProfiles } from './lawyer-profiles';

export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  lawyerId: uuid('lawyer_id')
    .notNull()
    .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  isRecurring: boolean('is_recurring').notNull().default(true),
});
