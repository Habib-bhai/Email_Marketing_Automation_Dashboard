'use client'

import { forwardRef } from 'react'
import { Button } from '@/Components/ui/button'
import { cn } from '@/lib/utils/cn'

export interface DateRangeOption {
  id: string
  label: string
  value: string
}

export interface DateRangePickerProps {
  options: DateRangeOption[]
  selected: string
  onSelect: (value: string) => void
  className?: string
}

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  ({ options, selected, onSelect, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)}>
        <span className="text-sm font-medium text-muted-foreground">Period:</span>
        <div className="inline-flex rounded-md shadow-sm">
          {options.map((option, index) => (
            <Button
              key={option.id}
              variant={selected === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(option.value)}
              className={cn(
                'rounded-none',
                index === 0 && 'rounded-l-md',
                index === options.length - 1 && 'rounded-r-md'
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    )
  }
)

DateRangePicker.displayName = 'DateRangePicker'
