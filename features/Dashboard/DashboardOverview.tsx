'use client'

import { useDashboardStore } from '@/lib/stores/useDashboardStore'
import { TabNavigation } from './components/TabNavigation'
import { SummaryCard } from './components/SummaryCard'
import { LeadPipelineView } from './components/LeadPipelineView'
import { EmailAnalyticsView } from './components/EmailAnalyticsView'
import { AutomationHealthView } from './components/AutomationHealthView'
import { useDashboardMetrics } from './hooks/useDashboardMetrics'

export function DashboardOverview() {
  const { activeTab, setActiveTab } = useDashboardStore()
  const { data: metrics, isLoading } = useDashboardMetrics()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your email marketing automation performance
          </p>
        </div>

        <div className="mb-8">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {activeTab === 'overview' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Total Leads"
              value={metrics?.totalLeads ?? 0}
              change="+12%"
              trend="up"
              isLoading={isLoading}
            />
            <SummaryCard
              title="Reply Rate"
              value={metrics?.replyRate ? `${metrics.replyRate}%` : '0%'}
              change="+3%"
              trend="up"
              isLoading={isLoading}
            />
            <SummaryCard
              title="Enrichment Success"
              value={metrics?.enrichmentSuccess ? `${metrics.enrichmentSuccess}%` : '0%'}
              change="-2%"
              trend="down"
              isLoading={isLoading}
            />
            <SummaryCard
              title="Active Workflows"
              value={metrics?.activeWorkflows ?? 0}
              change="0%"
              trend="neutral"
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === 'pipeline' && <LeadPipelineView />}

        {activeTab === 'email' && <EmailAnalyticsView />}

        {activeTab === 'health' && <AutomationHealthView />}
      </div>
    </div>
  )
}
