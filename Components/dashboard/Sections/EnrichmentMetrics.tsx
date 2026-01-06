// Components/dashboard/Sections/EnrichmentMetrics.tsx
'use client'

import { MetricCard } from '@/Components/dashboard/MetricCard/MetricCard'
import { SkeletonCard } from '@/Components/dashboard/StateHandlers/SkeletonCard'
import { Database, CheckCircle, Clock, XCircle } from 'lucide-react'

/**
 * T104 - Enrichment metrics section
 * Shows data enrichment statistics
 * Note: This is a placeholder - real implementation needs enrichment API endpoints
 */
export function EnrichmentMetrics() {
  // Mock data - replace with real API call when enrichment endpoints are available
  const metrics = {
    totalEnrichments: 1250,
    successfulEnrichments: 1100,
    pendingEnrichments: 80,
    failedEnrichments: 70
  }

  const successRate = ((metrics.successfulEnrichments / metrics.totalEnrichments) * 100).toFixed(1)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Data Enrichment</h2>
        <p className="text-sm text-muted-foreground">
          Track lead enrichment performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Enrichments"
          value={metrics.totalEnrichments}
          icon={Database}
          color="primary"
          subtitle="All enrichment attempts"
        />

        <MetricCard
          title="Successful"
          value={metrics.successfulEnrichments}
          icon={CheckCircle}
          color="success"
          subtitle={`${successRate}% success rate`}
        />

        <MetricCard
          title="Pending"
          value={metrics.pendingEnrichments}
          icon={Clock}
          color="warning"
          subtitle="In progress"
        />

        <MetricCard
          title="Failed"
          value={metrics.failedEnrichments}
          icon={XCircle}
          color="danger"
          subtitle="Needs attention"
        />
      </div>
    </div>
  )
}
