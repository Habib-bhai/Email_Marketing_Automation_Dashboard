// lib/middleware/ratelimit.ts
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

// Configure rate limiter: 100 requests per minute using sliding window
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:ingestion'
})

/**
 * Extract client IP address from request headers
 * Handles proxy headers (X-Forwarded-For, X-Real-IP)
 */
function getClientIP(request: NextRequest): string {
  // Check X-Forwarded-For (most proxies and load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  // Check X-Real-IP (Nginx)
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback (NextRequest.ip isn't typed across runtimes)
  return 'anonymous'
}

export interface RateLimitResult {
  success: true
  limit: number
  remaining: number
  reset: number
}

/**
 * Rate limit middleware
 * Returns 429 Too Many Requests if rate limit exceeded
 */
export async function rateLimitMiddleware(
  request: NextRequest
): Promise<NextResponse | RateLimitResult> {
  const ip = getClientIP(request)

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)

    // Add rate limit headers to all responses
    const headers = {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString()
    }

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)

      return NextResponse.json(
        {
          success: false,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          limit,
          remaining: 0,
          reset: new Date(reset).toISOString(),
          retryAfter
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': retryAfter.toString()
          }
        }
      )
    }

    return {
      success: true,
      limit,
      remaining,
      reset
    }
  } catch (error) {
    // Log error but don't block request on rate limit check failure
    console.error('[RateLimit] Error checking rate limit:', error)

    // Allow request to proceed if rate limiting fails
    return {
      success: true,
      limit: 100,
      remaining: 100,
      reset: Date.now() + 60000
    }
  }
}
