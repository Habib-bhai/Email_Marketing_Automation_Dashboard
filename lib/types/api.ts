/**
 * API Contract Types for Dashboard & N8N Integration
 *
 * These types define the contract between:
 * 1. N8N workflows → Ingestion API
 * 2. Dashboard UI → Dashboard API
 *
 * Generated from: openapi.yaml
 * Feature: 002-dashboard-n8n-integration
 */

// ============================================================================
// INGESTION API TYPES (N8N → Backend)
// ============================================================================

/**
 * Lead status enumeration
 */
export type LeadStatus = 'Processed' | 'Unprocessed'

/**
 * Lead type categorization
 */
export type LeadType = 'Brand' | 'Apollo' | 'Cold' | 'Warm'

/**
 * Lead temperature (engagement level)
 */
export type LeadTemperature = 'Hot' | 'Warm' | 'Cold'

/**
 * Campaign status lifecycle
 */
export type CampaignStatus = 'Draft' | 'Active' | 'Paused' | 'Completed'

/**
 * Engagement event types
 */
export type EventType = 'sent' | 'opened' | 'replied' | 'bounced' | 'clicked' | 'unsubscribed'

/**
 * Lead data structure for ingestion
 */
export interface LeadData {
  id: string // UUID
  status: LeadStatus
  type: LeadType
  temperature: LeadTemperature
  source: string
  email?: string
  name?: string
  company?: string
  metadata?: Record<string, unknown>
}

/**
 * Campaign data structure for ingestion
 */
export interface CampaignData {
  id: string // UUID
  name: string
  emailsSent: number
  repliesReceived: number
  opensDetected: number
  startedAt: string // ISO 8601 datetime
  endedAt?: string | null // ISO 8601 datetime
  status?: CampaignStatus
  metadata?: Record<string, unknown>
}

/**
 * Engagement event data structure
 */
export interface EngagementData {
  campaignId: string // UUID
  leadId?: string | null // UUID, optional for aggregate events
  eventType: EventType
  timestamp: string // ISO 8601 datetime
  metadata?: Record<string, unknown>
}

/**
 * Ingestion payload (discriminated union)
 */
export type IngestionPayload =
  | { type: 'lead'; data: LeadData }
  | { type: 'campaign'; data: CampaignData }
  | { type: 'engagement'; data: EngagementData }

/**
 * Successful ingestion response
 */
