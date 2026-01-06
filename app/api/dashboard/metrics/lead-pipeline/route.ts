// app/api/dashboard/metrics/lead-pipeline/route.ts
import { NextRequest } from 'next/server'
import { getLeadPipelineMetrics } from '@/lib/repositories/analytics'
import { createSuccessResponse, internalServerError, badRequest } from '@/lib/utils/apiResponse'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/metrics/lead-pipeline
 * Returns lead pipeline metrics with optional filtering
 *
 * Query params:
 * - status: Processed | Unprocessed
 * - type: Brand | Apollo | Cold | Warm
 * - temperature: Hot | Warm | Cold
 * - dateFrom: ISO date string
 * - dateTo: ISO date string
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters from query params
    const filters: any = {}

    const status = searchParams.get('status')
    if (status) filters.status = status

    const type = searchParams.get('type')
    if (type) filters.type = type

    const temperature = searchParams.get('temperature')
    if (temperature) filters.temperature = temperature

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

    const metrics = await getLeadPipelineMetrics(filters)

    return createSuccessResponse(metrics, 'Lead pipeline metrics retrieved successfully')
  } catch (error) {
    logger.api.error('Failed to fetch lead pipeline metrics', error)
    return internalServerError('Failed to fetch lead pipeline metrics')
  }
}
