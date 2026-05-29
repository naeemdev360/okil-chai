CREATE TYPE "public"."case_assignment_status" AS ENUM('UNASSIGNED', 'PENDING', 'ACCEPTED', 'DECLINED', 'RELEASED');--> statement-breakpoint
CREATE TYPE "public"."case_hearing_type" AS ENUM('MENTION', 'EVIDENCE', 'JUDGMENT', 'APPEAL', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."case_stage" AS ENUM('INTAKE', 'LAWYER_ASSIGNED', 'DISCOVERY', 'PRE_FILING', 'FILED', 'HEARING_SCHEDULED', 'IN_TRIAL', 'JUDGMENT', 'APPEAL', 'SETTLEMENT', 'ON_HOLD', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."case_status" AS ENUM('ACTIVE', 'ON_HOLD', 'CLOSED');--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_ASSIGNMENT_REQUESTED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_ASSIGNMENT_ACCEPTED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_ASSIGNMENT_DECLINED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_ASSIGNMENT_RELEASED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_STAGE_CHANGED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_HEARING_SCHEDULED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_HEARING_UPDATED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_DOCUMENT_UPLOADED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'CASE_CLOSED';--> statement-breakpoint
CREATE TABLE "case_appointment_links" (
	"case_id" uuid NOT NULL,
	"appointment_id" uuid NOT NULL,
	"linked_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "case_appointment_links_case_id_appointment_id_pk" PRIMARY KEY("case_id","appointment_id")
);
--> statement-breakpoint
CREATE TABLE "case_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"case_id" uuid NOT NULL,
	"uploader_user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"storage_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_hearings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"case_id" uuid NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"venue" text,
	"hearing_type" "case_hearing_type" NOT NULL,
	"notes" text,
	"outcome" text
);
--> statement-breakpoint
CREATE TABLE "case_lawyer_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"case_id" uuid NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"invited_by_user_id" uuid NOT NULL,
	"status" "case_assignment_status" DEFAULT 'PENDING' NOT NULL,
	"invited_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	"release_reason" text
);
--> statement-breakpoint
CREATE TABLE "case_stage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"case_id" uuid NOT NULL,
	"from_stage" "case_stage",
	"to_stage" "case_stage" NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"note" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"client_id" uuid NOT NULL,
	"assigned_lawyer_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"case_category" "case_category" NOT NULL,
	"reference_number" text,
	"current_stage" "case_stage" DEFAULT 'INTAKE' NOT NULL,
	"status" "case_status" DEFAULT 'ACTIVE' NOT NULL,
	"assignment_status" "case_assignment_status" DEFAULT 'UNASSIGNED' NOT NULL,
	"estimated_completion_at" timestamp with time zone,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "case_appointment_links" ADD CONSTRAINT "case_appointment_links_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_appointment_links" ADD CONSTRAINT "case_appointment_links_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_documents" ADD CONSTRAINT "case_documents_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_documents" ADD CONSTRAINT "case_documents_uploader_user_id_users_id_fk" FOREIGN KEY ("uploader_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_hearings" ADD CONSTRAINT "case_hearings_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_lawyer_assignments" ADD CONSTRAINT "case_lawyer_assignments_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_lawyer_assignments" ADD CONSTRAINT "case_lawyer_assignments_lawyer_id_lawyer_profiles_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_lawyer_assignments" ADD CONSTRAINT "case_lawyer_assignments_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_stage_events" ADD CONSTRAINT "case_stage_events_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_stage_events" ADD CONSTRAINT "case_stage_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_assigned_lawyer_id_lawyer_profiles_id_fk" FOREIGN KEY ("assigned_lawyer_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_case_appointment_links_appointment_id" ON "case_appointment_links" USING btree ("appointment_id");--> statement-breakpoint
CREATE INDEX "idx_case_documents_case_id" ON "case_documents" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "idx_case_hearings_case_id" ON "case_hearings" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "idx_case_hearings_scheduled_at" ON "case_hearings" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "idx_case_lawyer_assignments_case_id" ON "case_lawyer_assignments" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "idx_case_lawyer_assignments_lawyer_id" ON "case_lawyer_assignments" USING btree ("lawyer_id");--> statement-breakpoint
CREATE INDEX "idx_case_lawyer_assignments_status" ON "case_lawyer_assignments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_case_stage_events_case_id" ON "case_stage_events" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "idx_case_stage_events_occurred_at" ON "case_stage_events" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "idx_cases_client_id" ON "cases" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_cases_assigned_lawyer_id" ON "cases" USING btree ("assigned_lawyer_id");--> statement-breakpoint
CREATE INDEX "idx_cases_status" ON "cases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_cases_current_stage" ON "cases" USING btree ("current_stage");