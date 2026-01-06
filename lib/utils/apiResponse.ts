// lib/utils/apiResponse.ts
import { NextResponse } from 'next/server'

export interface SuccessResponse<T = any> {
  success: true
  data?: T
  message?: string
  timestamp: string
  [key: string]: any
}

export interface ErrorResponse {
  success: false
  error: string
  message: string
  details?: any[]
  timestamp: string
  [key: string]: any
}

export type APIResponse<T = any> = SuccessResponse<T> | ErrorResponse

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T = any>(
  data?: T,
  message?: string,
  extra?: Record<string, any>
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    timestamp: new Date().toISOString(),
    ...extra
  })
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: string,
  message: string,
  status: number,
  details?: any[],
  extra?: Record<string, any>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      ...extra
    },
    { status }
  )
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders<T>(
  response: NextResponse<T>,
  limit: number,
  remaining: number,
  reset: number
): NextResponse<T> {
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())
  return response
}

/**
 * Create a 400 Bad Request response
 */
export function badRequest(message: string, details?: any[]): NextResponse<ErrorResponse> {
  return createErrorResponse('Bad Request', message, 400, details)
}

/**
 * Create a 401 Unauthorized response
 */
export function unauthorized(message = 'Unauthorized'): NextResponse<ErrorResponse> {
  return createErrorResponse('Unauthorized', message, 401)
}

/**
 * Create a 403 Forbidden response
 */
export function forbidden(message = 'Forbidden'): NextResponse<ErrorResponse> {
  return createErrorResponse('Forbidden', message, 403)
}

/**
 * Create a 404 Not Found response
 */
export function notFound(message = 'Resource not found'): NextResponse<ErrorResponse> {
  return createErrorResponse('Not Found', message, 404)
}

/**
 * Create a 413 Payload Too Large response
 */
export function payloadTooLarge(
  message = 'Payload too large',
  maxSize?: string,
  receivedSize?: string
): NextResponse<ErrorResponse> {
  return createErrorResponse('Payload Too Large', message, 413, undefined, {
    ...(maxSize && { maxSize }),
    ...(receivedSize && { receivedSize })
  })
}

/**
 * Create a 429 Too Many Requests response
 */
export function tooManyRequests(
  message = 'Too many requests',
  limit: number,
  reset: number,
  retryAfter: number
): NextResponse<ErrorResponse> {
  const response = createErrorResponse(
    'Too Many Requests',
    message,
    429,
    undefined,
    {
      limit,
      remaining: 0,
      reset: new Date(reset).toISOString(),
      retryAfter
    }
  )

  response.headers.set('Retry-After', retryAfter.toString())
  return addRateLimitHeaders(response, limit, 0, reset)
}

/**
 * Create a 500 Internal Server Error response
 */
export function internalServerError(
  message = 'Internal server error'
): NextResponse<ErrorResponse> {
  return createErrorResponse('Internal Server Error', message, 500)
}

/**
 * Create a 503 Service Unavailable response
 */
export function serviceUnavailable(
  message = 'Service temporarily unavailable'
): NextResponse<ErrorResponse> {
  return createErrorResponse('Service Unavailable', message, 503)
}
