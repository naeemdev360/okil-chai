import { boolean, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { notificationTypeEnum } from './enums';
import { users } from './users';

export const notifications = pgTable(
  'notifications',
  {
    ...baseColumns,
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    // JSON-serialised payload (e.g. { appointmentId: "..." }) — consumers cast to a known shape
    payload: text('payload'),
    isRead: boolean('is_read').notNull().default(false),
  },
  (table) => ([
    index('idx_notifications_user_id').on(table.userId),
    index('idx_notifications_user_is_read').on(table.userId, table.isRead),
  ]),
);
