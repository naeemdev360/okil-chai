import { index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { authTokenTypeEnum } from './enums';
import { users } from './users';

// Single table for all one-time tokens: email verification and password reset.
// Both follow the same pattern — generate → hash → send raw → verify hash → mark used.
export const authTokens = pgTable(
  'auth_tokens',
  {
    ...baseColumns,
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: authTokenTypeEnum('type').notNull(),
    // Hash of the token sent to the user — never store the raw token
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    // Non-null means the token has already been consumed
    usedAt: timestamp('used_at', { withTimezone: true }),
  },
  (table) => ([
    uniqueIndex('idx_auth_tokens_token_hash').on(table.tokenHash),
    index('idx_auth_tokens_user_id_type').on(table.userId, table.type),
  ]),
);
