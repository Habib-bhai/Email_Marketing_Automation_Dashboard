// Components/landing/HeroSection/FloatingMetrics.tsx
// T154 - Floating metrics animation
'use client'

import React from 'react'
import { AnimatedCounter } from '@/Components/enhanced/AnimatedCounter'
import { cn } from '@/lib/utils/cn'

export interface FloatingMetricsProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics?: Array<{ label: string; value: number; suffix?: string }>
}

export const FloatingMetrics: React.FC<FloatingMetricsProps> = ({
  metrics = [
    { label: 'Leads Processed', value: 10000, suffix: '+' },
    { label: 'Reply Rate', value: 8.5, suffix: '%' },
    { label: 'Active Campaigns', value: 50 }
  ],
  className,
  ...props
}) => {
  return (
    <div className={cn('grid gap-4', className)} {...props}>
      {metrics.map((metric, i) => (
        <div
          key={i}
          className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 animate-float"
          style={{ animationDelay: `${i * 200}ms` }}
        >
          <div className="text-sm opacity-70">{metric.label}</div>
          <div className="text-2xl font-bold">
            <AnimatedCounter value={metric.value} suffix={metric.suffix} />
          </div>
        </div>
      ))}
    </div>
  )
}

FloatingMetrics.displayName = 'FloatingMetrics'
