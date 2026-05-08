import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { AuthProvider, Role } from '@okil-chai/shared';

import { authProviderEnum, roleEnum } from './enums';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  role: roleEnum('role').notNull().default(Role.CLIENT),
  authProvider: authProviderEnum('auth_provider').notNull().default(AuthProvider.LOCAL),
  providerUserId: text('provider_user_id'),
  isVerified: boolean('is_verified').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
