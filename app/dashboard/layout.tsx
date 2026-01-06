// app/dashboard/layout.tsx
'use client'

import { DashboardLayout } from '@/Components/dashboard/Layout/DashboardLayout'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/api/queryClient'
import { ReactNode } from 'react'

/**
 * T107 - Dashboard layout wrapper
 * Wraps dashboard pages with layout and React Query provider
 */
export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </QueryClientProvider>
  )
}
