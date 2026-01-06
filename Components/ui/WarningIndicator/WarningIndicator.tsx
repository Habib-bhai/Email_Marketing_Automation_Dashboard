'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export type WarningLevel = 'success' | 'warning' | 'error' | 'info'

export interface WarningIndicatorProps {
  level: WarningLevel
  message: string
  title?: string
  className?: string
}

const levelStyles: Record<WarningLevel, string> = {
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
  error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
}

const levelIcons: Record<WarningLevel, JSX.Element> = {
  success: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export const WarningIndicator = forwardRef<HTMLDivElement, WarningIndicatorProps>(
  ({ level, message, title, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border p-4',
          levelStyles[level],
          className
        )}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{levelIcons[level]}</div>
          <div className="flex-1">
            {title && <p className="font-semibold mb-1">{title}</p>}
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    )
  }
)

WarningIndicator.displayName = 'WarningIndicator'
