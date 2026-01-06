import { NextResponse } from 'next/server'
import type { DashboardMetrics } from '@/lib/types/dashboard'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Mock data - replace with actual data source later
  const metrics: DashboardMetrics = {
    totalLeads: 1234,
    replyRate: 23.5,
    enrichmentSuccess: 87.3,
    activeWorkflows: 8,
    lastUpdated: new Date().toISOString(),
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(metrics)
}
