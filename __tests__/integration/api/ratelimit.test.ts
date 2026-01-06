/**
 * Integration tests for rate limiting
 * Test: T033 (User Story 1)
 *
 * TDD RED Phase: This test will FAIL initially until rate limit middleware is implemented
 */

import { describe, it, expect } from 'vitest'
import type { IngestionPayload } from '@/lib/types/api'

const validPayload: IngestionPayload = {
  type: 'lead',
  data: {
    id: '999e4567-e89b-12d3-a456-426614174999',
    status: 'Unprocessed',
    type: 'Cold',
    temperature: 'Warm',
    source: 'Rate-Limit-Test'
  }
}

describe('POST /api/ingest - T033: >100 req/min returns 429', () => {
  it('should enforce rate limit of 100 requests per minute per IP', async () => {
    const requests = []

    // Fire 101 requests rapidly
    for (let i = 0; i < 101; i++) {
      const payload = {
        ...validPayload,
        data: {
          ...validPayload.data,
          id: `rate-test-${i}-${Date.now()}`
        }
      }

      requests.push(
        fetch('http://localhost:3000/api/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      )
    }

    const responses = await Promise.all(requests)

    // At least one request should be rate limited (429)
    const rateLimitedResponses = responses.filter(r => r.status === 429)
    expect(rateLimitedResponses.length).toBeGreaterThan(0)

    // Check rate limit response format
    const rateLimitedData = await rateLimitedResponses[0].json()
    expect(rateLimitedData.error).toBe('Too Many Requests')
    expect(rateLimitedData.limit).toBe(100)
    expect(rateLimitedData.remaining).toBeDefined()
    expect(rateLimitedData.reset).toBeDefined()
  }, { timeout: 30000 }) // 30 second timeout for this test
})
