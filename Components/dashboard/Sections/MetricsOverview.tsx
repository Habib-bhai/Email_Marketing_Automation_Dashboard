// Components/dashboard/Sections/MetricsOverview.tsx
'use client'

import { MetricCard } from '@/Components/dashboard/MetricCard/MetricCard'
import { SkeletonCard } from '@/Components/dashboard/StateHandlers/SkeletonCard'
import { ErrorState } from '@/Components/dashboard/StateHandlers/ErrorState'
import { useDashboardMetrics } from '@/lib/api/useDashboardMetrics'
import { Users, Mail, TrendingUp, Activity } from 'lucide-react'

/**
 * T101 - Metrics overview section
 * Displays key metrics in card format
 */
export function MetricsOverview() {
  const { data: metrics, isLoading, error, refetch } = useDashboardMetrics()

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Failed to load metrics"
        onRetry={() => refetch()}
      />
    )
  }

  if (isLoading || !metrics) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} showHeader={false} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Total Leads"
        value={metrics.totalLeads}
        icon={Users}
        color="primary"
        subtitle="All leads in system"
      />

      <MetricCard
        title="Active Campaigns"
        value={metrics.activeCampaigns}
        icon={Mail}
        color="success"
        subtitle="Currently running"
      />

      <MetricCard
        title="Reply Rate"
        value={metrics.replyRate}
        unit="%"
        icon={TrendingUp}
        color="info"
        subtitle="Email engagement"
        valueFormatter={(val) => val.toFixed(1)}
      />

      <MetricCard
        title="Open Rate"
        value={metrics.openRate}
        unit="%"
        icon={Activity}
        color="warning"
        subtitle="Email opens"
        valueFormatter={(val) => val.toFixed(1)}
      />
    </div>
  )
}
