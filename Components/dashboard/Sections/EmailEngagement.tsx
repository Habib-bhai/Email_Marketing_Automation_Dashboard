// Components/dashboard/Sections/EmailEngagement.tsx
'use client'

import { ChartCard } from '@/Components/dashboard/ChartCard/ChartCard'
import { MetricCard } from '@/Components/dashboard/MetricCard/MetricCard'
import { EmailsTrendLineChart } from '@/Components/dashboard/Charts/EmailsTrendLineChart'
import { Mail, MailOpen, Reply, SendHorizontal, AlertCircle } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface EmailMetrics {
  totalEmailsSent: number
  totalRepliesReceived: number
  totalOpensDetected: number
  totalFollowUpsSent: number
  totalLastFollowUpsSent: number
  replyRate: number
  openRate: number
  lastUpdated: string
}

interface TrendDataPoint {
  date: string
  sent: number
  opened: number
  replied: number
}

export function EmailEngagement() {
  const [data, setData] = useState<EmailMetrics | null>(null)
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const hasFetched = useRef(false)

  async function fetchData() {
    setIsLoading(true)
    setError(null)
    
    try {
      const metricsResponse = await fetch('/api/dashboard/metrics/email-engagement', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (!metricsResponse.ok) {
        throw new Error('Metrics API failed: ' + metricsResponse.status)
      }
      
      const metricsJson = await metricsResponse.json()
      const metrics = metricsJson.data || metricsJson
      console.log('Email Metrics:', metrics)
      
      setData(metrics)
      
      const trendResponse = await fetch('/api/dashboard/metrics/email-trend?days=7', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (trendResponse.ok) {
        const trendJson = await trendResponse.json()
        const trend = trendJson.data || trendJson
        setTrendData(trend)
      }
      
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchData()
    }
  }, [])

  function handleRefresh() {
    fetchData()
  }

  const isEmpty = data ? data.totalEmailsSent === 0 : true

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Engagement</h2>
          <p className="text-sm text-muted-foreground">
            Track email performance metrics
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard
          title="Total Emails Sent"
          value={data?.totalEmailsSent ?? 0}
          icon={Mail}
          color="primary"
          loading={isLoading}
          animate={false}
        />

        <MetricCard
          title="Follow-Ups Sent"
          value={data?.totalFollowUpsSent ?? 0}
          icon={SendHorizontal}
          color="info"
          loading={isLoading}
          animate={false}
        />

        <MetricCard
          title="Last Follow-Ups"
          value={data?.totalLastFollowUpsSent ?? 0}
          icon={AlertCircle}
          color="warning"
          loading={isLoading}
          animate={false}
        />

        <MetricCard
          title="Emails Opened"
          value={data?.totalOpensDetected ?? 0}
          icon={MailOpen}
          color="primary"
          loading={isLoading}
          subtitle={(data?.openRate?.toFixed(1) ?? '0') + '% open rate'}
          animate={false}
        />

        <MetricCard
          title="Replies Received"
          value={data?.totalRepliesReceived ?? 0}
          icon={Reply}
          color="success"
          loading={isLoading}
          subtitle={(data?.replyRate?.toFixed(1) ?? '0') + '% reply rate'}
          animate={false}
        />
      </div>

      <ChartCard
        title="Email Trends (Last 7 Days)"
        description="Sent, opened, and replied emails over time"
        loading={isLoading}
        error={error ?? undefined}
        isEmpty={isEmpty && !isLoading}
        onRetry={handleRefresh}
        emptyMessage="No email data available"
      >
        <EmailsTrendLineChart data={trendData} />
      </ChartCard>
    </div>
  )
}
