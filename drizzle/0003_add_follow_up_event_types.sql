-- Migration: Add follow-up event types to event_type enum
-- Date: 2026-01-05
-- Description: Adds 'follow_up_sent' and 'last_follow_up_sent' to the event_type enum

-- Add new values to the event_type enum
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'follow_up_sent';
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'last_follow_up_sent';
