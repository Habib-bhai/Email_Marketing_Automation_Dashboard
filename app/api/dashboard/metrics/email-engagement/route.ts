// app/api/dashboard/metrics/email-engagement/route.ts
import { NextRequest } from 'next/server'
import { getEmailEngagementMetrics } from '@/lib/repositories/analytics'
import { createSuccessResponse, internalServerError } from '@/lib/utils/apiResponse'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/metrics/email-engagement
 * Returns email engagement metrics (reply rate, open rate, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    const metrics = await getEmailEngagementMetrics()
    
    // Debug logging
    console.log('📧 API Response - Email Engagement:', JSON.stringify(metrics, null, 2))

    const response = createSuccessResponse(metrics, 'Email engagement metrics retrieved successfully')
    
    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    logger.api.error('Failed to fetch email engagement metrics', error)
    return internalServerError('Failed to fetch email engagement metrics')
  }
}
