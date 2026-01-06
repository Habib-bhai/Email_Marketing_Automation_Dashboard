'use client'

import { forwardRef } from 'react'
import { Card, CardContent } from '@/Components/ui/card'
import { Skeleton } from '@/Components/ui/skeleton'
import { cn } from '@/lib/utils/cn'

export interface SummaryCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  isLoading?: boolean
  className?: string
}

export const SummaryCard = forwardRef<HTMLDivElement, SummaryCardProps>(
  ({ title, value, change, trend, isLoading = false, className }, ref) => {
    const trendStyles = {
      up: 'text-green-600 dark:text-green-400',
      down: 'text-red-600 dark:text-red-400',
      neutral: 'text-muted-foreground',
    }

    if (isLoading) {
      return (
        <Card ref={ref} className={className}>
          <CardContent className="p-6">
            <Skeleton className="mb-2 h-5 w-3/5" role="status" />
            <Skeleton className="mb-2 h-8 w-2/5" role="status" />
            <Skeleton className="h-4 w-[30%]" role="status" />
          </CardContent>
        </Card>
      )
    }

    return (
      <Card ref={ref} className={className}>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {change && trend && (
            <p className={cn('mt-2 text-sm font-medium', trendStyles[trend])}>
              {change}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }
)

SummaryCard.displayName = 'SummaryCard'
