// __tests__/integration/api/dashboard-metrics.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { GET as getOverview } from '@/app/api/dashboard/metrics/overview/route'
import { GET as getLeadPipeline } from '@/app/api/dashboard/metrics/lead-pipeline/route'
import { GET as getEmailEngagement } from '@/app/api/dashboard/metrics/email-engagement/route'
import { NextRequest } from 'next/server'

/**
 * T055 - Test: GET /api/dashboard/metrics/overview returns correct data
 * T056 - Test: GET /api/dashboard/metrics/lead-pipeline with filters
 * T057 - Test: GET /api/dashboard/metrics/email-engagement calculates rates
 */

describe('Dashboard Metrics API', () => {
  describe('T055 - GET /api/dashboard/metrics/overview', () => {
    it('should return correct data structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/dashboard/metrics/overview')
      const response = await getOverview(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
      expect(data.data).toHaveProperty('totalLeads')
      expect(data.data).toHaveProperty('activeCampaigns')
      expect(data.data).toHaveProperty('replyRate')
      expect(data.data).toHaveProperty('openRate')
      expect(typeof data.data.totalLeads).toBe('number')
      expect(typeof data.data.activeCampaigns).toBe('number')
      expect(typeof data.data.replyRate).toBe('number')
      expect(typeof data.data.openRate).toBe('number')
    })

    it('should return non-negative metrics', async () => {
      const request = new NextRequest('http://localhost:3000/api/dashboard/metrics/overview')
      const response = await getOverview(request)
      const data = await response.json()

      expect(data.data.totalLeads).toBeGreaterThanOrEqual(0)
      expect(data.data.activeCampaigns).toBeGreaterThanOrEqual(0)
      expect(data.data.replyRate).toBeGreaterThanOrEqual(0)
      expect(data.data.openRate).toBeGreaterThanOrEqual(0)
    })
  })

  describe('T056 - GET /api/dashboard/metrics/lead-pipeline with filters', () => {
    it('should accept status filter', async () => {
      const url = 'http://localhost:3000/api/dashboard/metrics/lead-pipeline?status=Processed'
      const request = new NextRequest(url)
      const response = await getLeadPipeline(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
      expect(data.data).toHaveProperty('byStatus')
      expect(data.data).toHaveProperty('byType')
      expect(data.data).toHaveProperty('byTemperature')
      expect(data.data).toHaveProperty('total')
    })

    it('should accept type filter', async () => {
      const url = 'http://localhost:3000/api/dashboard/metrics/lead-pipeline?type=Brand'
      const request = new NextRequest(url)
      const response = await getLeadPipeline(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveProperty('byStatus')
      expect(data.data).toHaveProperty('byType')
    })

    it('should accept temperature filter', async () => {
      const url = 'http://localhost:3000/api/dashboard/metrics/lead-pipeline?temperature=Hot'
      const request = new NextRequest(url)
      const response = await getLeadPipeline(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveProperty('byTemperature')
    })

    it('should accept date range filters', async () => {
      const url = 'http://localhost:3000/api/dashboard/metrics/lead-pipeline?dateFrom=2025-01-01&dateTo=2025-12-31'
      const request = new NextRequest(url)
      const response = await getLeadPipeline(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveProperty('total')
    })

    it('should accept multiple filters', async () => {
      const url = 'http://localhost:3000/api/dashboard/metrics/lead-pipeline?status=Processed&type=Brand&temperature=Hot'
      const request = new NextRequest(url)
      const response = await getLeadPipeline(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
    })
  })

  describe('T057 - GET /api/dashboard/metrics/email-engagement calculates rates', () => {
    it('should return email metrics with calculated rates', async () => {
      const request = new NextRequest('http://localhost:3000/api/dashboard/metrics/email-engagement')
      const response = await getEmailEngagement(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
      expect(data.data).toHaveProperty('totalEmailsSent')
      expect(data.data).toHaveProperty('repliesReceived')
      expect(data.data).toHaveProperty('opensDetected')
      expect(data.data).toHaveProperty('replyRate')
      expect(data.data).toHaveProperty('openRate')
    })

    it('should calculate reply rate correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/dashboard/metrics/email-engagement')
      const response = await getEmailEngagement(request)
      const data = await response.json()

      if (data.data.totalEmailsSent > 0) {
        const expectedRate = (data.data.repliesReceived / data.data.totalEmailsSent) * 100
        expect(data.data.replyRate).toBeCloseTo(expectedRate, 2)
      } else {
        expect(data.data.replyRate).toBe(0)
      }
    })

    it('should calculate open rate correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/dashboard/metrics/email-engagement')
      const response = await getEmailEngagement(request)
      const data = await response.json()

      if (data.data.totalEmailsSent > 0) {
        const expectedRate = (data.data.opensDetected / data.data.totalEmailsSent) * 100
        expect(data.data.openRate).toBeCloseTo(expectedRate, 2)
      } else {
        expect(data.data.openRate).toBe(0)
      }
    })

    it('should handle zero emails sent gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/dashboard/metrics/email-engagement')
      const response = await getEmailEngagement(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.replyRate).toBeGreaterThanOrEqual(0)
      expect(data.data.openRate).toBeGreaterThanOrEqual(0)
    })

    it('should return rates as percentages between 0-100', async () => {
      const request = new NextRequest('http://localhost:3000/api/dashboard/metrics/email-engagement')
      const response = await getEmailEngagement(request)
      const data = await response.json()

      expect(data.data.replyRate).toBeGreaterThanOrEqual(0)
      expect(data.data.replyRate).toBeLessThanOrEqual(100)
      expect(data.data.openRate).toBeGreaterThanOrEqual(0)
      expect(data.data.openRate).toBeLessThanOrEqual(100)
    })
  })
})
