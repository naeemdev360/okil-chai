import { ConsultationType, StripeAccountStatus, SubscriptionTier, VerificationStatus } from '@repo/shared';
import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { baseColumns } from './base-columns';
import {
  stripeAccountStatusEnum,
  subscriptionTierEnum,
  verificationStatusEnum,
} from './enums';
import { users } from './users';

export const lawyerProfiles = pgTable('lawyer_profiles', {
  ...baseColumns,
  userId: uuid('user_id')
    .notNull()
    .unique() // enforces 1-to-1 with users
    .references(() => users.id, { onDelete: 'cascade' }),

  // Personal info
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  // 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' — text avoids migration churn if values evolve
  gender: text('gender'),
  photoUrl: text('photo_url'),

  // Bio — default English; additional locales stored as { "bn": "...", "fr": "..." }
  bio: text('bio'),
  bioLocales: jsonb('bio_locales').$type<Record<string, string>>(),

  // Contact
  phone: text('phone'),

  // Professional background
  yearsOfExperience: integer('years_of_experience'),

  // Credentials — barNumber is sensitive; encrypted at the application layer (AES-256 per SRS §8.2)
  barNumber: text('bar_number'),
  yearAdmitted: integer('year_admitted'),
  barCouncil: text('bar_council'),

  // Location — lat/lng for Mapbox geo-radius search (SRS §4.1)
  city: text('city'),
  state: text('state'),
  country: text('country').default('BD'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),

  // Pricing — base hourly rate; per-type overrides live in consultation_fees table
  pricePerHour: numeric('price_per_hour', { precision: 10, scale: 2 }),

  // Consultation types the lawyer offers (VIDEO, PHONE, IN_PERSON)
  consultationTypes: jsonb('consultation_types')
    .$type<ConsultationType[]>()
    .notNull()
    .default([]),

  // Tracks which wizard step the lawyer last completed (0 = not started)
  onboardingStep: integer('onboarding_step').notNull().default(0),

  // Verification workflow (SRS §3.3 Admin Verification)
  verificationStatus: verificationStatusEnum('verification_status')
    .notNull()
    .default(VerificationStatus.DRAFT),
  verificationNotes: text('verification_notes'), // admin rejection reason or approval comments
  verifiedBy: uuid('verified_by').references(() => users.id, { onDelete: 'set null' }),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),

  // Visibility — profile only appears in search after approval
  isPublished: boolean('is_published').notNull().default(false),
  // Instant booking — lawyer allows booking without manual approval (SRS §3.1)
  isInstantBooking: boolean('is_instant_booking').notNull().default(false),

  // Subscription tier — FREE (limited slots) vs PRO (unlimited + priority + analytics)
  subscriptionTier: subscriptionTierEnum('subscription_tier')
    .notNull()
    .default(SubscriptionTier.FREE),

  // Stripe Connect for marketplace payouts (SRS §4.4)
  stripeAccountId: text('stripe_account_id'),
  stripeAccountStatus: stripeAccountStatusEnum('stripe_account_status')
    .notNull()
    .default(StripeAccountStatus.NOT_CONNECTED),

  // Denormalized aggregates — updated after each review/appointment to avoid expensive COUNT queries
  avgRating: numeric('avg_rating', { precision: 3, scale: 2 }),
  totalReviews: integer('total_reviews').notNull().default(0),
  totalConsultations: integer('total_consultations').notNull().default(0),
},
(table) => ([
  index('idx_lawyer_profiles_is_published').on(table.isPublished),
  index('idx_lawyer_profiles_verification_status').on(table.verificationStatus),
  check(
    'chk_avg_rating_range',
    sql`${table.avgRating} IS NULL OR (${table.avgRating} >= 0 AND ${table.avgRating} <= 5)`,
  ),
]));
