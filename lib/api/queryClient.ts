// lib/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

/**
 * Configure React Query client with optimal defaults
 * T081 - QueryClient configuration
 * UPDATED: Caching completely disabled for real-time data display
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // No caching - always fresh
      gcTime: 0, // No garbage collection time - clear immediately
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnMount: 'always', // Always refetch on component mount
      refetchOnReconnect: true, // Refetch when network reconnects
      retry: 1, // Retry failed requests once
      retryDelay: 1000, // 1 second delay before retry
    },
    mutations: {
      retry: 1, // Retry mutations once
      retryDelay: 1000 //1 second delay before retry
    }
  }
})
