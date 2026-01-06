// lib/api/useLeadPipeline.ts
import { useQuery } from '@tanstack/react-query'
import type { LeadPipelineMetrics, LeadPipelineFilters } from '../repositories/analytics'

/**
 * Fetch lead pipeline metrics with optional filtering
 * T077 - useLeadPipeline hook
 */
export function useLeadPipeline(filters?: LeadPipelineFilters) {
  return useQuery<LeadPipelineMetrics>({
    queryKey: ['dashboard', 'metrics', 'lead-pipeline', filters],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filters?.status) params.append('status', filters.status)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.temperature) params.append('temperature', filters.temperature)
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString())
      if (filters?.dateTo) params.append('dateTo', filters.dateTo.toISOString())

      const url = `/api/dashboard/metrics/lead-pipeline${params.toString() ? `?${params}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch lead pipeline metrics')
      }

      const json = await response.json()
      return json.data || json
    },
    staleTime: 60000, // 1 minute
  })
}
