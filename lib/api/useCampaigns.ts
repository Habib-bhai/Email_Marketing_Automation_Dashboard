// lib/api/useCampaigns.ts
import { useQuery } from '@tanstack/react-query'
import type { PaginatedResult } from '../repositories/campaigns'
import type { Campaign } from '../db/schema/campaigns'

export interface UseCampaignsParams {
  page?: number
  limit?: number
  status?: 'Draft' | 'Active' | 'Paused' | 'Completed'
}

/**
 * Fetch paginated campaigns with optional filtering
 * T079 - useCampaigns hook
 */
export function useCampaigns(params?: UseCampaignsParams) {
  return useQuery<PaginatedResult<Campaign>>({
    queryKey: ['dashboard', 'campaigns', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()

      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.status) searchParams.append('status', params.status)

      const url = `/api/dashboard/campaigns${searchParams.toString() ? `?${searchParams}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }

      const json = await response.json()
      return json.data || json
    },
    staleTime: 30000, // 30 seconds
  })
}
