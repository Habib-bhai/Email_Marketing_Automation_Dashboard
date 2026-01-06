// lib/api/useEmailEngagement.ts
import { useQuery } from '@tanstack/react-query'
import type { EmailEngagementMetrics } from '../repositories/analytics'

/**
 * Fetch email engagement metrics
 * T078 - useEmailEngagement hook
 * CACHING DISABLED for debugging
 */
export function useEmailEngagement() {
  return useQuery<EmailEngagementMetrics>({
    queryKey: ['dashboard', 'metrics', 'email-engagement'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/metrics/email-engagement', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch email engagement metrics')
      }

      const json = await response.json()
      console.log('🔍 API Raw Response:', json)
      const data = json.data || json
      console.log('🔍 Extracted Data:', data)
      return data
    },
    staleTime: 0, // No caching - always fresh
    gcTime: 0, // Don't keep in cache
    refetchOnMount: 'always', // Always refetch on mount
    refetchOnWindowFocus: true, // Refetch on window focus
  })
}

