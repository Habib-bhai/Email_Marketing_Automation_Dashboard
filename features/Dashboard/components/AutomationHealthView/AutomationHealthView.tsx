'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { PieChart } from '@/Components/charts/PieChart'
import { WarningIndicator } from '@/Components/ui/WarningIndicator'

const healthData = [
  { name: 'Healthy', value: 5, fill: 'hsl(142 76% 36%)' },
  { name: 'Warning', value: 2, fill: 'hsl(48 96% 53%)' },
  { name: 'Error', value: 1, fill: 'hsl(0 84% 60%)' },
]

const workflowIssues = [
  {
    id: '1',
    level: 'error' as const,
    title: 'Workflow Failed',
    message: 'Email enrichment workflow has failed 3 times in the last hour. Check API credentials.',
  },
  {
    id: '2',
    level: 'warning' as const,
    title: 'High Execution Time',
    message: 'Lead qualification workflow is taking 50% longer than average. Consider optimization.',
  },
  {
    id: '3',
    level: 'info' as const,
    title: 'Scheduled Maintenance',
    message: 'API integration maintenance scheduled for tomorrow at 2 AM UTC.',
  },
]

export function AutomationHealthView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Automation Health</h2>
        <p className="text-sm text-muted-foreground">
          Monitor workflow status and system health
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={healthData} height={350} innerRadius={60} outerRadius={100} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
          {workflowIssues.map((issue) => (
            <WarningIndicator
              key={issue.id}
              level={issue.level}
              title={issue.title}
              message={issue.message}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Uptime</div>
            <div className="mt-2 text-2xl font-bold">99.8%</div>
            <div className="mt-1 text-sm text-green-600">Last 30 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Avg Response Time</div>
            <div className="mt-2 text-2xl font-bold">245ms</div>
            <div className="mt-1 text-sm text-green-600">-12ms from last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Failed Executions</div>
            <div className="mt-2 text-2xl font-bold">3</div>
            <div className="mt-1 text-sm text-red-600">+2 from last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Executions</div>
            <div className="mt-2 text-2xl font-bold">12,453</div>
            <div className="mt-1 text-sm text-green-600">+1,234 from last week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
