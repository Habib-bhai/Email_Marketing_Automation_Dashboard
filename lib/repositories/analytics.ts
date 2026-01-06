// lib/repositories/analytics.ts
import { getDb } from '../db/connection'
import { leads, campaigns, engagementMetrics } from '../db/schema'
import { sql, eq, and, gte, lte, count, sum, desc } from 'drizzle-orm'
import { withRetry } from '../utils/retry'

export interface LeadPipelineMetrics {
  totalLeads: number
  byStatus: Record<string, number>
  byType: Record<string, number>
  byTemperature: Record<string, number>
  lastUpdated: string
}

export interface EmailEngagementMetrics {
  totalEmailsSent: number
  totalRepliesReceived: number
  totalOpensDetected: number
  totalFollowUpsSent: number
  totalLastFollowUpsSent: number
  replyRate: number
  openRate: number
  averageTimeToResponse?: number
  lastUpdated: string
}

export interface DashboardOverview {
  totalLeads: number
  processedLeads: number
  unprocessedLeads: number
  activeCampaigns: number
  totalEmailsSent: number
  replyRate: number
  openRate: number
  lastUpdated: string
}

export interface LeadPipelineFilters {
  status?: 'Processed' | 'Unprocessed'
  type?: 'Brand' | 'Apollo' | 'Cold' | 'Warm'
  temperature?: 'Hot' | 'Warm' | 'Cold'
  dateFrom?: Date
  dateTo?: Date
}

/**
 * Get lead pipeline metrics with optional filtering
 * Aggregates leads by status, type, and temperature
 */
export async function getLeadPipelineMetrics(
  filters?: LeadPipelineFilters
): Promise<LeadPipelineMetrics> {
  return withRetry(async () => {
    const db = getDb()
    // Build WHERE conditions
    const conditions = []
    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status))
    }
    if (filters?.type) {
      conditions.push(eq(leads.type, filters.type))
    }
    if (filters?.temperature) {
      conditions.push(eq(leads.temperature, filters.temperature))
    }
    if (filters?.dateFrom) {
      conditions.push(gte(leads.createdAt, filters.dateFrom))
    }
    if (filters?.dateTo) {
      conditions.push(lte(leads.createdAt, filters.dateTo))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get total leads
    const [totalResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(whereClause)

    // Get breakdown by status
    const statusResults = await db
      .select({
        status: leads.status,
        count: count()
      })
      .from(leads)
      .where(whereClause)
      .groupBy(leads.status)

    // Get breakdown by type
    const typeResults = await db
      .select({
        type: leads.type,
        count: count()
      })
      .from(leads)
      .where(whereClause)
      .groupBy(leads.type)

    // Get breakdown by temperature
    const temperatureResults = await db
      .select({
        temperature: leads.temperature,
        count: count()
      })
      .from(leads)
      .where(whereClause)
      .groupBy(leads.temperature)

    return {
      totalLeads: totalResult.count,
      byStatus: statusResults.reduce((acc: Record<string, number>, row: any) => {
        acc[row.status] = row.count
        return acc
      }, {} as Record<string, number>),
      byType: typeResults.reduce((acc: Record<string, number>, row: any) => {
        acc[row.type] = row.count
        return acc
      }, {} as Record<string, number>),
      byTemperature: temperatureResults.reduce((acc: Record<string, number>, row: any) => {
        acc[row.temperature] = row.count
        return acc
      }, {} as Record<string, number>),
      lastUpdated: new Date().toISOString()
    }
  })
}

/**
 * Get email engagement metrics across all campaigns
 * Calculates reply rate and open rate
 */
