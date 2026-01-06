/**
 * Unit tests for Zod validation schemas
 * Test: T036 (User Story 1)
 *
 * TDD RED Phase: These tests will FAIL until validation schemas are implemented
 */

import { describe, it, expect } from 'vitest'
// These imports will fail until we create the validation schemas
import {
  leadSchema,
  campaignSchema,
  engagementSchema,
  ingestionPayloadSchema
} from '@/lib/validations/ingestion'

describe('Zod Validation Schemas - T036', () => {
  describe('leadSchema validation', () => {
    it('should accept valid lead data', () => {
      const validLead = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'Unprocessed',
        type: 'Cold',
        temperature: 'Warm',
        source: 'N8N-Workflow',
        email: 'test@example.com',
        name: 'Test Lead'
      }

      const result = leadSchema.safeParse(validLead)
      expect(result.success).toBe(true)
    })

    it('should reject lead with invalid status', () => {
      const invalidLead = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'InvalidStatus', // Invalid
        type: 'Cold',
        temperature: 'Warm',
        source: 'N8N-Workflow'
      }

      const result = leadSchema.safeParse(invalidLead)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })

    it('should reject lead with invalid email format', () => {
      const invalidLead = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'Unprocessed',
        type: 'Cold',
        temperature: 'Warm',
        source: 'N8N-Workflow',
        email: 'not-an-email' // Invalid email
      }

      const result = leadSchema.safeParse(invalidLead)
      expect(result.success).toBe(false)
    })

    it('should require mandatory fields', () => {
      const incompleteLead = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        // Missing status, type, temperature, source
      }

      const result = leadSchema.safeParse(incompleteLead)
      expect(result.success).toBe(false)
    })
  })

  describe('campaignSchema validation', () => {
    it('should accept valid campaign data', () => {
      const validCampaign = {
        id: '223e4567-e89b-12d3-a456-426614174001',
        name: 'Test Campaign',
        emailsSent: 100,
        repliesReceived: 10,
        opensDetected: 50,
        startedAt: '2026-01-01T00:00:00Z',
        status: 'Active'
      }

      const result = campaignSchema.safeParse(validCampaign)
      expect(result.success).toBe(true)
    })

    it('should reject campaign with negative metrics', () => {
      const invalidCampaign = {
        id: '223e4567-e89b-12d3-a456-426614174001',
        name: 'Test Campaign',
        emailsSent: -10, // Invalid negative
        repliesReceived: 10,
        opensDetected: 50,
        startedAt: '2026-01-01T00:00:00Z'
      }

      const result = campaignSchema.safeParse(invalidCampaign)
      expect(result.success).toBe(false)
    })

    it('should require name and startedAt', () => {
      const incompleteCampaign = {
        id: '223e4567-e89b-12d3-a456-426614174001',
        emailsSent: 100
        // Missing name and startedAt
      }

      const result = campaignSchema.safeParse(incompleteCampaign)
      expect(result.success).toBe(false)
    })
  })

  describe('engagementSchema validation', () => {
    it('should accept valid engagement data', () => {
      const validEngagement = {
        campaignId: '223e4567-e89b-12d3-a456-426614174001',
        leadId: '123e4567-e89b-12d3-a456-426614174000',
        eventType: 'opened',
        timestamp: '2026-01-01T12:00:00Z'
      }

      const result = engagementSchema.safeParse(validEngagement)
      expect(result.success).toBe(true)
    })

    it('should accept engagement without leadId (aggregate events)', () => {
      const validEngagement = {
        campaignId: '223e4567-e89b-12d3-a456-426614174001',
        eventType: 'sent',
        timestamp: '2026-01-01T12:00:00Z'
        // No leadId
      }

      const result = engagementSchema.safeParse(validEngagement)
      expect(result.success).toBe(true)
    })

    it('should reject engagement with invalid eventType', () => {
      const invalidEngagement = {
        campaignId: '223e4567-e89b-12d3-a456-426614174001',
        eventType: 'invalid_event', // Invalid
        timestamp: '2026-01-01T12:00:00Z'
      }

      const result = engagementSchema.safeParse(invalidEngagement)
      expect(result.success).toBe(false)
    })
  })

  describe('ingestionPayloadSchema (discriminated union)', () => {
    it('should accept lead payload', () => {
      const payload = {
        type: 'lead',
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          status: 'Unprocessed',
          type: 'Cold',
          temperature: 'Warm',
          source: 'N8N-Workflow'
        }
      }

      const result = ingestionPayloadSchema.safeParse(payload)
      expect(result.success).toBe(true)
    })

    it('should accept campaign payload', () => {
      const payload = {
        type: 'campaign',
        data: {
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Test Campaign',
          emailsSent: 100,
          repliesReceived: 10,
          opensDetected: 50,
          startedAt: '2026-01-01T00:00:00Z'
        }
      }

      const result = ingestionPayloadSchema.safeParse(payload)
      expect(result.success).toBe(true)
    })

    it('should accept engagement payload', () => {
      const payload = {
        type: 'engagement',
        data: {
          campaignId: '223e4567-e89b-12d3-a456-426614174001',
          eventType: 'replied',
          timestamp: '2026-01-01T12:00:00Z'
        }
      }

      const result = ingestionPayloadSchema.safeParse(payload)
      expect(result.success).toBe(true)
    })

    it('should reject payload with invalid type', () => {
      const payload = {
        type: 'invalid_type',
        data: {}
      }

      const result = ingestionPayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
    })
  })
})
