'use client'

import { forwardRef } from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { cn } from '@/lib/utils/cn'

export interface PieChartData {
  name: string
  value: number
  fill?: string
}

export interface PieChartProps {
  data: PieChartData[]
  dataKey?: string
  nameKey?: string
  className?: string
  height?: number
  innerRadius?: number
  outerRadius?: number
}

export const PieChart = forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      dataKey = 'value',
      nameKey = 'name',
      className,
      height = 400,
      innerRadius = 0,
      outerRadius = 120,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart role="img">
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    )
  }
)

PieChart.displayName = 'PieChart'
