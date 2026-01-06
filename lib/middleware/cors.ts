/**
 * CORS Middleware for Next.js API Routes
 * 
 * Provides secure Cross-Origin Resource Sharing configuration
 * with environment-specific allowed origins and comprehensive
 * preflight request handling.
 * 
 * @module lib/middleware/cors
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * CORS Configuration Options
 */
export interface CorsOptions {
  /**
   * Allowed origins (domains that can make requests)
   * @example ['https://yourdomain.com', 'https://app.yourdomain.com']
   */
  allowedOrigins?: string[]
  
  /**
   * Allowed HTTP methods
   * @default ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
   */
  allowedMethods?: string[]
  
  /**
   * Allowed request headers
   * @default ['Content-Type', 'Authorization', 'X-Requested-With']
   */
  allowedHeaders?: string[]
  
  /**
   * Expose additional headers to the client
   * @default ['Content-Length', 'Content-Type']
   */
  exposedHeaders?: string[]
  
  /**
   * Allow credentials (cookies, authorization headers)
   * @default true
   */
  credentials?: boolean
  
  /**
   * Max age for preflight cache (in seconds)
   * @default 86400 (24 hours)
   */
  maxAge?: number
  
  /**
   * Allow all origins in development mode
   * @default true
   */
  allowDevOrigins?: boolean
}

/**
 * Default CORS configuration
 */
const defaultOptions: Required<CorsOptions> = {
  allowedOrigins: [],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  credentials: true,
  maxAge: 86400, // 24 hours
  allowDevOrigins: true,
}

/**
 * Production allowed origins
 * Add your production domains here
 */
const PRODUCTION_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_API_URL,
  // Add additional production domains
  'https://yourdomain.com',
  'https://app.yourdomain.com',
  'https://api.yourdomain.com',
].filter(Boolean) as string[]

/**
 * N8N webhook origins (for automation workflows)
 */
const N8N_ORIGINS = [
  process.env.N8N_WEBHOOK_URL,
  process.env.N8N_INSTANCE_URL,
  // Common N8N cloud patterns
  'https://*.n8n.cloud',
  'https://*.n8n.io',
].filter(Boolean) as string[]

/**
 * Development origins (automatically allowed in dev mode)
 */
const DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // Vite
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
]

/**
 * Check if an origin is allowed
 */
function isOriginAllowed(
  origin: string | null,
  allowedOrigins: string[],
  allowDevOrigins: boolean
): boolean {
  if (!origin) return false
  
  // Allow development origins in dev mode
  if (allowDevOrigins && process.env.NODE_ENV === 'development') {
    if (DEV_ORIGINS.includes(origin)) return true
  }
  
  // Check exact match
  if (allowedOrigins.includes(origin)) return true
  
  // Check wildcard patterns (e.g., https://*.n8n.cloud)
  for (const allowed of allowedOrigins) {
    if (allowed.includes('*')) {
      const regex = new RegExp(
        '^' + allowed.replace(/\*/g, '.*').replace(/\./g, '\\.') + '$'
      )
      if (regex.test(origin)) return true
    }
  }
  
  return false
}

/**
 * Set CORS headers on response
 */
