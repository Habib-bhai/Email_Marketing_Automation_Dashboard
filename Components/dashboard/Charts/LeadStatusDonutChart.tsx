// Components/dashboard/Charts/LeadStatusDonutChart.tsx
'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export interface LeadStatusDonutChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
  className?: string
}

const COLORS = {
  Processed: 'hsl(142 76% 36%)',
  Unprocessed: 'hsl(38 92% 50%)',
  Hot: 'hsl(0 84% 60%)',
  Warm: 'hsl(38 92% 50%)',
  Cold: 'hsl(199 89% 48%)'
}

/**
 * T093 - Lead status donut chart
 * Visualizes lead distribution by status
 */
export function LeadStatusDonutChart({ data, className }: LeadStatusDonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => value.toLocaleString()}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
