import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { CaseAssignmentStatus, CaseStage, CaseStatus } from '@repo/shared';

import { baseColumns } from './base-columns';
import {
  caseAssignmentStatusEnum,
  caseCategoryEnum,
  caseStageEnum,
  caseStatusEnum,
} from './enums';
import { lawyerProfiles } from './lawyer-profiles';
import { users } from './users';

export const cases = pgTable(
  'cases',
  {
    ...baseColumns,
    clientId: uuid('client_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // Nullable until a lawyer accepts. References lawyer_profiles, not users.
    assignedLawyerId: uuid('assigned_lawyer_id').references(() => lawyerProfiles.id, {
      onDelete: 'set null',
    }),
    title: text('title').notNull(),
    description: text('description'),
    caseCategory: caseCategoryEnum('case_category').notNull(),
    // Court / tribunal reference, set after FILED
    referenceNumber: text('reference_number'),
    currentStage: caseStageEnum('current_stage').notNull().default(CaseStage.INTAKE),
    status: caseStatusEnum('status').notNull().default(CaseStatus.ACTIVE),
    assignmentStatus: caseAssignmentStatusEnum('assignment_status')
      .notNull()
      .default(CaseAssignmentStatus.UNASSIGNED),
    estimatedCompletionAt: timestamp('estimated_completion_at', { withTimezone: true }),
    openedAt: timestamp('opened_at', { withTimezone: true }).defaultNow().notNull(),
    closedAt: timestamp('closed_at', { withTimezone: true }),
  },
  (table) => ([
    index('idx_cases_client_id').on(table.clientId),
    index('idx_cases_assigned_lawyer_id').on(table.assignedLawyerId),
    index('idx_cases_status').on(table.status),
    index('idx_cases_current_stage').on(table.currentStage),
  ]),
);
