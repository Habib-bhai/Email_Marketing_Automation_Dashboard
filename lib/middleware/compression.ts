/**
 * Response Compression Middleware (T208)
 * 
 * Provides aggressive compression for API responses using gzip/brotli
 * 
 * Features:
 * - Automatic format detection (brotli > gzip > none)
 * - Configurable compression level
 * - Size threshold to avoid compressing small responses
 * - Type-based compression (JSON, HTML, CSS, JS)
 * 
 * Usage:
 * ```typescript
 * import { withCompression } from '@/lib/middleware/compression'
 * 
 * export const GET = withCompression(async (req) => {
 *   return Response.json({ data: largeDataset })
 * })
 * ```
 */

import { NextRequest, NextResponse } from 'next/server'
import { gzip, brotliCompress } from 'zlib'
import { promisify } from 'util'

const gzipAsync = promisify(gzip)
const brotliAsync = promisify(brotliCompress)

export interface CompressionOptions {
  /**
   * Minimum response size in bytes to trigger compression
   * Default: 1024 (1KB)
   */
  threshold?: number
  
  /**
   * Compression level (0-9 for gzip, 0-11 for brotli)
   * Default: 6 (balanced speed/compression)
   */
  level?: number
  
  /**
   * Content types to compress
   * Default: ['application/json', 'text/html', 'text/css', 'application/javascript']
   */
  types?: string[]
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  threshold: 1024, // 1KB
  level: 6,
  types: [
    'application/json',
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'text/plain',
    'text/xml',
    'application/xml',
  ]
}

/**
 * Check if response should be compressed based on content type and size
 */
function shouldCompress(
  contentType: string | null,
  contentLength: number,
  options: Required<CompressionOptions>
): boolean {
  // Don't compress if no content type
  if (!contentType) return false
  
  // Don't compress if below threshold
  if (contentLength < options.threshold) return false
  
  // Check if content type should be compressed
  return options.types.some(type => contentType.includes(type))
}

/**
 * Detect best compression format from Accept-Encoding header
 */
function getBestEncoding(acceptEncoding: string | null): 'br' | 'gzip' | null {
  if (!acceptEncoding) return null
  
  const encodings = acceptEncoding.toLowerCase()
  
  // Prefer brotli (better compression)
  if (encodings.includes('br')) return 'br'
  
  // Fallback to gzip
  if (encodings.includes('gzip')) return 'gzip'
  
  return null
}

/**
 * Compress response body using specified encoding
 */
async function compressBody(
  body: Buffer,
  encoding: 'br' | 'gzip',
  level: number
): Promise<Buffer> {
  if (encoding === 'br') {
    return brotliAsync(body, {
      params: {
        [require('zlib').constants.BROTLI_PARAM_QUALITY]: level,
      }
    })
  } else {
    return gzipAsync(body, { level })
  }
}

/**
 * Higher-order function that wraps API route handlers with compression
 * 
 * @example
 * ```typescript
 * export const GET = withCompression(async (req) => {
 *   const data = await fetchLargeDataset()
 *   return Response.json(data)
 * })
 * ```
 */
export function withCompression(
  handler: (req: NextRequest) => Promise<Response>,
  options: CompressionOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  return async (req: NextRequest): Promise<Response> => {
    // Call the original handler
    const response = await handler(req)
    
    // Don't compress if already compressed
    if (response.headers.get('content-encoding')) {
      return response
    }
    
    // Get response details
    const contentType = response.headers.get('content-type')
    const acceptEncoding = req.headers.get('accept-encoding')
    
    // Clone response to read body
    const clonedResponse = response.clone()
    const bodyBuffer = Buffer.from(await clonedResponse.arrayBuffer())
    
    // Check if should compress
    if (!shouldCompress(contentType, bodyBuffer.length, opts)) {
      return response
    }
    
    // Determine encoding
    const encoding = getBestEncoding(acceptEncoding)
    if (!encoding) {
      return response
    }
    
    try {
      // Compress the body
      const compressedBody = await compressBody(bodyBuffer, encoding, opts.level)
      
      // Calculate compression ratio
      const originalSize = bodyBuffer.length
      const compressedSize = compressedBody.length
      const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1)
      
      // Create new response with compressed body (convert Buffer to Uint8Array)
      const compressedResponse = new NextResponse(new Uint8Array(compressedBody), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
      
      // Set compression headers
      compressedResponse.headers.set('content-encoding', encoding)
      compressedResponse.headers.set('content-length', compressedSize.toString())
      compressedResponse.headers.set('vary', 'Accept-Encoding')
      
      // Add compression info header (dev only)
      if (process.env.NODE_ENV === 'development') {
        compressedResponse.headers.set(
          'x-compression-ratio',
          `${ratio}% (${originalSize} → ${compressedSize} bytes)`
        )
      }
      
      return compressedResponse
    } catch (error) {
      // If compression fails, return original response
      console.error('Compression failed:', error)
      return response
    }
  }
}

/**
 * Compression statistics for monitoring
 */
export interface CompressionStats {
  originalSize: number
  compressedSize: number
  ratio: number
  encoding: 'br' | 'gzip' | 'none'
}

/**
 * Calculate compression statistics for a response
 */
export async function getCompressionStats(
  body: Buffer,
  encoding: 'br' | 'gzip' | null
): Promise<CompressionStats> {
  if (!encoding) {
    return {
      originalSize: body.length,
      compressedSize: body.length,
      ratio: 0,
      encoding: 'none'
    }
  }
  
  const compressed = await compressBody(body, encoding, 6)
  const ratio = ((1 - compressed.length / body.length) * 100)
  
  return {
    originalSize: body.length,
    compressedSize: compressed.length,
    ratio,
    encoding
  }
}
