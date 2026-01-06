// Components/dashboard/ChartCard/ChartCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { LoadingState } from '@/Components/dashboard/StateHandlers/LoadingState'
import { ErrorState } from '@/Components/dashboard/StateHandlers/ErrorState'
import { EmptyState } from '@/Components/dashboard/StateHandlers/EmptyState'
import { ReactNode } from 'react'

export interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  loading?: boolean
  error?: Error | string
  isEmpty?: boolean
  onRetry?: () => void
  emptyMessage?: string
  className?: string
  headerAction?: ReactNode
}

/**
 * T090 - Chart card wrapper component
 * Wraps charts with loading, error, and empty states
 */
export function ChartCard({
  title,
  description,
  children,
  loading,
  error,
  isEmpty,
  onRetry,
  emptyMessage = 'No data available for this chart',
  className,
  headerAction
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState count={3} className="py-4" />
        ) : error ? (
          <ErrorState
            error={error}
            title="Failed to load chart"
            onRetry={onRetry}
            className="py-8"
          />
        ) : isEmpty ? (
          <EmptyState
            title="No data"
            message={emptyMessage}
            className="py-8"
          />
        ) : (
          <div className="w-full">{children}</div>
        )}
      </CardContent>
    </Card>
  )
}
