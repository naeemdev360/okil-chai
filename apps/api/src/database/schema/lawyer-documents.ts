import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { DocumentStatus } from '@repo/shared';

import { baseColumns } from './base-columns';
import { documentStatusEnum, documentTypeEnum } from './enums';
import { lawyerProfiles } from './lawyer-profiles';
import { users } from './users';

// Credential documents uploaded to object storage during lawyer onboarding, reviewed by admins (SRS §6.3)
export const lawyerDocuments = pgTable(
  'lawyer_documents',
  {
    ...baseColumns,
    lawyerId: uuid('lawyer_id')
      .notNull()
      .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
    type: documentTypeEnum('type').notNull(),
    name: text('name').notNull(),
    // Provider-agnostic object key — works with S3, Azure Blob, GCS.
    // Never store a full URL; generate short-lived presigned/SAS URLs at request time.
    storageKey: text('storage_key').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),

    // Review workflow — set by admin during document verification
    status: documentStatusEnum('status').notNull().default(DocumentStatus.PENDING),
    // Shown to the lawyer when status = REJECTED so they know exactly what to fix
    rejectionReason: text('rejection_reason'),
    // Internal admin notes — not exposed to the lawyer
    adminNotes: text('admin_notes'),
    reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  },
  (table) => ([
    index('idx_lawyer_documents_lawyer_id').on(table.lawyerId),
    index('idx_lawyer_documents_status').on(table.status),
  ]),
);
