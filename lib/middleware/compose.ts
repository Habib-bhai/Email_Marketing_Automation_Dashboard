// lib/middleware/compose.ts
import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware function type
 * Can return either:
 * - NextResponse (short-circuits and returns immediately)
 * - Object with success: true and optional context data (continues to next middleware)
 */
export type Middleware = (
  request: NextRequest
) => Promise<NextResponse | { success: true; [key: string]: any }>

export interface MiddlewareContext {
  [key: string]: any
}

/**
 * Compose multiple middleware functions into a single pipeline
 *
 * Execution flow:
 * 1. Run middlewares in order
 * 2. If middleware returns NextResponse, short-circuit and return it
 * 3. If middleware returns success object, merge context and continue
 * 4. Return accumulated context at the end
 *
 * @example
 * ```ts
 * const middleware = composeMiddleware(
 *   checkPayloadSize,
 *   rateLimitMiddleware,
 *   validatePayload(schema)
 * )
 *
 * const result = await middleware(request)
 * if (result instanceof NextResponse) {
 *   return result // Error response
 * }
 *
 * // Success - use result.data, result.remaining, etc.
 * ```
 */
export function composeMiddleware(...middlewares: Middleware[]) {
  return async (request: NextRequest): Promise<NextResponse | MiddlewareContext> => {
    const context: MiddlewareContext = {}

    for (const middleware of middlewares) {
      try {
        const result = await middleware(request)

        // If middleware returns NextResponse, short-circuit
        if (result instanceof NextResponse) {
          return result
        }

        // Merge middleware result into context
        Object.assign(context, result)
      } catch (error) {
        // Unexpected middleware error
        console.error('[Middleware] Unexpected error:', error)
        return NextResponse.json(
          {
            success: false,
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while processing the request'
          },
          { status: 500 }
        )
      }
    }

    // All middlewares passed
    return context
  }
}
