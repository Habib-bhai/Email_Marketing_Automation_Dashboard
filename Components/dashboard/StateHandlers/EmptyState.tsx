// Components/dashboard/StateHandlers/EmptyState.tsx
import { AlertCircle } from 'lucide-react'
import { Button } from '@/Components/ui/button'

export interface EmptyStateProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

/**
 * T084 - Empty state component
 * Shows when no data is available with optional action
 */
export function EmptyState({
  title = 'No data available',
  message = 'There is no data to display at the moment.',
  actionLabel,
  onAction,
  icon,
  className
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className || ''}`}>
      <div className="mb-4 text-muted-foreground">
        {icon || <AlertCircle className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
