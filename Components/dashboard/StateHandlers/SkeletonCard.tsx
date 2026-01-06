// Components/dashboard/StateHandlers/SkeletonCard.tsx
import { Card, CardContent, CardHeader } from '@/Components/ui/card'
import { Skeleton } from '@/Components/ui/skeleton'

export interface SkeletonCardProps {
  className?: string
  showHeader?: boolean
}

/**
 * T086 - Skeleton card component
 * Card-shaped skeleton for loading metric cards
 */
export function SkeletonCard({ className, showHeader = true }: SkeletonCardProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-4 w-[150px]" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-3 w-[200px]" />
        <Skeleton className="h-3 w-[180px]" />
      </CardContent>
    </Card>
  )
}
