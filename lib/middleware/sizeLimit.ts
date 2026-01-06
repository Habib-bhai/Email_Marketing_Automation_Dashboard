// lib/middleware/sizeLimit.ts
import { NextRequest, NextResponse } from 'next/server'

const MAX_PAYLOAD_SIZE = 5 * 1024 * 1024 // 5MB in bytes

/**
 * Middleware to check payload size before processing
 * Returns 413 Payload Too Large if Content-Length exceeds 5MB
 */
export async function checkPayloadSize(request: NextRequest): Promise<NextResponse | { success: true }> {
  const contentLength = request.headers.get('content-length')

  if (contentLength) {
    const sizeInBytes = parseInt(contentLength, 10)

    if (isNaN(sizeInBytes)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bad Request',
          message: 'Invalid Content-Length header'
        },
        { status: 400 }
      )
    }

    if (sizeInBytes > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payload Too Large',
          message: `Request payload exceeds 5MB limit (received ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB)`,
          maxSize: '5MB',
          receivedSize: `${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`
        },
        { status: 413 }
      )
    }
  }

  return { success: true }
}
