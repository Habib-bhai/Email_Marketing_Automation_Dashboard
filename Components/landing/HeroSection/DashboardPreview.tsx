// Components/landing/HeroSection/DashboardPreview.tsx
// T153 - Dashboard preview mockup component
'use client'

import React from 'react'
import { Card } from '@/Components/ui/card'
import { cn } from '@/lib/utils/cn'

export interface DashboardPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Animation delay in milliseconds
   * @default 0
   */
  delay?: number

  /**
   * Show animated metrics
   * @default true
   */
  animated?: boolean
}

/**
 * DashboardPreview - Mockup of dashboard for hero section
 */
export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  delay = 0,
  animated = true,
  className,
  ...props
}) => {
  return (
    <Card
      className={cn('relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-4', className)}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 bg-slate-800 rounded-lg">
              <div className="h-3 w-16 bg-slate-700 rounded mb-2 animate-pulse" />
              <div className="h-6 w-24 bg-slate-600 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="h-32 bg-slate-800 rounded-lg p-4">
          <div className="h-full flex items-end justify-between gap-2">
            {[0.6, 0.8, 0.5, 0.9, 0.7].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500 rounded-t animate-pulse"
                style={{
                  height: `${height * 100}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

DashboardPreview.displayName = 'DashboardPreview'
