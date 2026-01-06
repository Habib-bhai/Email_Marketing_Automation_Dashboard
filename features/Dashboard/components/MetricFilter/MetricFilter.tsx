'use client'

import { forwardRef } from 'react'
import { Tab } from '@/Components/ui/Tab'
import { cn } from '@/lib/utils/cn'

export interface FilterOption {
  id: string
  label: string
}

export interface MetricFilterProps {
  filters: FilterOption[]
  activeFilter: string
  onFilterChange: (filterId: string) => void
  className?: string
}

export const MetricFilter = forwardRef<HTMLDivElement, MetricFilterProps>(
  ({ filters, activeFilter, onFilterChange, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1', className)}
      >
        {filters.map((filter) => (
          <Tab
            key={filter.id}
            active={activeFilter === filter.id}
            onClick={() => onFilterChange(filter.id)}
            className="px-4"
          >
            {filter.label}
          </Tab>
        ))}
      </div>
    )
  }
)

MetricFilter.displayName = 'MetricFilter'
