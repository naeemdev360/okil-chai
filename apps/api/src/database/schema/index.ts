import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  numeric,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['CLIENT', 'LAWYER', 'ADMIN']);
export const authProviderEnum = pgEnum('auth_provider', ['LOCAL', 'GOOGLE', 'FACEBOOK']);
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
  'NO_SHOW',
]);
export const consultationTypeEnum = pgEnum('consultation_type', ['VIDEO', 'PHONE', 'IN_PERSON']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  role: roleEnum('role').notNull().default('CLIENT'),
  authProvider: authProviderEnum('auth_provider').notNull().default('LOCAL'),
  providerUserId: text('provider_user_id'),
  isVerified: boolean('is_verified').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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

export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  lawyerId: uuid('lawyer_id')
    .notNull()
    .references(() => lawyerProfiles.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  isRecurring: boolean('is_recurring').notNull().default(true),
});

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => users.id),
  lawyerId: uuid('lawyer_id')
    .notNull()
    .references(() => lawyerProfiles.id),
  consultationType: consultationTypeEnum('consultation_type').notNull(),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at').notNull(),
  status: appointmentStatusEnum('status').notNull().default('PENDING'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  clientNotes: text('client_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  appointmentId: uuid('appointment_id')
    .notNull()
    .references(() => appointments.id),
  clientId: uuid('client_id')
    .notNull()
    .references(() => users.id),
  lawyerId: uuid('lawyer_id')
    .notNull()
    .references(() => lawyerProfiles.id),
  rating: integer('rating').notNull(),
  text: text('text'),
  isModerated: boolean('is_moderated').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  appointmentId: uuid('appointment_id')
    .notNull()
    .references(() => appointments.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('usd'),
  stripeChargeId: text('stripe_charge_id'),
  status: text('status').notNull().default('pending'),
  platformFee: numeric('platform_fee', { precision: 10, scale: 2 }),
  lawyerPayout: numeric('lawyer_payout', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id),
  receiverId: uuid('receiver_id')
    .notNull()
    .references(() => users.id),
  appointmentId: uuid('appointment_id').references(() => appointments.id),
  content: text('content').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
