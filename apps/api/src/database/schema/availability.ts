import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { lawyerProfiles } from './lawyer-profiles';

export const availability = pgTable(
  'availability',
  {
    ...baseColumns,
    lawyerId: uuid('lawyer_id')
      .notNull()
      .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
    dayOfWeek: integer('day_of_week').notNull(),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
    isRecurring: boolean('is_recurring').notNull().default(true),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => ([
    index('idx_availability_lawyer_id').on(table.lawyerId),
    check('chk_day_of_week_range', sql`${table.dayOfWeek} >= 0 AND ${table.dayOfWeek} <= 6`),
  ]),
);
