import { pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import { lawyerProfiles } from './lawyer-profiles';
import { users } from './users';

export const lawyerFavourites = pgTable(
  'lawyer_favourites',
  {
    ...baseColumns,
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lawyerId: uuid('lawyer_id')
      .notNull()
      .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
  },
  (table) => ([
    uniqueIndex('uq_favourite_user_lawyer').on(table.userId, table.lawyerId),
  ]),
);