export async function getEmailEngagementMetrics(): Promise<EmailEngagementMetrics> {
  return withRetry(async () => {
    const db = getDb()
    // Get aggregated campaign metrics
    const [metricsResult] = await db
      .select({
        totalEmailsSent: sum(campaigns.emailsSent),
        totalRepliesReceived: sum(campaigns.repliesReceived),
        totalOpensDetected: sum(campaigns.opensDetected),
        totalFollowUpsSent: sum(campaigns.followUpsSent),
        totalLastFollowUpsSent: sum(campaigns.lastFollowUpsSent)
      })
      .from(campaigns)

    const totalEmailsSent = Number(metricsResult.totalEmailsSent) || 0
    const totalRepliesReceived = Number(metricsResult.totalRepliesReceived) || 0
    const totalOpensDetected = Number(metricsResult.totalOpensDetected) || 0
    const totalFollowUpsSent = Number(metricsResult.totalFollowUpsSent) || 0
    const totalLastFollowUpsSent = Number(metricsResult.totalLastFollowUpsSent) || 0

    // Calculate rates
    const replyRate = totalEmailsSent > 0
      ? (totalRepliesReceived / totalEmailsSent) * 100
      : 0

    const openRate = totalEmailsSent > 0
      ? (totalOpensDetected / totalEmailsSent) * 100
      : 0

    return {
      totalEmailsSent,
      totalRepliesReceived,
      totalOpensDetected,
      totalFollowUpsSent,
      totalLastFollowUpsSent,
      replyRate: Math.round(replyRate * 10) / 10, // Round to 1 decimal
      openRate: Math.round(openRate * 10) / 10,
      lastUpdated: new Date().toISOString()
    }
  })
}

/**
 * Get email engagement trend data for charts
 * Returns daily aggregated metrics for the last N days
 */
export async function getEmailEngagementTrend(days: number = 7): Promise<Array<{
  date: string
  sent: number
  opened: number
  replied: number
}>> {
  return withRetry(async () => {
    const db = getDb()
    
    // Get engagement events from the last N days, grouped by date and event type
    const results = await db
      .select({
        date: sql<string>`DATE(${engagementMetrics.occurredAt})`,
        eventType: engagementMetrics.eventType,
        count: count()
      })
      .from(engagementMetrics)
      .where(sql`${engagementMetrics.occurredAt} >= NOW() - INTERVAL '${sql.raw(days.toString())} days'`)
      .groupBy(sql`DATE(${engagementMetrics.occurredAt})`, engagementMetrics.eventType)
      .orderBy(sql`DATE(${engagementMetrics.occurredAt})`)

    // Transform into chart-friendly format
    const dateMap = new Map<string, { sent: number; opened: number; replied: number }>()
    
    // Initialize all dates in the range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dateMap.set(dateStr, { sent: 0, opened: 0, replied: 0 })
    }
    
    // Fill in actual data
    results.forEach((row: any) => {
      const dateStr = row.date
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, { sent: 0, opened: 0, replied: 0 })
      }
      const dayData = dateMap.get(dateStr)!
      
      if (row.eventType === 'sent') {
        dayData.sent = Number(row.count)
      } else if (row.eventType === 'opened') {
        dayData.opened = Number(row.count)
      } else if (row.eventType === 'replied') {
        dayData.replied = Number(row.count)
      }
    })
    
    // Convert map to array
    return Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      ...data
    }))
  })
}

/**
 * Get dashboard overview metrics
 * Provides top-level summary for dashboard
 */
export async function getDashboardOverview(): Promise<DashboardOverview> {
  return withRetry(async () => {
    const db = getDb()
    // Get lead counts
    const [leadCounts] = await db
      .select({
        total: count(),
        processed: count(sql`CASE WHEN ${leads.status} = 'Processed' THEN 1 END`),
        unprocessed: count(sql`CASE WHEN ${leads.status} = 'Unprocessed' THEN 1 END`)
      })
      .from(leads)

    // Get active campaigns count
    const [campaignCount] = await db
      .select({ count: count() })
      .from(campaigns)
      .where(eq(campaigns.status, 'Active'))

    // Get email engagement metrics
    const emailMetrics = await getEmailEngagementMetrics()

    return {
      totalLeads: leadCounts.total,
      processedLeads: leadCounts.processed || 0,
      unprocessedLeads: leadCounts.unprocessed || 0,
      activeCampaigns: campaignCount.count,
      totalEmailsSent: emailMetrics.totalEmailsSent,
      replyRate: emailMetrics.replyRate,
      openRate: emailMetrics.openRate,
      lastUpdated: new Date().toISOString()
    }
  })
}
