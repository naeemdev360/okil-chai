import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { cases } from './cases';
import { caseStageEnum } from './enums';
import { users } from './users';

// Immutable audit log: one row per stage transition. Never updated or deleted via the API.
export const caseStageEvents = pgTable(
  'case_stage_events',
  {
    ...baseColumns,
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    fromStage: caseStageEnum('from_stage'),
    toStage: caseStageEnum('to_stage').notNull(),
    actorUserId: uuid('actor_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    note: text('note'),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ([
    index('idx_case_stage_events_case_id').on(table.caseId),
    index('idx_case_stage_events_occurred_at').on(table.occurredAt),
  ]),
);
