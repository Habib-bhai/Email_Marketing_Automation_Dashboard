// lib/middleware/validate.ts
import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'
import { formatValidationError } from '../validations/ingestion'

export interface ValidationResult<T> {
  success: true
  data: T
}

/**
 * Payload validation middleware factory
 * Returns a middleware function that validates request body against a Zod schema
 */
export function validatePayload<T>(schema: ZodSchema<T>) {
  return async (request: NextRequest): Promise<NextResponse | ValidationResult<T>> => {
    try {
      // Parse JSON body
      let body: unknown
      try {
        body = await request.json()
      } catch (parseError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Bad Request',
            message: 'Invalid JSON payload',
            details: [
              {
                field: 'body',
                message: 'Request body must be valid JSON',
                code: 'invalid_json'
              }
            ]
          },
          { status: 400 }
        )
      }

      // Validate against schema
      const validated = schema.parse(body)

      return {
        success: true,
        data: validated
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            ...formatValidationError(error)
          },
          { status: 400 }
        )
      }

      // Unexpected error during validation
      console.error('[Validation] Unexpected error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Internal Server Error',
          message: 'An unexpected error occurred during validation'
        },
        { status: 500 }
      )
    }
  }
}
