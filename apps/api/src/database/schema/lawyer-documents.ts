import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { documentTypeEnum } from './enums';
import { lawyerProfiles } from './lawyer-profiles';

// Credential documents uploaded to object storage during lawyer onboarding, reviewed by admins (SRS §6.3)
export const lawyerDocuments = pgTable('lawyer_documents', {
  ...baseColumns,
  lawyerId: uuid('lawyer_id')
    .notNull()
    .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
  type: documentTypeEnum('type').notNull(),
  name: text('name').notNull(), // display name, e.g. "Bar Certificate 2024"
  // Provider-agnostic object key — works with S3, Azure Blob, GCS.
  // Never store a full URL; generate short-lived presigned/SAS URLs at request time.
  storageKey: text('storage_key').notNull(),
  mimeType: text('mime_type').notNull(), // 'application/pdf', 'image/jpeg', etc.
  sizeBytes: integer('size_bytes'),
});
