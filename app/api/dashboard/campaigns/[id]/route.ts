// app/api/dashboard/campaigns/[id]/route.ts
// Use the standard Request type for route handlers so Next's type checks match
import { getCampaignById } from '@/lib/repositories/campaigns'
import { getEngagementsByCampaign } from '@/lib/repositories/engagement'
import { createSuccessResponse, internalServerError, notFound } from '@/lib/utils/apiResponse'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/campaigns/[id]
 * Returns campaign details with engagement metrics and event history
 * 
 * @param params - { id: string }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get campaign details
    const campaign = await getCampaignById(id)

    if (!campaign) {
      return notFound(`Campaign with ID '${id}' not found`)
    }

    // Get engagement events for this campaign
    const engagements = await getEngagementsByCampaign(id, 1000) // Get all engagements

    // Calculate additional metrics from engagements
    const eventTypeCounts = engagements.reduce((acc, eng) => {
      acc[eng.eventType] = (acc[eng.eventType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get unique leads
    const uniqueLeads = new Set(
      engagements
        .filter(e => e.leadId)
        .map(e => e.leadId)
    ).size

    // Calculate timeline data (daily breakdown)
    const timeline = engagements.reduce((acc, eng) => {
      const date = new Date(eng.occurredAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, sent: 0, opened: 0, replied: 0, follow_ups: 0, last_follow_ups: 0 }
      }
      
      if (eng.eventType === 'sent') acc[date].sent++
      else if (eng.eventType === 'opened') acc[date].opened++
      else if (eng.eventType === 'replied') acc[date].replied++
      else if (eng.eventType === 'follow_up_sent') acc[date].follow_ups++
      else if (eng.eventType === 'last_follow_up_sent') acc[date].last_follow_ups++
      
      return acc
    }, {} as Record<string, any>)

    const result = {
      campaign: {
        ...campaign,
        // Add calculated rates
        openRate: campaign.emailsSent > 0 
          ? ((campaign.opensDetected / campaign.emailsSent) * 100).toFixed(1)
          : '0.0',
        replyRate: campaign.emailsSent > 0
          ? ((campaign.repliesReceived / campaign.emailsSent) * 100).toFixed(1)
          : '0.0',
        followUpRate: campaign.emailsSent > 0
          ? ((campaign.followUpsSent / campaign.emailsSent) * 100).toFixed(1)
          : '0.0'
      },
      metrics: {
        totalEvents: engagements.length,
        uniqueLeads,
        eventTypeCounts,
        averageEventsPerLead: uniqueLeads > 0 
          ? (engagements.length / uniqueLeads).toFixed(1)
          : '0.0'
      },
      timeline: Object.values(timeline).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
      recentEngagements: engagements
        .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
        .slice(0, 50) // Latest 50 events
    }

    return createSuccessResponse(result, 'Campaign details retrieved successfully', {
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    logger.api.error('Failed to fetch campaign details', error)
    return internalServerError('Failed to fetch campaign details')
  }
}
