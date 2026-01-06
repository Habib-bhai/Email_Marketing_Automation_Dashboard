'use client'

import { useQuery } from '@tanstack/react-query'
import type { DashboardMetrics } from '@/lib/types/dashboard'

async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await fetch('/api/dashboard/metrics')
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard metrics')
  }
  return response.json()
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60, // Refetch every minute
  })
}
