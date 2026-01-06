// app/dashboard/campaigns/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { LoadingState } from '@/Components/dashboard/StateHandlers/LoadingState'
import { ErrorState } from '@/Components/dashboard/StateHandlers/ErrorState'
import { EmptyState } from '@/Components/dashboard/StateHandlers/EmptyState'
import { Badge } from '@/Components/ui/badge'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  Mail, 
  MailOpen, 
  Reply, 
  SendHorizontal, 
  AlertCircle,
  Calendar,
  TrendingUp,
  ChevronRight
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  status: 'Draft' | 'Active' | 'Paused' | 'Completed'
  emailsSent: number
  opensDetected: number
  repliesReceived: number
  followUpsSent: number
  lastFollowUpsSent: number
  startedAt: string
  endedAt?: string
  createdAt: string
}

/**
 * Campaigns List Page
 * Shows all campaigns with key metrics
 */
export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filter, setFilter] = useState<'all' | 'Active' | 'Paused' | 'Completed'>('all')

  async function fetchCampaigns() {
    setIsLoading(true)
    setError(null)
    
    try {
      const url = filter === 'all' 
        ? '/api/dashboard/campaigns?limit=100'
        : `/api/dashboard/campaigns?limit=100&status=${filter}`
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.status}`)
      }
      
      const json = await response.json()
      setCampaigns(json.data?.data || [])
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [filter])

  function getStatusColor(status: string) {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-500'
      case 'Paused': return 'bg-yellow-500/10 text-yellow-500'
      case 'Completed': return 'bg-blue-500/10 text-blue-500'
      case 'Draft': return 'bg-gray-500/10 text-gray-500'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  function calculateOpenRate(campaign: Campaign): string {
    if (campaign.emailsSent === 0) return '0.0'
    return ((campaign.opensDetected / campaign.emailsSent) * 100).toFixed(1)
  }

  function calculateReplyRate(campaign: Campaign): string {
    if (campaign.emailsSent === 0) return '0.0'
    return ((campaign.repliesReceived / campaign.emailsSent) * 100).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Campaigns</h1>
        </div>
        <LoadingState count={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Campaigns</h1>
        </div>
        <ErrorState 
          message="Failed to load campaigns" 
          error={error}
          onRetry={fetchCampaigns}
        />
      </div>
    )
  }

  const isEmpty = campaigns.length === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your email campaigns
          </p>
        </div>
        <Button onClick={fetchCampaigns}>Refresh</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'Active' ? 'default' : 'outline'}
          onClick={() => setFilter('Active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'Paused' ? 'default' : 'outline'}
          onClick={() => setFilter('Paused')}
        >
          Paused
        </Button>
        <Button
          variant={filter === 'Completed' ? 'default' : 'outline'}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </Button>
      </div>

      {/* Campaigns Grid */}
      {isEmpty ? (
        <EmptyState
          title="No campaigns found"
          message="Create your first campaign to get started"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {campaign.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(campaign.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Mail className="h-4 w-4" />
                      <span>Sent</span>
                    </div>
                    <p className="text-2xl font-bold">{campaign.emailsSent}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MailOpen className="h-4 w-4" />
                      <span>Opened</span>
                    </div>
                    <p className="text-2xl font-bold">{campaign.opensDetected}</p>
                    <p className="text-xs text-muted-foreground">
                      {calculateOpenRate(campaign)}% rate
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Reply className="h-4 w-4" />
                      <span>Replies</span>
                    </div>
                    <p className="text-2xl font-bold">{campaign.repliesReceived}</p>
                    <p className="text-xs text-muted-foreground">
                      {calculateReplyRate(campaign)}% rate
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <SendHorizontal className="h-4 w-4" />
                      <span>Follow-ups</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {campaign.followUpsSent + campaign.lastFollowUpsSent}
                    </p>
                  </div>
                </div>

                {/* View Details Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/dashboard/campaigns/${campaign.id}`)
                  }}
                >
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
