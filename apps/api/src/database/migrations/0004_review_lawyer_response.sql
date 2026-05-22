ALTER TABLE "reviews" ADD COLUMN "lawyer_response" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "lawyer_responded_at" timestamp with time zone;
