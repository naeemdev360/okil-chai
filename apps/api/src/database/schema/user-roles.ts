import { pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { userRoleEnum } from './enums';
import { users } from './users';

export const userRoles = pgTable(
  'user_roles',
  {
    ...baseColumns,
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: userRoleEnum('role').notNull(),
    // Null means the role was assigned by the system (e.g. on registration)
    grantedBy: uuid('granted_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (table) => ([
    uniqueIndex('uq_user_role').on(table.userId, table.role),
  ]),
);
