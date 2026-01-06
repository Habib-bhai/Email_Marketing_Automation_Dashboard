-- Migration: Convert campaigns.id from UUID to varchar(255) to support custom IDs from n8n
-- Also update campaign_lead_associations.campaign_id to match

-- Step 1: Drop foreign key constraint from campaign_lead_associations
ALTER TABLE "campaign_lead_associations" DROP CONSTRAINT IF EXISTS "campaign_lead_associations_campaign_id_campaigns_id_fk";

-- Step 2: Convert campaigns.id to varchar(255)
ALTER TABLE "campaigns" ALTER COLUMN "id" SET DATA TYPE varchar(255);
ALTER TABLE "campaigns" ALTER COLUMN "id" DROP DEFAULT;

-- Step 3: Convert campaign_lead_associations.campaign_id to varchar(255)
ALTER TABLE "campaign_lead_associations" ALTER COLUMN "campaign_id" SET DATA TYPE varchar(255);

-- Step 4: Re-add foreign key constraint with varchar type
ALTER TABLE "campaign_lead_associations" 
  ADD CONSTRAINT "campaign_lead_associations_campaign_id_campaigns_id_fk" 
  FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE;
