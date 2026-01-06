// lib/api/useLeads.ts
import { useQuery } from '@tanstack/react-query'
import type { PaginatedResult, LeadFilters } from '../repositories/leads'
import type { Lead } from '../db/schema/leads'

export interface UseLeadsParams extends LeadFilters {
  page?: number
  limit?: number
}

/**
 * Fetch paginated leads with optional filtering
 * T080 - useLeads hook
 */
export function useLeads(params?: UseLeadsParams) {
  return useQuery<PaginatedResult<Lead>>({
    queryKey: ['dashboard', 'leads', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()

      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.status) searchParams.append('status', params.status)
      if (params?.type) searchParams.append('type', params.type)
      if (params?.temperature) searchParams.append('temperature', params.temperature)
      if (params?.source) searchParams.append('source', params.source)
      if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom.toISOString())
      if (params?.dateTo) searchParams.append('dateTo', params.dateTo.toISOString())

      const url = `/api/dashboard/leads${searchParams.toString() ? `?${searchParams}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }

      const json = await response.json()
      return json.data || json
    },
    staleTime: 30000, // 30 seconds
  })
}
