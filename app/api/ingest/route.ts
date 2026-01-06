// app/api/ingest/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { composeMiddleware } from '@/lib/middleware/compose'
import { checkPayloadSize } from '@/lib/middleware/sizeLimit'
import { rateLimitMiddleware } from '@/lib/middleware/ratelimit'
import { validatePayload } from '@/lib/middleware/validate'
import { ingestionPayloadSchema, type IngestionPayload } from '@/lib/validations/ingestion'
import { upsertLead } from '@/lib/repositories/leads'
import { upsertCampaign } from '@/lib/repositories/campaigns'
import { createEngagement } from '@/lib/repositories/engagement'
import { logIngestion } from '@/lib/repositories/ingestionLogs'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * POST /api/ingest
 * Ingestion endpoint for N8N workflows
 *
 * Accepts lead, campaign, and engagement data
 * Applies middleware: size check, rate limiting, validation
 * Returns 200 on success, 400/413/429/500 on error
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  // Note: `NextRequest` does not expose a typed `ip` property across all runtimes.
  // Prefer forwarded headers and fall back to 'unknown'.
  const sourceIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')?.trim()
    ?? 'unknown'

  try {
    // Log incoming request for debugging
    const bodyText = await request.text()
    console.log('[Ingestion] Received payload:', bodyText)
    
    // Recreate request with the body (since we consumed it)
    const newRequest = new NextRequest(request.url, {
      method: request.method,
      headers: request.headers,
      body: bodyText
    })

    // Compose middleware pipeline
    const middleware = composeMiddleware(
      checkPayloadSize,
      rateLimitMiddleware,
      validatePayload(ingestionPayloadSchema)
    )

    // Run middleware
    const result = await middleware(newRequest)

    // If middleware returns NextResponse, it's an error response
    if (result instanceof NextResponse) {
      // Log validation errors for debugging
      const errorBody = await result.json().catch(() => ({}))
      console.error('[Ingestion] Validation failed:', JSON.stringify(errorBody, null, 2))
      return result
    }

    // Extract validated payload
    const payload = result.data as IngestionPayload
    const rateLimitInfo = {
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset
    }

    // Process payload based on type
    let entityId: string | undefined
    const entityType: string = payload.type

    try {
      switch (payload.type) {
        case 'lead': {
          const lead = await upsertLead(payload.data)
          entityId = lead.id
          logger.ingestion.success('lead', lead.id, Date.now() - startTime)
          console.log(lead.id)
          break
        }

        case 'campaign': {
          const campaign = await upsertCampaign({
            ...payload.data,
            startedAt: payload.data.startedAt ? new Date(payload.data.startedAt as any) : new Date(),
            endedAt: payload.data.endedAt ? new Date(payload.data.endedAt as any) : undefined,
          })
          entityId = campaign.id
          logger.ingestion.success('campaign', campaign.id, Date.now() - startTime)
          break
        }

        case 'engagement': {
          const occurredAtRaw = (payload.data as any).occurredAt ?? (payload.data as any).timestamp
          const engagement = await createEngagement({
            ...payload.data,
            occurredAt: occurredAtRaw ? new Date(occurredAtRaw) : new Date(),
          } as any)
          entityId = engagement.id
          logger.ingestion.success('engagement', engagement.id, Date.now() - startTime)
          break
        }

        default:
          throw new Error(`Unknown entity type: ${(payload as any).type}`)
      }

      // Log successful ingestion
      await logIngestion({
        entityType: entityType as 'lead' | 'campaign' | 'engagement',
        entityId,
        payload: payload as unknown as Record<string, unknown>,
        success: true,
        sourceIp
      })

      // Return success response
      return NextResponse.json(
        {
          success: true,
          message: 'Data ingested successfully',
          entityType,
          entityId,
          timestamp: new Date().toISOString()
        },
        {
          status: 200,
          headers: {
            'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
            'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
            'X-RateLimit-Reset': rateLimitInfo.reset.toString()
          }
        }
      )
    } catch (dbError: any) {
      // Database operation failed
      const errorMessage = dbError?.message || 'Database operation failed'
      logger.ingestion.failure(entityType, errorMessage, 'database_error')

      // Log failed ingestion
      await logIngestion({
        entityType: entityType as 'lead' | 'campaign' | 'engagement',
        payload: payload as unknown as Record<string, unknown>,
        success: false,
        errorDetails: errorMessage,
        sourceIp
      }).catch(err => {
        // If logging fails, just log to console (don't block response)
        console.error('[Ingestion] Failed to log error:', err)
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to process data. Please try again later.',
          timestamp: new Date().toISOString()
        },
        {
          status: 500,
          headers: {
            'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
            'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
            'X-RateLimit-Reset': rateLimitInfo.reset.toString()
          }
        }
      )
    }
  } catch (error) {
    // Unexpected error (middleware should have caught most errors)
    const errorMessage = error?.message || 'Unexpected error'
    logger.ingestion.failure('unknown', errorMessage, 'unexpected_error')

    console.error('[Ingestion] Unexpected error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ingest
 * Returns API information and usage instructions
 */
export async function GET() {
  return NextResponse.json({
    name: 'Data Ingestion API',
    version: '1.0.0',
    description: 'Ingestion endpoint for N8N workflows',
    endpoints: {
      POST: {
        path: '/api/ingest',
        description: 'Ingest lead, campaign, or engagement data',
        rateLimit: '100 requests per minute per IP',
        maxPayloadSize: '5MB',
        contentType: 'application/json'
      }
    },
    documentation: 'https://github.com/your-org/your-repo/docs/api/ingest.md'
  })
}
