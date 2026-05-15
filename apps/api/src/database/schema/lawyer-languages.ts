import { pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { lawyerProfiles } from './lawyer-profiles';

export const lawyerLanguages = pgTable(
  'lawyer_languages',
  {
    ...baseColumns,
    lawyerId: uuid('lawyer_id')
      .notNull()
      .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
    // ISO 639-1 language code: 'en', 'bn', 'fr', etc.
    language: text('language').notNull(),
  },
  (table) => ([
    uniqueIndex('uq_lawyer_language').on(table.lawyerId, table.language),
  ]),
);