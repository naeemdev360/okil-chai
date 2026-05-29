import { index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { cases } from './cases';
import { users } from './users';

// Per-case documents stored in object storage. Same provider-agnostic key pattern as lawyer_documents.
export const caseDocuments = pgTable(
  'case_documents',
  {
    ...baseColumns,
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    uploaderUserId: uuid('uploader_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    storageKey: text('storage_key').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
  },
  (table) => ([
    index('idx_case_documents_case_id').on(table.caseId),
  ]),
);
