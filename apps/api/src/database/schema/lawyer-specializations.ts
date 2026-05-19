import { sql } from 'drizzle-orm';
import { boolean, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { lawyerProfiles } from './lawyer-profiles';
import { specializations } from './specializations';

export const lawyerSpecializations = pgTable(
  'lawyer_specializations',
  {
    ...baseColumns,
    lawyerId: uuid('lawyer_id')
      .notNull()
      .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
    specializationId: uuid('specialization_id')
      .notNull()
      .references(() => specializations.id, { onDelete: 'cascade' }),
    // Marks the lawyer's primary area — used for search ranking and profile display
    isPrimary: boolean('is_primary').notNull().default(false),
  },
  (table) => ([
    uniqueIndex('uq_lawyer_specialization').on(
      table.lawyerId,
      table.specializationId,
    ),
    // Ensures each lawyer has at most one primary specialization
    uniqueIndex('uq_lawyer_single_primary')
      .on(table.lawyerId)
      .where(sql`${table.isPrimary} = true`),
  ]),
);