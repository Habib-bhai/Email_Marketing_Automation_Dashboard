// Components/dashboard/StateHandlers/ErrorState.tsx
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/Components/ui/button'

export interface ErrorStateProps {
  error?: Error | string
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * T085 - Error state component
 * Shows when data fetching fails with retry action
 */
export function ErrorState({
  error,
  title = 'Something went wrong',
  message,
  onRetry,
  className
}: ErrorStateProps) {
  const errorMessage = message || (typeof error === 'string' ? error : error?.message) || 'An unexpected error occurred.'

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className || ''}`}>
      <div className="mb-4 text-destructive">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{errorMessage}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          Try Again
        </Button>
      )}
    </div>
  )
}
