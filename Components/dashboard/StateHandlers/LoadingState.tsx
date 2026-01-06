// Components/dashboard/StateHandlers/LoadingState.tsx
import { Skeleton } from '@/Components/ui/skeleton'

export interface LoadingStateProps {
  count?: number
  className?: string
}

/**
 * T083 - Loading state with skeleton loaders
 * Shows skeleton placeholders while data is being fetched
 */
export function LoadingState({ count = 3, className }: LoadingStateProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3 mb-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ))}
    </div>
  )
}
