'use client'

import { forwardRef } from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils/cn'

export interface BarChartData {
  name: string
  value: number
  fill?: string
  [key: string]: string | number | undefined
}

export interface BarChartProps {
  data: BarChartData[]
  dataKey?: string
  xAxisKey?: string
  className?: string
  height?: number
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  ({ data, dataKey = 'value', xAxisKey = 'name', className, height = 400 }, ref) => {
    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            role="img"
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey={xAxisKey}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
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
            <Bar
              dataKey={dataKey}
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
  }
)

BarChart.displayName = 'BarChart'
