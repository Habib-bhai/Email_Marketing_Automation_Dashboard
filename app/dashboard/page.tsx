// app/dashboard/page.tsx
'use client'

import { MetricsOverview } from '@/Components/dashboard/Sections/MetricsOverview'
import { LeadPipeline } from '@/Components/dashboard/Sections/LeadPipeline'
import { EmailEngagement } from '@/Components/dashboard/Sections/EmailEngagement'
import { EnrichmentMetrics } from '@/Components/dashboard/Sections/EnrichmentMetrics'
import { AutomationHealth } from '@/Components/dashboard/Sections/AutomationHealth'

/**
 * T106 - Main dashboard page
 * Composes all dashboard sections
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top-level metrics */}
      <MetricsOverview />

      {/* Lead pipeline analysis */}
      <LeadPipeline />

      {/* Email engagement tracking */}
      <EmailEngagement />

      {/* Data enrichment stats */}
      <EnrichmentMetrics />

      {/* Automation workflows status */}
      <AutomationHealth />
    </div>
  )
}
