// app/api/dashboard/metrics/overview/route.ts
import { NextRequest } from 'next/server'
import { getDashboardOverview } from '@/lib/repositories/analytics'
import { createSuccessResponse, internalServerError } from '@/lib/utils/apiResponse'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/metrics/overview
 * Returns high-level dashboard metrics
 */
export async function GET(request: NextRequest) {
  try {
    const metrics = await getDashboardOverview()

    return createSuccessResponse(metrics, 'Dashboard overview retrieved successfully')
  } catch (error) {
    logger.api.error('Failed to fetch dashboard overview', error)
    return internalServerError('Failed to fetch dashboard overview')
  }
}
