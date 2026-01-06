// lib/validations/ingestion.ts
import { z } from 'zod'

/**
 * Lead validation schema
 * Validates incoming lead data from N8N workflows
 */
export const leadSchema = z.object({
  id: z.string().uuid().optional(), // Optional - auto-generated if not provided
  status: z.enum(['Processed', 'Unprocessed']).default('Unprocessed'),
  type: z.enum(['Brand', 'Apollo', 'Cold', 'Warm']),
  temperature: z.enum(['Hot', 'Warm', 'Cold']),
  source: z.string().min(1).max(255),
  email: z.string().email().optional(),
  name: z.string().min(1).max(255).optional(),
  company: z.string().max(255).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.string().optional() // Relaxed - accept any string
})

/**
 * Campaign validation schema
 * Validates incoming campaign data from N8N workflows
 */
export const campaignSchema = z.object({
  id: z.string().min(1).max(255).optional(), // Optional - support custom string IDs from n8n
  name: z.string().min(1).max(255),
  emailsSent: z.number().int().nonnegative().default(0),
  repliesReceived: z.number().int().nonnegative().default(0),
  opensDetected: z.number().int().nonnegative().default(0),
  startedAt: z.string(), // Relaxed - accept any string, will be converted to Date
  endedAt: z.string().optional().nullable(), // Relaxed - accept any string
  status: z.enum(['Draft', 'Active', 'Paused', 'Completed']).default('Active'),
  metadata: z.record(z.string(), z.unknown()).optional()
})

/**
 * Engagement event validation schema
 * Validates individual engagement events (sent, opened, replied, etc.)
 * Accepts both 'timestamp' and 'occurredAt' for backwards compatibility
 */
export const engagementSchema = z.object({
  id: z.string().optional(), // Optional - auto-generated if not provided
  campaignId: z.string().min(1).max(255), // Allow any string campaign ID (relaxed from UUID requirement)
  leadId: z.string().optional().nullable(),
  eventType: z.enum(['sent', 'opened', 'replied', 'bounced', 'clicked', 'unsubscribed', 'follow_up_sent', 'last_follow_up_sent']),
  occurredAt: z.string().optional(), // Relaxed - accept any string, will be converted to Date
  timestamp: z.string().optional(), // Alias for occurredAt (backwards compatibility)
  metadata: z.record(z.string(), z.unknown()).optional()
}).transform((data) => {
  // Use timestamp as occurredAt if only timestamp is provided
  if (!data.occurredAt && data.timestamp) {
    return { ...data, occurredAt: data.timestamp }
  }
  // If occurredAt is not provided, use current time
  if (!data.occurredAt) {
    return { ...data, occurredAt: new Date().toISOString() }
  }
  return data
}).refine((data) => data.occurredAt !== undefined, {
  message: 'Either occurredAt or timestamp must be provided'
})

/**
 * Ingestion payload schema (discriminated union)
 * Routes to the correct validator based on 'type' field
 */
export const ingestionPayloadSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('lead'),
    data: leadSchema
  }),
  z.object({
    type: z.literal('campaign'),
    data: campaignSchema
  }),
  z.object({
    type: z.literal('engagement'),
    data: engagementSchema
  })
])

// TypeScript type inference
export type Lead = z.infer<typeof leadSchema>
export type Campaign = z.infer<typeof campaignSchema>
export type Engagement = z.infer<typeof engagementSchema>
export type IngestionPayload = z.infer<typeof ingestionPayloadSchema>

/**
 * Validation error formatter
 * Converts Zod errors to user-friendly format
 */
export function formatValidationError(error: z.ZodError) {
  return {
    error: 'Validation Error',
    message: 'Invalid request payload',
    details: error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }))
  }
}
