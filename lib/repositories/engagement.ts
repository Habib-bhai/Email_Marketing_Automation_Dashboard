// lib/repositories/engagement.ts
import { getDb } from '../db/connection'
import { engagementMetrics, type EngagementMetric, type NewEngagementMetric } from '../db/schema/engagementMetrics'
import { campaigns } from '../db/schema/campaigns'
import { eq, and, desc, sql } from 'drizzle-orm'
import { withRetry } from '../utils/retry'

/**
 * Create an engagement metric event
 * Engagement events are append-only (no updates)
 * 
 * If eventType is 'sent', also increments the campaign's emailsSent counter
 * Auto-creates campaign if it doesn't exist
 */
export async function createEngagement(engagementData: Omit<NewEngagementMetric, 'createdAt'>): Promise<EngagementMetric> {
  return withRetry(async () => {
    const db = getDb()
    const timestamp = new Date()

    // Use transaction to ensure atomicity
    const [engagement] = await db.transaction(async (tx) => {
      // If we have a campaignId, ensure the campaign exists (auto-create if needed)
      if (engagementData.campaignId) {
        // Check if campaign exists
        const existingCampaign = await tx
          .select({ id: campaigns.id })
          .from(campaigns)
          .where(eq(campaigns.id, engagementData.campaignId))
          .limit(1)

        // If campaign doesn't exist, create it
        if (existingCampaign.length === 0) {
          await tx.insert(campaigns).values({
            id: engagementData.campaignId,
            name: engagementData.campaignId, // Use ID as name (can be updated later)
            emailsSent: 0,
            repliesReceived: 0,
            opensDetected: 0,
            startedAt: timestamp,
            status: 'Active',
            createdAt: timestamp,
            updatedAt: timestamp
          })
        }
      }

      // Insert engagement event
      const [newEngagement] = await tx.insert(engagementMetrics)
        .values({
          ...engagementData,
          createdAt: timestamp
        })
        .returning()

      // If eventType is 'sent', increment campaign's emailsSent counter
      if (engagementData.eventType === 'sent' && engagementData.campaignId) {
        await tx.update(campaigns)
          .set({
            emailsSent: sql`${campaigns.emailsSent} + 1`,
            updatedAt: timestamp
          })
          .where(eq(campaigns.id, engagementData.campaignId))
      }

      // If eventType is 'follow_up_sent', increment campaign's followUpsSent counter
      if (engagementData.eventType === 'follow_up_sent' && engagementData.campaignId) {
        await tx.update(campaigns)
          .set({
            followUpsSent: sql`${campaigns.followUpsSent} + 1`,
            updatedAt: timestamp
          })
          .where(eq(campaigns.id, engagementData.campaignId))
      }

      // If eventType is 'last_follow_up_sent', increment campaign's lastFollowUpsSent counter
      if (engagementData.eventType === 'last_follow_up_sent' && engagementData.campaignId) {
        await tx.update(campaigns)
          .set({
            lastFollowUpsSent: sql`${campaigns.lastFollowUpsSent} + 1`,
            updatedAt: timestamp
          })
          .where(eq(campaigns.id, engagementData.campaignId))
      }

      // If eventType is 'opened', increment campaign's opensDetected counter
      if (engagementData.eventType === 'opened' && engagementData.campaignId) {
        await tx.update(campaigns)
          .set({
            opensDetected: sql`${campaigns.opensDetected} + 1`,
            updatedAt: timestamp
          })
          .where(eq(campaigns.id, engagementData.campaignId))
      }

      // If eventType is 'replied', increment campaign's repliesReceived counter
      if (engagementData.eventType === 'replied' && engagementData.campaignId) {
        await tx.update(campaigns)
          .set({
            repliesReceived: sql`${campaigns.repliesReceived} + 1`,
            updatedAt: timestamp
          })
          .where(eq(campaigns.id, engagementData.campaignId))
      }

      return [newEngagement]
    })

    return engagement
  })
}

/**
 * Get engagement metrics for a specific campaign
 */
export async function getEngagementsByCampaign(
  campaignId: string,
  limit = 100
): Promise<EngagementMetric[]> {
  return withRetry(async () => {
    const db = getDb()
    return db.select()
      .from(engagementMetrics)
      .where(eq(engagementMetrics.campaignId, campaignId))
      .orderBy(desc(engagementMetrics.occurredAt))
      .limit(limit)
  })
}

/**
 * Get engagement metrics for a specific lead
 */
export async function getEngagementsByLead(
  leadId: string,
  limit = 100
): Promise<EngagementMetric[]> {
  return withRetry(async () => {
    const db = getDb()
    return db.select()
      .from(engagementMetrics)
      .where(eq(engagementMetrics.leadId, leadId))
      .orderBy(desc(engagementMetrics.occurredAt))
      .limit(limit)
  })
}

/**
 * Get engagement metrics for a specific campaign and lead
 */
export async function getEngagementsByCampaignAndLead(
  campaignId: string,
  leadId: string,
  limit = 100
): Promise<EngagementMetric[]> {
  return withRetry(async () => {
    const db = getDb()
    return db.select()
      .from(engagementMetrics)
      .where(
        and(
          eq(engagementMetrics.campaignId, campaignId),
          eq(engagementMetrics.leadId, leadId)
        )
      )
      .orderBy(desc(engagementMetrics.occurredAt))
      .limit(limit)
  })
}
