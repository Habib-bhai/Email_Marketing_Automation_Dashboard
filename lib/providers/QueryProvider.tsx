'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // No caching - always fresh
            gcTime: 0, // No garbage collection time - clear immediately
            refetchOnWindowFocus: true, // Refetch when window gains focus
            refetchOnMount: 'always', // Always refetch on mount
            refetchOnReconnect: true, // Refetch on reconnect
            retry: 1,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
