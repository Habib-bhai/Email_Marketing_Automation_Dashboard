'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { BarChart } from '@/Components/charts/BarChart'
import { MetricFilter } from '../MetricFilter'

const pipelineData = [
  { name: 'New', value: 45, fill: 'hsl(var(--chart-1))' },
  { name: 'Contacted', value: 32, fill: 'hsl(var(--chart-2))' },
  { name: 'Qualified', value: 21, fill: 'hsl(var(--chart-3))' },
  { name: 'Proposal', value: 12, fill: 'hsl(var(--chart-4))' },
  { name: 'Won', value: 8, fill: 'hsl(var(--chart-5))' },
]

const filters = [
  { id: 'all', label: 'All Time' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
]

export function LeadPipelineView() {
  const [activeFilter, setActiveFilter] = useState('7d')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Pipeline</h2>
          <p className="text-sm text-muted-foreground">
            Track leads through your sales funnel
          </p>
        </div>
        <MetricFilter
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={pipelineData} height={400} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
            <div className="mt-2 text-2xl font-bold">17.8%</div>
            <div className="mt-1 text-sm text-green-600">+2.1% from last period</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Avg. Deal Size</div>
            <div className="mt-2 text-2xl font-bold">$12,450</div>
            <div className="mt-1 text-sm text-green-600">+$1,200 from last period</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Sales Cycle</div>
            <div className="mt-2 text-2xl font-bold">28 days</div>
            <div className="mt-1 text-sm text-red-600">+3 days from last period</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
