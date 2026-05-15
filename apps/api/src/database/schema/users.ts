import { boolean, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';

export const users = pgTable('users', {
  ...baseColumns,
  email: text('email').notNull().unique(),
  firstName: varchar('first_name', { length: 60 }).notNull(),
  lastName: varchar('last_name', { length: 60 }).notNull(),
  avatarUrl: text('avatar_url'),
  phone: varchar('phone', { length: 20 }),
  preferredLanguage: varchar('preferred_language', { length: 10 }).notNull().default('en'),
  isVerified: boolean('is_verified').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
});
