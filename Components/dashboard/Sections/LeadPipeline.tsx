// Components/dashboard/Sections/LeadPipeline.tsx
'use client'

import { useMemo } from 'react'
import { ChartCard } from '@/Components/dashboard/ChartCard/ChartCard'
import { LeadStatusDonutChart } from '@/Components/dashboard/Charts/LeadStatusDonutChart'
import { LeadTypeBarChart } from '@/Components/dashboard/Charts/LeadTypeBarChart'
import { FilterBar } from '@/Components/dashboard/FilterBar/FilterBar'
import { RefreshButton } from '@/Components/dashboard/RefreshButton/RefreshButton'
import { useLeadPipeline } from '@/lib/api/useLeadPipeline'
import { useDashboardFilters } from '@/lib/stores/dashboardFilters'
import { transformToChartData, getLeadStatusColor, CHART_COLORS } from '@/lib/utils/chartHelpers'

/**
 * T102 - Lead pipeline section
 * Visualizes lead distribution with filtering
 */
export function LeadPipeline() {
  // Extract individual values to prevent object recreation on every render
  const leadStatus = useDashboardFilters((state) => state.leadStatus)
  const leadType = useDashboardFilters((state) => state.leadType)
  const leadTemperature = useDashboardFilters((state) => state.leadTemperature)
  const dateFrom = useDashboardFilters((state) => state.dateFrom)
  const dateTo = useDashboardFilters((state) => state.dateTo)

  // Memoize filters object to prevent infinite re-renders
  const filters = useMemo(() => ({
    status: leadStatus,
    type: leadType,
    temperature: leadTemperature,
    dateFrom: dateFrom,
    dateTo: dateTo
  }), [leadStatus, leadType, leadTemperature, dateFrom, dateTo])

  const { data, isLoading, error, refetch } = useLeadPipeline(filters)

  const statusChartData = data?.byStatus
    ? transformToChartData(data.byStatus, {
        Processed: CHART_COLORS.processed,
        Unprocessed: CHART_COLORS.unprocessed
      })
        .map((d) => ({ ...d, color: d.color ?? getLeadStatusColor(d.name) }))
    : []

  const typeChartData = data?.byType
    ? transformToChartData(data.byType, {
        Brand: CHART_COLORS.brand,
        Apollo: CHART_COLORS.apollo,
        Cold: CHART_COLORS.coldLead,
        Warm: CHART_COLORS.warmLead
      })
    : []

  const isEmpty = data ? data.totalLeads === 0 : false

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold truncate">Lead Pipeline</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Visualize lead distribution and status
          </p>
        </div>
        <div className="flex-shrink-0">
          <RefreshButton
            queryKeys={[['dashboard', 'metrics', 'lead-pipeline']]}
            showLabel
          />
        </div>
      </div>

      <FilterBar showLeadFilters />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <ChartCard
          title="Lead Status Distribution"
          description="Processed vs Unprocessed leads"
          loading={isLoading}
          error={error ?? undefined}
          isEmpty={isEmpty}
          onRetry={() => refetch()}
          emptyMessage="No leads available"
        >
          <LeadStatusDonutChart data={statusChartData} />
        </ChartCard>

        <ChartCard
          title="Lead Type Distribution"
          description="Breakdown by lead type"
          loading={isLoading}
          error={error ?? undefined}
          isEmpty={isEmpty}
          onRetry={() => refetch()}
          emptyMessage="No leads available"
        >
          <LeadTypeBarChart data={typeChartData} />
        </ChartCard>
      </div>
    </div>
  )
}
