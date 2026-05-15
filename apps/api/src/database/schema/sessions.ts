import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { users } from './users';

export const sessions = pgTable('sessions', {
  ...baseColumns,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  // Stored as a bcrypt hash — never store the raw refresh token
  refreshTokenHash: text('refresh_token_hash').notNull(),
  deviceInfo: text('device_info'),
  ipAddress: text('ip_address'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  // Non-null means the session has been explicitly revoked (logout / rotate)
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
});
