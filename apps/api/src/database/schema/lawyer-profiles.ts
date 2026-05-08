import { boolean, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const lawyerProfiles = pgTable('lawyer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  bio: text('bio'),
  barNumber: text('bar_number'),
  photoUrl: text('photo_url'),
  city: text('city'),
  pricePerHour: numeric('price_per_hour', { precision: 10, scale: 2 }),
  isApproved: boolean('is_approved').notNull().default(false),
  stripeAccountId: text('stripe_account_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
