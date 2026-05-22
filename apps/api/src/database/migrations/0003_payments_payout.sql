ALTER TABLE "payments" ADD COLUMN "payout_processed_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_payments_payout_processed_at" ON "payments" USING btree ("payout_processed_at");
