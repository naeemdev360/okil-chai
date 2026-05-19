CREATE TYPE "public"."appointment_status" AS ENUM('DRAFT', 'PENDING_PAYMENT', 'CONFIRMED', 'RESCHEDULE_REQUESTED', 'RESCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_LAWYER', 'CANCELLED_BY_ADMIN', 'NO_SHOW_CLIENT', 'NO_SHOW_LAWYER', 'REFUNDED', 'DISPUTED');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('LOCAL', 'GOOGLE', 'FACEBOOK');--> statement-breakpoint
CREATE TYPE "public"."auth_token_type" AS ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET');--> statement-breakpoint
CREATE TYPE "public"."consultation_type" AS ENUM('VIDEO', 'PHONE', 'IN_PERSON');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('BAR_CERTIFICATE', 'LAW_DEGREE', 'GOVERNMENT_ID', 'CERTIFICATION', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'COMPLETED', 'REFUNDED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."stripe_account_status" AS ENUM('NOT_CONNECTED', 'PENDING', 'ACTIVE', 'RESTRICTED');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('FREE', 'PRO');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('CLIENT', 'LAWYER', 'PLATFORM_ADMIN', 'SUPPORT_AGENT', 'FIRM_ADMIN', 'FIRM_MANAGER');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('DRAFT', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REQUIRES_RESUBMISSION');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"client_id" uuid NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"consultation_type" "consultation_type" NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"status" "appointment_status" DEFAULT 'DRAFT' NOT NULL,
	"external_payment_id" text,
	"client_notes" text
);
--> statement-breakpoint
CREATE TABLE "auth_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "auth_token_type" NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"is_recurring" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "chk_day_of_week_range" CHECK ("availability"."day_of_week" >= 0 AND "availability"."day_of_week" <= 6)
);
--> statement-breakpoint
CREATE TABLE "lawyer_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"type" "document_type" NOT NULL,
	"name" text NOT NULL,
	"storage_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"status" "document_status" DEFAULT 'PENDING' NOT NULL,
	"rejection_reason" text,
	"admin_notes" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lawyer_languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"language" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lawyer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"gender" text,
	"photo_url" text,
	"bio" text,
	"bio_locales" jsonb,
	"phone" text,
	"years_of_experience" integer,
	"bar_number" text,
	"year_admitted" integer,
	"bar_council" text,
	"city" text,
	"state" text,
	"country" text DEFAULT 'BD',
	"latitude" double precision,
	"longitude" double precision,
	"price_per_hour" numeric(10, 2),
	"consultation_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"onboarding_step" integer DEFAULT 0 NOT NULL,
	"verification_status" "verification_status" DEFAULT 'DRAFT' NOT NULL,
	"verification_notes" text,
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_instant_booking" boolean DEFAULT false NOT NULL,
	"subscription_tier" "subscription_tier" DEFAULT 'FREE' NOT NULL,
	"stripe_account_id" text,
	"stripe_account_status" "stripe_account_status" DEFAULT 'NOT_CONNECTED' NOT NULL,
	"avg_rating" numeric(3, 2),
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"total_consultations" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "lawyer_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "chk_avg_rating_range" CHECK ("lawyer_profiles"."avg_rating" IS NULL OR ("lawyer_profiles"."avg_rating" >= 0 AND "lawyer_profiles"."avg_rating" <= 5))
);
--> statement-breakpoint
CREATE TABLE "lawyer_specializations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"specialization_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"appointment_id" uuid,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"appointment_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'BDT' NOT NULL,
	"external_trx_id" text,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"platform_fee" numeric(10, 2),
	"lawyer_payout" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"appointment_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"text" text,
	"is_moderated" boolean DEFAULT false NOT NULL,
	CONSTRAINT "chk_rating_range" CHECK ("reviews"."rating" >= 1 AND "reviews"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"device_info" text,
	"ip_address" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "specializations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "specializations_name_unique" UNIQUE("name"),
	CONSTRAINT "specializations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"provider_user_id" text NOT NULL,
	"password_hash" text
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "user_role" NOT NULL,
	"granted_by" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"email" text NOT NULL,
	"first_name" varchar(60) NOT NULL,
	"last_name" varchar(60) NOT NULL,
	"avatar_url" text,
	"phone" varchar(20),
	"preferred_language" varchar(10) DEFAULT 'en' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lawyer_id_lawyer_profiles_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_lawyer_id_lawyer_profiles_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_documents" ADD CONSTRAINT "lawyer_documents_lawyer_id_lawyer_profiles_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_documents" ADD CONSTRAINT "lawyer_documents_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_languages" ADD CONSTRAINT "lawyer_languages_lawyer_id_lawyer_profiles_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_profiles" ADD CONSTRAINT "lawyer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_profiles" ADD CONSTRAINT "lawyer_profiles_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_specializations" ADD CONSTRAINT "lawyer_specializations_lawyer_id_lawyer_profiles_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_specializations" ADD CONSTRAINT "lawyer_specializations_specialization_id_specializations_id_fk" FOREIGN KEY ("specialization_id") REFERENCES "public"."specializations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_lawyer_id_lawyer_profiles_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_identities" ADD CONSTRAINT "user_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_appointments_client_id" ON "appointments" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_appointments_lawyer_id" ON "appointments" USING btree ("lawyer_id");--> statement-breakpoint
CREATE INDEX "idx_appointments_status" ON "appointments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_appointments_start_at" ON "appointments" USING btree ("start_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_auth_tokens_token_hash" ON "auth_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "idx_auth_tokens_user_id_type" ON "auth_tokens" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "idx_availability_lawyer_id" ON "availability" USING btree ("lawyer_id");--> statement-breakpoint
CREATE INDEX "idx_lawyer_documents_lawyer_id" ON "lawyer_documents" USING btree ("lawyer_id");--> statement-breakpoint
CREATE INDEX "idx_lawyer_documents_status" ON "lawyer_documents" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_lawyer_language" ON "lawyer_languages" USING btree ("lawyer_id","language");--> statement-breakpoint
CREATE INDEX "idx_lawyer_profiles_is_published" ON "lawyer_profiles" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_lawyer_profiles_verification_status" ON "lawyer_profiles" USING btree ("verification_status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_lawyer_specialization" ON "lawyer_specializations" USING btree ("lawyer_id","specialization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_lawyer_single_primary" ON "lawyer_specializations" USING btree ("lawyer_id") WHERE "lawyer_specializations"."is_primary" = true;--> statement-breakpoint
CREATE INDEX "idx_messages_receiver_is_read" ON "messages" USING btree ("receiver_id","is_read");--> statement-breakpoint
CREATE INDEX "idx_messages_sender_receiver" ON "messages" USING btree ("sender_id","receiver_id");--> statement-breakpoint
CREATE INDEX "idx_payments_appointment_id" ON "payments" USING btree ("appointment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_review_appointment_client" ON "reviews" USING btree ("appointment_id","client_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_provider_provider_user_id" ON "user_identities" USING btree ("provider","provider_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_user_provider" ON "user_identities" USING btree ("user_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_user_role" ON "user_roles" USING btree ("user_id","role");