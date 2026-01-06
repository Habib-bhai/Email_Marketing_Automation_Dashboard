// app/dashboard/campaigns/[id]/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { LoadingState } from '@/Components/dashboard/StateHandlers/LoadingState'
import { ErrorState } from '@/Components/dashboard/StateHandlers/ErrorState'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  ArrowLeft,
  Mail, 
  MailOpen, 
  Reply, 
  SendHorizontal, 
  AlertCircle,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  Clock
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

interface CampaignDetails {
  campaign: {
    id: string
    name: string
    status: string
    emailsSent: number
    opensDetected: number
    repliesReceived: number
    followUpsSent: number
    lastFollowUpsSent: number
    openRate: string
    replyRate: string
    followUpRate: string
    startedAt: string
    endedAt?: string
    createdAt: string
  }
  metrics: {
    totalEvents: number
    uniqueLeads: number
    eventTypeCounts: Record<string, number>
    averageEventsPerLead: string
  }
  timeline: Array<{
    date: string
    sent: number
    opened: number
    replied: number
    follow_ups: number
    last_follow_ups: number
  }>
  recentEngagements: Array<{
    id: string
    eventType: string
    occurredAt: string
    leadId?: string
    metadata?: any
  }>
}

/**
 * Campaign Detail Page
 * Shows detailed metrics and engagement history for a single campaign
 */
export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [data, setData] = useState<CampaignDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const id = await params

  async function fetchCampaignDetails() {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/dashboard/campaigns/${id}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campaign: ${response.status}`)
      }
      
      const json = await response.json()
      setData(json.data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaignDetails()
  }, [id])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard/campaigns')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
        <LoadingState count={8} />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard/campaigns')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
        <ErrorState 
          message="Failed to load campaign details" 
          error={error || new Error('No data')}
          onRetry={fetchCampaignDetails}
        />
      </div>
    )
  }

  const { campaign, metrics, timeline, recentEngagements } = data

  function getStatusColor(status: string) {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-500'
      case 'Paused': return 'bg-yellow-500/10 text-yellow-500'
      case 'Completed': return 'bg-blue-500/10 text-blue-500'
      case 'Draft': return 'bg-gray-500/10 text-gray-500'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  function getEventTypeLabel(eventType: string): string {
    const labels: Record<string, string> = {
      sent: 'Email Sent',
      opened: 'Email Opened',
      replied: 'Reply Received',
      follow_up_sent: 'Follow-up Sent',
      last_follow_up_sent: 'Last Follow-up Sent',
      bounced: 'Bounced',
      clicked: 'Link Clicked',
      unsubscribed: 'Unsubscribed'
    }
    return labels[eventType] || eventType
  }

  function getEventTypeColor(eventType: string): string {
    const colors: Record<string, string> = {
      sent: 'bg-blue-500/10 text-blue-500',
      opened: 'bg-cyan-500/10 text-cyan-500',
      replied: 'bg-green-500/10 text-green-500',
      follow_up_sent: 'bg-purple-500/10 text-purple-500',
      last_follow_up_sent: 'bg-orange-500/10 text-orange-500',
      bounced: 'bg-red-500/10 text-red-500',
      clicked: 'bg-yellow-500/10 text-yellow-500',
      unsubscribed: 'bg-gray-500/10 text-gray-500'
    }
    return colors[eventType] || 'bg-gray-500/10 text-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard/campaigns')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Started {new Date(campaign.startedAt).toLocaleDateString()}
              {campaign.endedAt && ` • Ended ${new Date(campaign.endedAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>
        <Button onClick={fetchCampaignDetails}>Refresh</Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.emailsSent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
            <SendHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.followUpsSent}</div>
            <p className="text-xs text-muted-foreground">
              {campaign.followUpRate}% of sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Follow-ups</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.lastFollowUpsSent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opens</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.opensDetected}</div>
            <p className="text-xs text-muted-foreground">
              {campaign.openRate}% rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replies</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.repliesReceived}</div>
            <p className="text-xs text-muted-foreground">
              {campaign.replyRate}% rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Events/Lead</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageEventsPerLead}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Types</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(metrics.eventTypeCounts).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Line Chart - Daily Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Timeline</CardTitle>
            <CardDescription>Email events over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line type="monotone" dataKey="sent" stroke="#3b82f6" name="Sent" />
                <Line type="monotone" dataKey="follow_ups" stroke="#8b5cf6" name="Follow-ups" />
                <Line type="monotone" dataKey="opened" stroke="#06b6d4" name="Opened" />
                <Line type="monotone" dataKey="replied" stroke="#10b981" name="Replied" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Event Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Distribution</CardTitle>
            <CardDescription>Breakdown by event type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={Object.entries(metrics.eventTypeCounts).map(([type, count]) => ({
                  type: getEventTypeLabel(type),
                  count
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Engagements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Engagement Events</CardTitle>
          <CardDescription>
            Latest 50 events for this campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentEngagements.map((engagement) => (
              <div 
                key={engagement.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge className={getEventTypeColor(engagement.eventType)}>
                    {getEventTypeLabel(engagement.eventType)}
                  </Badge>
                  {engagement.leadId && (
                    <span className="text-sm text-muted-foreground">
                      Lead: {engagement.leadId}
                    </span>
                  )}
                  {engagement.metadata?.leadEmail && (
                    <span className="text-sm text-muted-foreground">
                      {engagement.metadata.leadEmail}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(engagement.occurredAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
