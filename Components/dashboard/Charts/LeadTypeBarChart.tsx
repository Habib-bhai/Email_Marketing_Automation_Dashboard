// Components/dashboard/Charts/LeadTypeBarChart.tsx
'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts'

export interface LeadTypeBarChartProps {
  data: {
    name: string
    value: number
  }[]
  className?: string
}

/**
 * T094 - Lead type bar chart
 * Visualizes lead distribution by type
 */
export function LeadTypeBarChart({ data, className }: LeadTypeBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
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
          cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
        <Bar
          dataKey="value"
          fill="hsl(var(--primary))"
          radius={[8, 8, 0, 0]}
          name="Lead Count"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