function setCorsHeaders(
  response: NextResponse,
  origin: string | null,
  options: Required<CorsOptions>
): NextResponse {
  const allowedOrigins = [
    ...PRODUCTION_ORIGINS,
    ...N8N_ORIGINS,
    ...options.allowedOrigins,
  ]
  
  // Check if origin is allowed
  const isAllowed = isOriginAllowed(origin, allowedOrigins, options.allowDevOrigins)
  
  if (isAllowed && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (options.allowDevOrigins && process.env.NODE_ENV === 'development') {
    // In dev mode, allow all origins for easier testing
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
  }
  
  // Set other CORS headers
  response.headers.set(
    'Access-Control-Allow-Methods',
    options.allowedMethods.join(', ')
  )
  
  response.headers.set(
    'Access-Control-Allow-Headers',
    options.allowedHeaders.join(', ')
  )
  
  if (options.exposedHeaders.length > 0) {
    response.headers.set(
      'Access-Control-Expose-Headers',
      options.exposedHeaders.join(', ')
    )
  }
  
  if (options.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  response.headers.set('Access-Control-Max-Age', options.maxAge.toString())
  
  // Add Vary header to indicate response varies by Origin
  response.headers.set('Vary', 'Origin')
  
  return response
}

/**
 * Handle OPTIONS preflight request
 */
function handlePreflight(
  request: NextRequest,
  options: Required<CorsOptions>
): NextResponse {
  const origin = request.headers.get('origin')
  const response = new NextResponse(null, { status: 204 })
  
  return setCorsHeaders(response, origin, options)
}

/**
 * CORS middleware wrapper for API routes
 * 
 * @example
 * ```typescript
 * // app/api/example/route.ts
 * import { withCors } from '@/lib/middleware/cors'
 * 
 * async function GET(request: NextRequest) {
 *   return NextResponse.json({ message: 'Hello' })
 * }
 * 
 * export const GET = withCors(GET)
 * export const POST = withCors(POST)
 * ```
 */
export function withCors<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options?: CorsOptions
): T {
  const mergedOptions: Required<CorsOptions> = {
    ...defaultOptions,
    ...options,
  }
  
  return (async (request: NextRequest, ...args: any[]) => {
    const origin = request.headers.get('origin')
    
    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return handlePreflight(request, mergedOptions)
    }
    
    try {
      // Execute the actual handler
      const response = await handler(request, ...args)
      
      // Add CORS headers to response
      return setCorsHeaders(response, origin, mergedOptions)
    } catch (error) {
      // Ensure CORS headers are added even on error
      const errorResponse = new NextResponse(
        JSON.stringify({ 
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
      
      return setCorsHeaders(errorResponse, origin, mergedOptions)
    }
  }) as T
}

/**
 * CORS middleware for specific N8N webhooks
 * Allows only N8N origins with stricter validation
 */
export function withN8nCors<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options?: CorsOptions
): T {
  const n8nOptions: CorsOptions = {
    ...options,
    allowedOrigins: [
      ...N8N_ORIGINS,
      ...(options?.allowedOrigins || []),
    ],
    allowedMethods: ['POST', 'OPTIONS'], // N8N typically uses POST
    credentials: true,
  }
  
  return withCors(handler, n8nOptions)
}

/**
 * CORS middleware for public API endpoints
 * More permissive for public consumption
 */
export function withPublicCors<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options?: CorsOptions
): T {
  const publicOptions: CorsOptions = {
    ...options,
    credentials: false, // No credentials for public APIs
    allowedMethods: ['GET', 'OPTIONS'], // Read-only
    allowDevOrigins: true,
  }
  
  return withCors(handler, publicOptions)
}

/**
 * Validate CORS configuration on startup
 */
export function validateCorsConfig(): void {
  const isDev = process.env.NODE_ENV === 'development'
  
  if (!isDev && PRODUCTION_ORIGINS.length === 0) {
    console.warn(
      '⚠️  CORS Warning: No production origins configured. ' +
      'Set NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_API_URL in .env'
    )
  }
  
  if (!isDev && N8N_ORIGINS.length === 0) {
    console.warn(
      '⚠️  CORS Warning: No N8N origins configured. ' +
      'Set N8N_WEBHOOK_URL and N8N_INSTANCE_URL in .env'
    )
  }
  
  console.log('✅ CORS configuration loaded:', {
    environment: isDev ? 'development' : 'production',
    productionOrigins: PRODUCTION_ORIGINS.length,
    n8nOrigins: N8N_ORIGINS.length,
    devOriginsEnabled: isDev,
  })
}

// Auto-validate on module load
if (typeof window === 'undefined') {
  validateCorsConfig()
}
