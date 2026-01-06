ALTER TABLE "engagement_metrics" DROP CONSTRAINT "engagement_metrics_campaign_id_campaigns_id_fk";
--> statement-breakpoint
ALTER TABLE "engagement_metrics" DROP CONSTRAINT "engagement_metrics_lead_id_leads_id_fk";
--> statement-breakpoint
ALTER TABLE "engagement_metrics" ALTER COLUMN "campaign_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "engagement_metrics" ALTER COLUMN "lead_id" SET DATA TYPE varchar(255);