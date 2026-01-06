'use client'

import { forwardRef } from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils/cn'

export interface LineConfig {
  dataKey: string
  stroke: string
  name?: string
  strokeWidth?: number
}

export interface LineChartData {
  name: string
  [key: string]: string | number
}

export interface LineChartProps {
  data: LineChartData[]
  lines: LineConfig[]
  xAxisKey?: string
  className?: string
  height?: number
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  ({ data, lines, xAxisKey = 'name', className, height = 400 }, ref) => {
    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart
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
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth || 2}
                name={line.name || line.dataKey}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    )
  }
)

LineChart.displayName = 'LineChart'
