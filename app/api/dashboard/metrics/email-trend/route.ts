// app/api/dashboard/metrics/email-trend/route.ts
import { NextRequest } from 'next/server'
import { getEmailEngagementTrend } from '@/lib/repositories/analytics'
import { createSuccessResponse, internalServerError } from '@/lib/utils/apiResponse'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/dashboard/metrics/email-trend
 * Returns email engagement trend data for charts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    
    const trendData = await getEmailEngagementTrend(days)
    
    console.log('📈 API Response - Email Trend:', JSON.stringify(trendData, null, 2))

    const response = createSuccessResponse(trendData, 'Email trend data retrieved successfully')
    
    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    logger.api.error('Failed to fetch email trend data', error)
    return internalServerError('Failed to fetch email trend data')
  }
}
