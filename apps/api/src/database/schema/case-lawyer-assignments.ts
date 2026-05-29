import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { CaseAssignmentStatus } from '@repo/shared';

import { baseColumns } from './base-columns';
import { caseAssignmentStatusEnum } from './enums';
import { cases } from './cases';
import { lawyerProfiles } from './lawyer-profiles';
import { users } from './users';

// Append-only history: one row per invite / accept / decline / release.
// cases.assignedLawyerId always reflects the most recent ACCEPTED row (if any).
export const caseLawyerAssignments = pgTable(
  'case_lawyer_assignments',
  {
    ...baseColumns,
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    lawyerId: uuid('lawyer_id')
      .notNull()
      .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
    invitedByUserId: uuid('invited_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    status: caseAssignmentStatusEnum('status').notNull().default(CaseAssignmentStatus.PENDING),
    invitedAt: timestamp('invited_at', { withTimezone: true }).defaultNow().notNull(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
    releasedAt: timestamp('released_at', { withTimezone: true }),
    // Short machine token: 'reassigned_by_client' | 'released_by_lawyer' | 'declined' | 'closed'
    releaseReason: text('release_reason'),
  },
  (table) => ([
    index('idx_case_lawyer_assignments_case_id').on(table.caseId),
    index('idx_case_lawyer_assignments_lawyer_id').on(table.lawyerId),
    index('idx_case_lawyer_assignments_status').on(table.status),
  ]),
);
