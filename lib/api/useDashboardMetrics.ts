// lib/api/useDashboardMetrics.ts
import { useQuery } from '@tanstack/react-query'
import type { DashboardOverview } from '../repositories/analytics'

/**
 * Fetch dashboard overview metrics
 * T076 - useDashboardMetrics hook
 */
export function useDashboardMetrics() {
  return useQuery<DashboardOverview>({
    queryKey: ['dashboard', 'metrics', 'overview'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/metrics/overview')

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard metrics')
      }

      const json = await response.json()
      return json.data || json
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Auto-refetch every 5 minutes
  })
}
