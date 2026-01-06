'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { LineChart } from '@/Components/charts/LineChart'
import { DateRangePicker } from '@/Components/ui/DateRangePicker'

const analyticsData = [
  { name: 'Mon', opens: 120, clicks: 45, replies: 12 },
  { name: 'Tue', opens: 135, clicks: 52, replies: 15 },
  { name: 'Wed', opens: 150, clicks: 60, replies: 18 },
  { name: 'Thu', opens: 142, clicks: 55, replies: 14 },
  { name: 'Fri', opens: 165, clicks: 68, replies: 20 },
  { name: 'Sat', opens: 95, clicks: 32, replies: 8 },
  { name: 'Sun', opens: 88, clicks: 28, replies: 7 },
]

const lines = [
  { dataKey: 'opens', stroke: 'hsl(var(--chart-1))', name: 'Opens', strokeWidth: 2 },
  { dataKey: 'clicks', stroke: 'hsl(var(--chart-2))', name: 'Clicks', strokeWidth: 2 },
  { dataKey: 'replies', stroke: 'hsl(var(--chart-3))', name: 'Replies', strokeWidth: 2 },
]

const dateRangeOptions = [
  { id: '7d', label: '7D', value: '7d' },
  { id: '30d', label: '30D', value: '30d' },
  { id: '90d', label: '90D', value: '90d' },
  { id: '1y', label: '1Y', value: '1y' },
]

export function EmailAnalyticsView() {
  const [selectedRange, setSelectedRange] = useState('7d')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track email engagement metrics over time
          </p>
        </div>
        <DateRangePicker
          options={dateRangeOptions}
          selected={selectedRange}
          onSelect={setSelectedRange}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart data={analyticsData} lines={lines} height={400} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Open Rate</div>
            <div className="mt-2 text-2xl font-bold">68.5%</div>
            <div className="mt-1 text-sm text-green-600">+5.2% from last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Click Rate</div>
            <div className="mt-2 text-2xl font-bold">24.8%</div>
            <div className="mt-1 text-sm text-green-600">+2.1% from last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Reply Rate</div>
            <div className="mt-2 text-2xl font-bold">6.3%</div>
            <div className="mt-1 text-sm text-green-600">+0.8% from last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Bounce Rate</div>
            <div className="mt-2 text-2xl font-bold">1.2%</div>
            <div className="mt-1 text-sm text-red-600">+0.3% from last week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
