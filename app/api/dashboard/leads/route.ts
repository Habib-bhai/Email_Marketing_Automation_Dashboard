// app/api/dashboard/leads/route.ts
import { NextRequest } from 'next/server'
import { getLeads } from '@/lib/repositories/leads'
import { createSuccessResponse, internalServerError, badRequest } from '@/lib/utils/apiResponse'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/leads
 * Returns paginated list of leads with optional filtering
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - status: Processed | Unprocessed
 * - type: Brand | Apollo | Cold | Warm
 * - temperature: Hot | Warm | Cold
 * - source: string
 * - dateFrom: ISO date string
 * - dateTo: ISO date string
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
    const filters: any = {}

    const status = searchParams.get('status')
    if (status) filters.status = status

    const type = searchParams.get('type')
    if (type) filters.type = type

    const temperature = searchParams.get('temperature')
    if (temperature) filters.temperature = temperature

    const source = searchParams.get('source')
    if (source) filters.source = source

    const dateFrom = searchParams.get('dateFrom')
    if (dateFrom) {
      try {
        filters.dateFrom = new Date(dateFrom)
      } catch {
        return badRequest('Invalid dateFrom format')
      }
    }

    const dateTo = searchParams.get('dateTo')
    if (dateTo) {
      try {
        filters.dateTo = new Date(dateTo)
      } catch {
        return badRequest('Invalid dateTo format')
      }
    }

    const result = await getLeads({ page, limit }, filters)

    return createSuccessResponse(result, 'Leads retrieved successfully', {
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    logger.api.error('Failed to fetch leads', error)
    return internalServerError('Failed to fetch leads')
  }
}
