// app/api/dashboard/campaigns/route.ts
import { NextRequest } from 'next/server'
import { getCampaigns } from '@/lib/repositories/campaigns'
import { createSuccessResponse, internalServerError, badRequest } from '@/lib/utils/apiResponse'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/campaigns
 * Returns paginated list of campaigns with optional filtering
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - status: Draft | Active | Paused | Completed
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)

    if (page < 1) {
      return badRequest('Page must be >= 1')
    }

    if (limit < 1) {
      return badRequest('Limit must be >= 1')
    }

    // Parse filters
    const filters: Record<string, string> = {}
    const status = searchParams.get('status')
    if (status) filters.status = status

    const result = await getCampaigns({ page, limit }, filters)

    return createSuccessResponse(result, 'Campaigns retrieved successfully', {
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    logger.api.error('Failed to fetch campaigns', error)
    return internalServerError('Failed to fetch campaigns')
  }
}
