import { boolean, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { appointments } from './appointments';
import { users } from './users';

export const messages = pgTable(
  'messages',
  {
    ...baseColumns,
    senderId: uuid('sender_id')
      .notNull()
      .references(() => users.id),
    receiverId: uuid('receiver_id')
      .notNull()
      .references(() => users.id),
    appointmentId: uuid('appointment_id').references(() => appointments.id),
    content: text('content').notNull(),
    isRead: boolean('is_read').notNull().default(false),
    readAt: timestamp('read_at', { withTimezone: true }),
  },
  (table) => ([
    index('idx_messages_receiver_is_read').on(table.receiverId, table.isRead),
    index('idx_messages_sender_receiver').on(table.senderId, table.receiverId),
  ]),
);
