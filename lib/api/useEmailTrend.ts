// lib/api/useEmailTrend.ts
import { useQuery } from '@tanstack/react-query'

export interface EmailTrendData {
  date: string
  sent: number
  opened: number
  replied: number
}

/**
 * Fetch email trend data for charts
 * CACHING DISABLED for debugging
 */
export function useEmailTrend(days: number = 7) {
  return useQuery<EmailTrendData[]>({
    queryKey: ['dashboard', 'metrics', 'email-trend', days],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/metrics/email-trend?days=${days}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch email trend data')
      }

      const json = await response.json()
      console.log('📈 Trend API Raw Response:', json)
      const data = json.data || json
      console.log('📈 Trend Extracted Data:', data)
      return data
    },
    staleTime: 0, // No caching
    gcTime: 0, // Don't keep in cache
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })
}
