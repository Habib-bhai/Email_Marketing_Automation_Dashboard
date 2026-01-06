// Components/dashboard/Sections/AutomationHealth.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

interface WorkflowStatus {
  id: string
  name: string
  status: 'active' | 'paused' | 'error' | 'idle'
  lastRun?: Date
  executionCount: number
}

/**
 * T105 - Automation health section
 * Shows workflow and automation status
 * Note: This is a placeholder - real implementation needs n8n integration API
 */
export function AutomationHealth() {
  // Mock data - replace with real n8n API integration
  const workflows: WorkflowStatus[] = [
    {
      id: '1',
      name: 'Lead Ingestion Pipeline',
      status: 'active',
      lastRun: new Date('2025-12-31T10:30:00'),
      executionCount: 342
    },
    {
      id: '2',
      name: 'Email Campaign Trigger',
      status: 'active',
      lastRun: new Date('2025-12-31T09:15:00'),
      executionCount: 156
    },
    {
      id: '3',
      name: 'Lead Enrichment Flow',
      status: 'paused',
      lastRun: new Date('2025-12-30T14:00:00'),
      executionCount: 89
    },
    {
      id: '4',
      name: 'Reply Detection',
      status: 'error',
      lastRun: new Date('2025-12-31T08:45:00'),
      executionCount: 234
    }
  ]

  const getStatusBadge = (status: WorkflowStatus['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        )
      case 'paused':
        return (
          <Badge variant="secondary" className="gap-1">
            <Activity className="h-3 w-3" />
            Paused
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Error
          </Badge>
        )
      case 'idle':
        return (
          <Badge variant="outline" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Idle
          </Badge>
        )
    }
  }

  const formatLastRun = (date?: Date) => {
    if (!date) return 'Never'
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60)),
      'minutes'
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Automation Health</h2>
        <p className="text-sm text-muted-foreground">
          Monitor n8n workflow status and execution
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{workflow.name}</h4>
                    {getStatusBadge(workflow.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Executions: {workflow.executionCount}</span>
                    <span>Last run: {formatLastRun(workflow.lastRun)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
