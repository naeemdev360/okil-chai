import { boolean, pgTable, text } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';

// Admin-managed taxonomy of legal practice areas (SRS §3.3 Content Management)
export const specializations = pgTable('specializations', {
  ...baseColumns,
  name: text('name').notNull().unique(), // e.g. "Criminal Law"
  slug: text('slug').notNull().unique(), // e.g. "criminal-law" — used in search URLs
  category: text('category'), // e.g. "Litigation", "Corporate", "Family"
  isActive: boolean('is_active').notNull().default(true),
});
