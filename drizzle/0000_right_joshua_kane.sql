CREATE TYPE "public"."lead_status" AS ENUM('Processed', 'Unprocessed');--> statement-breakpoint
CREATE TYPE "public"."lead_temperature" AS ENUM('Hot', 'Warm', 'Cold');--> statement-breakpoint
CREATE TYPE "public"."lead_type" AS ENUM('Brand', 'Apollo', 'Cold', 'Warm');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('Draft', 'Active', 'Paused', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('sent', 'opened', 'replied', 'bounced', 'clicked', 'unsubscribed');--> statement-breakpoint
CREATE TYPE "public"."data_source_type" AS ENUM('n8n_workflow', 'api_integration', 'manual_upload');--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "lead_status" DEFAULT 'Unprocessed' NOT NULL,
	"type" "lead_type" NOT NULL,
	"temperature" "lead_temperature" NOT NULL,
	"source" varchar(255) NOT NULL,
	"email" varchar(255),
	"name" varchar(255),
	"company" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"emails_sent" integer DEFAULT 0 NOT NULL,
	"replies_received" integer DEFAULT 0 NOT NULL,
	"opens_detected" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp,
	"status" "campaign_status" DEFAULT 'Active' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_lead_associations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "campaign_lead_unique" UNIQUE("lead_id","campaign_id")
);
--> statement-breakpoint
CREATE TABLE "engagement_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"lead_id" uuid,
	"event_type" "event_type" NOT NULL,
	"occurred_at" timestamp NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingestion_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" uuid,
	"payload" jsonb NOT NULL,
	"validation_result" jsonb,
	"success" boolean NOT NULL,
	"error_details" text,
	"source_ip" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "data_source_type" NOT NULL,
	"n8n_workflow_id" varchar(255),
	"config" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaign_lead_associations" ADD CONSTRAINT "campaign_lead_associations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_lead_associations" ADD CONSTRAINT "campaign_lead_associations_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagement_metrics" ADD CONSTRAINT "engagement_metrics_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagement_metrics" ADD CONSTRAINT "engagement_metrics_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_type_idx" ON "leads" USING btree ("type");--> statement-breakpoint
CREATE INDEX "leads_temperature_idx" ON "leads" USING btree ("temperature");--> statement-breakpoint
CREATE INDEX "leads_source_idx" ON "leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "campaigns_name_idx" ON "campaigns" USING btree ("name");--> statement-breakpoint
CREATE INDEX "campaigns_status_idx" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "campaigns_started_at_idx" ON "campaigns" USING btree ("started_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "assoc_lead_id_idx" ON "campaign_lead_associations" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "assoc_campaign_id_idx" ON "campaign_lead_associations" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "assoc_joined_at_idx" ON "campaign_lead_associations" USING btree ("joined_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "engagement_campaign_id_idx" ON "engagement_metrics" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "engagement_lead_id_idx" ON "engagement_metrics" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "engagement_event_type_idx" ON "engagement_metrics" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "engagement_occurred_at_idx" ON "engagement_metrics" USING btree ("occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "log_entity_type_idx" ON "ingestion_logs" USING btree ("entity_type");--> statement-breakpoint
CREATE INDEX "log_success_idx" ON "ingestion_logs" USING btree ("success");--> statement-breakpoint
CREATE INDEX "log_created_at_idx" ON "ingestion_logs" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "log_source_ip_idx" ON "ingestion_logs" USING btree ("source_ip");--> statement-breakpoint
CREATE INDEX "data_source_name_idx" ON "data_sources" USING btree ("name");--> statement-breakpoint
CREATE INDEX "data_source_type_idx" ON "data_sources" USING btree ("type");--> statement-breakpoint
CREATE INDEX "data_source_is_active_idx" ON "data_sources" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "data_source_n8n_workflow_id_idx" ON "data_sources" USING btree ("n8n_workflow_id");