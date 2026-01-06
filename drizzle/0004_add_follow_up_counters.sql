-- Migration: Add follow-up counters to campaigns table
-- Created: 2026-01-05
-- Purpose: Track follow-up and last follow-up emails separately from regular sends

-- Add new counter columns
ALTER TABLE "campaigns" 
ADD COLUMN "follow_ups_sent" integer NOT NULL DEFAULT 0,
ADD COLUMN "last_follow_ups_sent" integer NOT NULL DEFAULT 0;

-- Add indexes for the new columns (optional, for query performance)
CREATE INDEX IF NOT EXISTS "campaigns_follow_ups_sent_idx" ON "campaigns" ("follow_ups_sent");
CREATE INDEX IF NOT EXISTS "campaigns_last_follow_ups_sent_idx" ON "campaigns" ("last_follow_ups_sent");
