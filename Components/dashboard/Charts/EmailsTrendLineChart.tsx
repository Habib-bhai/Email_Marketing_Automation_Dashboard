// Components/dashboard/Charts/EmailsTrendLineChart.tsx
'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

export interface EmailsTrendLineChartProps {
  data: {
    date: string
    sent: number
    opened?: number
    replied?: number
  }[]
  className?: string
}

/**
 * T095 - Emails trend line chart
 * Visualizes email metrics over time
 */
export function EmailsTrendLineChart({ data, className }: EmailsTrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip
          formatter={(value: number) => value.toLocaleString()}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => <span className="text-sm capitalize">{value}</span>}
        />
        <Line
          type="monotone"
          dataKey="sent"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Emails Sent"
        />
        <Line
          type="monotone"
          dataKey="opened"
          stroke="hsl(199 89% 48%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Opened"
        />
        <Line
          type="monotone"
          dataKey="replied"
          stroke="hsl(142 76% 36%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Replied"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
