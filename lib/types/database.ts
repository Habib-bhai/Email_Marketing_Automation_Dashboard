/**
 * Database-specific types
 * Extends Drizzle inferred types with additional business logic types
 */

import type {
  Lead,
  Campaign,
  CampaignLeadAssociation,
  EngagementMetric,
  IngestionLog,
  DataSource
} from '../db/schema'

// Re-export Drizzle types for convenience
export type { Lead, Campaign, CampaignLeadAssociation, EngagementMetric, IngestionLog, DataSource }

/**
 * Query result types with relationships
 */

export interface LeadWithCampaigns extends Lead {
  campaigns: Array<{
    campaign: Campaign
    association: CampaignLeadAssociation
  }>
}

export interface CampaignWithLeads extends Campaign {
  leads: Array<{
    lead: Lead
    association: CampaignLeadAssociation
  }>
  leadCount: number
}

export interface CampaignWithMetrics extends Campaign {
  replyRate: number
  openRate: number
  leadCount: number
}

/**
 * Aggregated metrics types
 */

export interface LeadStatusCounts {
  Processed: number
  Unprocessed: number
}

export interface LeadTypeCounts {
  Brand: number
  Apollo: number
  Cold: number
  Warm: number
}

export interface LeadTemperatureCounts {
  Hot: number
  Warm: number
  Cold: number
}

export interface EmailMetricsAggregate {
  totalEmailsSent: number
  totalOpensDetected: number
  totalRepliesReceived: number
  replyRate: number
  openRate: number
}

/**
 * Repository method options
 */

export interface FindManyOptions {
  limit?: number
  offset?: number
  orderBy?: 'createdAt' | 'updatedAt' | 'name'
  orderDirection?: 'asc' | 'desc'
}

export interface LeadFindOptions extends FindManyOptions {
  status?: Lead['status']
  type?: Lead['type']
  temperature?: Lead['temperature']
  search?: string
}

export interface CampaignFindOptions extends FindManyOptions {
  status?: Campaign['status']
  isActive?: boolean
}
