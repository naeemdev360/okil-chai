import { pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { authProviderEnum } from './enums';
import { users } from './users';

export const userIdentities = pgTable(
  'user_identities',
  {
    ...baseColumns,
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: authProviderEnum('provider').notNull(),
    // For social: the OAuth subject (google sub, facebook id). For LOCAL: the user's email.
    providerUserId: text('provider_user_id').notNull(),
    passwordHash: text('password_hash'),
  },
  (table) => ({
    // Prevent the same OAuth account from being linked to two different users
    providerUserIdIdx: uniqueIndex('uq_provider_provider_user_id').on(
      table.provider,
      table.providerUserId,
    ),
    // Prevent the same provider from being linked twice to one user
    userProviderIdx: uniqueIndex('uq_user_provider').on(table.userId, table.provider),
  }),
);
