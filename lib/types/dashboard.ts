// TypeScript type definitions for KPI Dashboard
// Based on data-model.md from the plan

// ============================================================================
// Core Metric Types
// ============================================================================

export interface DashboardMetrics {
  totalLeads: number
  replyRate: number // percentage 0-100
  enrichmentSuccess: number // percentage 0-100
  activeWorkflows: number
  lastUpdated: string // ISO timestamp
}

export type LeadType = 'Brand' | 'Apollo' | 'Cold' | 'Warm'

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold'

export interface LeadPipelineMetrics {
  leadsByType: Record<LeadType, number>
  leadsByTemperature: Record<LeadTemperature, number>
  leadsBySource: Record<string, number>
  processedVsUnprocessed: {
    processed: number
    unprocessed: number
  }
}

export interface EmailEngagementMetrics {
  emailsSent: number
  replyRate: number // percentage
  openRate: number // percentage
  averageResponseTime: number // hours
  trendData: Array<{
    date: string // ISO date (YYYY-MM-DD)
    value: number
  }>
}

export interface AutomationHealthMetrics {
  enrichmentSuccessRate: number // percentage
  workflowSuccessRate: number // percentage
  averageRetryCount: number
  failedOperations: number
}

// ============================================================================
// Filter Types
// ============================================================================

export type DateRange = '7d' | '30d' | '90d' | 'all'

export interface LeadFilters {
  type?: LeadType
  temperature?: LeadTemperature
  source?: string
  processed?: boolean
}

export interface DateRangeFilter {
  startDate?: string // ISO date
  endDate?: string // ISO date
  range?: DateRange
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: {
    code: string
    message: string
  }
  meta?: {
    lastUpdated: string
    cached: boolean
    cacheExpiry?: string
  }
}

// ============================================================================
// Dashboard Store Types
// ============================================================================

export type DashboardTab = 'overview' | 'pipeline' | 'email' | 'health'

export interface DashboardStore {
  // UI State
  activeTab: DashboardTab
  isLoading: boolean
  error: string | null

  // Filter State
  dateRange: DateRange
  leadFilters: LeadFilters

  // Data State
  metrics: DashboardMetrics | null
  leadPipeline: LeadPipelineMetrics | null
  emailMetrics: EmailEngagementMetrics | null
  automationHealth: AutomationHealthMetrics | null

  // Actions
  setActiveTab: (tab: DashboardTab) => void
  setDateRange: (range: DateRange) => void
  setLeadFilters: (filters: LeadFilters) => void
  refreshData: () => Promise<void>
  clearError: () => void
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface SummaryCardProps {
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
}

export interface ChartProps {
  data: Array<Record<string, unknown>>
  width?: number
  height?: number
  loading?: boolean
  error?: string | null
}

export interface TabItem {
  id: DashboardTab
  label: string
  icon?: React.ReactNode
}

export interface MetricFilterProps {
  filters: LeadFilters
  onFilterChange: (filters: LeadFilters) => void
}

export interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export interface WarningIndicatorProps {
  threshold: number
  currentValue: number
  label: string
}
