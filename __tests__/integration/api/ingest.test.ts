/**
 * Integration tests for /api/ingest endpoint
 * Tests: T029-T032, T034-T035 (User Story 1)
 *
 * TDD RED Phase: These tests will FAIL initially until implementation is complete
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { leads, campaigns, engagementMetrics } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { IngestionPayload } from '@/lib/types/api'

// Test data
const validLeadPayload: IngestionPayload = {
  type: 'lead',
  data: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    status: 'Unprocessed',
    type: 'Cold',
    temperature: 'Warm',
    source: 'N8N-Test-Workflow',
    email: 'test@example.com',
    name: 'Test Lead',
    company: 'Test Company',
    metadata: { testFlag: true }
  }
}

const validCampaignPayload: IngestionPayload = {
  type: 'campaign',
  data: {
    id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'Test Campaign',
    emailsSent: 100,
    repliesReceived: 10,
    opensDetected: 50,
    startedAt: '2026-01-01T00:00:00Z',
    status: 'Active',
    metadata: { testFlag: true }
  }
}

const validEngagementPayload: IngestionPayload = {
  type: 'engagement',
  data: {
    campaignId: '223e4567-e89b-12d3-a456-426614174001',
    leadId: '123e4567-e89b-12d3-a456-426614174000',
    eventType: 'opened',
    timestamp: '2026-01-01T12:00:00Z',
    metadata: { testFlag: true }
  }
}

const invalidPayload = {
  type: 'lead',
  data: {
    // Missing required fields
    status: 'Invalid Status'
  }
}

describe('POST /api/ingest - T029: Valid lead ingestion returns 200', () => {
  beforeEach(async () => {
    // Clean up test data
    await db.delete(leads).where(eq(leads.id, validLeadPayload.data.id))
  })

  it('should accept valid lead payload and return 200', async () => {
    const response = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validLeadPayload)
    })

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.entityType).toBe('lead')
    expect(data.entityId).toBe(validLeadPayload.data.id)
    expect(data.message).toContain('successfully')

    // Verify lead was stored in database
    const storedLead = await db.query.leads.findFirst({
      where: eq(leads.id, validLeadPayload.data.id)
    })

    expect(storedLead).toBeDefined()
    expect(storedLead?.email).toBe('test@example.com')
    expect(storedLead?.status).toBe('Unprocessed')
  })
})

describe('POST /api/ingest - T030: Invalid payload returns 400', () => {
  it('should reject invalid payload and return 400 with details', async () => {
    const response = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload)
    })

    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe('Validation Error')
    expect(data.details).toBeDefined()
    expect(Array.isArray(data.details)).toBe(true)
    expect(data.details.length).toBeGreaterThan(0)
  })
})

describe('POST /api/ingest - T031: Duplicate submission upserts (not duplicates)', () => {
  beforeEach(async () => {
    await db.delete(leads).where(eq(leads.id, validLeadPayload.data.id))
  })

  it('should upsert on duplicate ID (idempotent)', async () => {
    // First submission
    const response1 = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validLeadPayload)
    })
    expect(response1.status).toBe(200)

    // Second submission with updated data
    const updatedPayload = {
      ...validLeadPayload,
      data: {
        ...validLeadPayload.data,
        name: 'Updated Test Lead',
        company: 'Updated Company'
      }
    }

    const response2 = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload)
    })
    expect(response2.status).toBe(200)

    // Verify only one record exists with updated data
    const allLeads = await db.select().from(leads)
      .where(eq(leads.id, validLeadPayload.data.id))

    expect(allLeads.length).toBe(1)
    expect(allLeads[0].name).toBe('Updated Test Lead')
    expect(allLeads[0].company).toBe('Updated Company')
  })
})

describe('POST /api/ingest - T032: >5MB payload returns 413', () => {
  it('should reject payloads larger than 5MB', async () => {
    const largePayload = {
      type: 'lead',
      data: {
        ...validLeadPayload.data,
        metadata: {
          // Create ~6MB of data
          largeField: 'x'.repeat(6 * 1024 * 1024)
        }
      }
    }

    const response = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(largePayload)
    })

    expect(response.status).toBe(413)

    const data = await response.json()
    expect(data.error).toContain('Payload Too Large')
  })
})

describe('POST /api/ingest - T034: Valid campaign ingestion', () => {
  beforeEach(async () => {
    await db.delete(campaigns).where(eq(campaigns.id, validCampaignPayload.data.id))
  })

  it('should accept valid campaign payload and return 200', async () => {
    const response = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validCampaignPayload)
    })

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.entityType).toBe('campaign')

    // Verify campaign was stored
    const storedCampaign = await db.query.campaigns.findFirst({
      where: eq(campaigns.id, validCampaignPayload.data.id)
    })

    expect(storedCampaign).toBeDefined()
    expect(storedCampaign?.name).toBe('Test Campaign')
    expect(storedCampaign?.emailsSent).toBe(100)
  })
})

describe('POST /api/ingest - T035: Valid engagement ingestion', () => {
  beforeAll(async () => {
    // Create campaign first (required for foreign key)
    await db.insert(campaigns).values({
      id: validCampaignPayload.data.id,
      name: validCampaignPayload.data.name,
      emailsSent: validCampaignPayload.data.emailsSent,
      repliesReceived: validCampaignPayload.data.repliesReceived,
      opensDetected: validCampaignPayload.data.opensDetected,
      startedAt: new Date(validCampaignPayload.data.startedAt),
      status: 'Active'
    }).onConflictDoNothing()
  })

  it('should accept valid engagement payload and return 200', async () => {
    const response = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validEngagementPayload)
    })

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.entityType).toBe('engagement')

    // Verify engagement was stored
    const storedEngagement = await db.select().from(engagementMetrics)
      .where(eq(engagementMetrics.campaignId, validEngagementPayload.data.campaignId))
      .limit(1)

    expect(storedEngagement.length).toBeGreaterThan(0)
    expect(storedEngagement[0].eventType).toBe('opened')
  })
})