export interface IngestionSuccessResponse {
  success: true
  message: string
  entityType: string
  entityId: string
  timestamp: string // ISO 8601
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  field: string
  message: string
  code: string
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse {
  error: 'Validation Error'
  message: string
  details: ValidationErrorDetail[]
}

/**
 * Rate limit error response
 */
export interface RateLimitErrorResponse {
  error: 'Too Many Requests'
  message: string
  limit: number
  remaining: number
  reset: number // Unix timestamp in milliseconds
}

/**
 * Generic error response
 */
export interface ErrorResponse {
  error: string
  message: string
  [key: string]: unknown
}

/**
 * Ingestion API response (union of all possible responses)
 */
export type IngestionResponse =
  | IngestionSuccessResponse
  | ValidationErrorResponse
  | RateLimitErrorResponse
  | ErrorResponse

// ============================================================================
// DASHBOARD API TYPES (Backend → Dashboard UI)
// ============================================================================

/**
 * Dashboard overview metrics
 */
export interface DashboardOverviewResponse {
  totalLeads: number
  activeCampaigns: number
  replyRate: number // Percentage
  openRate: number // Percentage
  lastUpdated: string // ISO 8601
}

/**
 * Lead pipeline metrics breakdown
 */
export interface LeadPipelineResponse {
  totalLeads: number
  byStatus: {
    Processed: number
    Unprocessed: number
  }
  byType: {
    Brand: number
    Apollo: number
    Cold: number
    Warm: number
  }
  byTemperature: {
    Hot: number
    Warm: number
    Cold: number
  }
  lastUpdated: string // ISO 8601
}

/**
 * Email engagement metrics
 */
export interface EmailEngagementResponse {
  emailsSent: number
  opensDetected: number
  repliesReceived: number
  replyRate: number // Percentage
  openRate: number // Percentage
  trend: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
  lastUpdated: string // ISO 8601
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * Campaign with computed metrics
 */
export interface CampaignWithMetrics extends CampaignData {
  replyRate: number
  openRate: number
  leadCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Campaigns list response
 */
export interface CampaignsListResponse {
  campaigns: CampaignWithMetrics[]
  pagination: PaginationMeta
}

/**
 * Lead with associations
 */
export interface LeadWithAssociations extends LeadData {
  campaigns: {
    id: string
    name: string
    joinedAt: string
  }[]
  lastEngagement?: {
    eventType: EventType
    occurredAt: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Leads list response
 */
export interface LeadsListResponse {
  leads: LeadWithAssociations[]
  pagination: PaginationMeta
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

/**
 * Lead pipeline filters
 */
export interface LeadPipelineFilters {
  startDate?: string // ISO 8601
  endDate?: string // ISO 8601
  status?: LeadStatus
}

/**
 * Email engagement filters
 */
export interface EmailEngagementFilters {
  campaignId?: string // UUID
  startDate?: string // ISO 8601
  endDate?: string // ISO 8601
}

/**
 * Leads list filters
 */
export interface LeadsListFilters {
  page?: number
  limit?: number
  status?: LeadStatus
  type?: LeadType
  temperature?: LeadTemperature
  search?: string
}

/**
 * Campaigns list filters
 */
export interface CampaignsListFilters {
  page?: number
  limit?: number
  status?: CampaignStatus
}

// ============================================================================
// INTERNAL REPOSITORY TYPES
// ============================================================================

/**
 * Database lead entity (as stored in DB)
 */
export interface DbLead {
  id: string
  status: LeadStatus
  type: LeadType
  temperature: LeadTemperature
  source: string
  email: string | null
  name: string | null
  company: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Database campaign entity
 */
export interface DbCampaign {
  id: string
  name: string
  emailsSent: number
  repliesReceived: number
  opensDetected: number
  startedAt: Date
  endedAt: Date | null
  status: CampaignStatus
  metadata: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Database campaign-lead association
 */
export interface DbCampaignLeadAssociation {
  id: string
  leadId: string
  campaignId: string
  joinedAt: Date
  metadata: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Database engagement metric
 */
export interface DbEngagementMetric {
  id: string
  campaignId: string
  leadId: string | null
  eventType: EventType
  occurredAt: Date
  metadata: Record<string, unknown> | null
  createdAt: Date
}

/**
 * Database ingestion log
 */
export interface DbIngestionLog {
  id: string
  entityType: string
  entityId: string | null
  payload: Record<string, unknown>
  validationResult: Record<string, unknown> | null
  success: boolean
  errorDetails: string | null
  sourceIp: string | null
  createdAt: Date
}

/**
 * Database data source
 */
export interface DbDataSource {
  id: string
  name: string
  type: 'n8n_workflow' | 'api_integration' | 'manual_upload'
  n8nWorkflowId: string | null
  config: Record<string, unknown> | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * API success response wrapper
 */
export interface ApiSuccess<T> {
  success: true
  data: T
  timestamp: string
}

/**
 * API error response wrapper
 */
export interface ApiError {
  success: false
  error: string
  message: string
  details?: unknown
}

/**
 * Generic API response
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError

/**
 * Rate limit headers
 */
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string
  'X-RateLimit-Remaining': string
  'X-RateLimit-Reset': string
  'Retry-After'?: string
}

/**
 * Chart data point (for frontend charting)
 */
export interface ChartDataPoint {
  label: string
  value: number
  timestamp?: string
  metadata?: Record<string, unknown>
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  date: string // ISO 8601 date
  value: number
  label?: string
}
