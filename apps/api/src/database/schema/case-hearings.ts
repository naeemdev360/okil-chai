import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { cases } from './cases';
import { caseHearingTypeEnum } from './enums';

export const caseHearings = pgTable(
  'case_hearings',
  {
    ...baseColumns,
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    venue: text('venue'),
    hearingType: caseHearingTypeEnum('hearing_type').notNull(),
    notes: text('notes'),
    outcome: text('outcome'),
  },
  (table) => ([
    index('idx_case_hearings_case_id').on(table.caseId),
    index('idx_case_hearings_scheduled_at').on(table.scheduledAt),
  ]),
);