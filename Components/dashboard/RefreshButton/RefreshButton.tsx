// Components/dashboard/RefreshButton/RefreshButton.tsx
'use client'

import { Button } from '@/Components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

export interface RefreshButtonProps {
  queryKeys?: string[][]
  onRefresh?: () => void | Promise<void>
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost'
  label?: string
  showLabel?: boolean
}

/**
 * T092 - Refresh button component
 * Invalidates React Query cache and triggers refetch
 */
export function RefreshButton({
  queryKeys,
  onRefresh,
  className,
  size = 'sm',
  variant = 'outline',
  label = 'Refresh',
  showLabel = false
}: RefreshButtonProps) {
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      // If specific query keys provided, invalidate those
      if (queryKeys && queryKeys.length > 0) {
        await Promise.all(
          queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: key }))
        )
      } else {
        // Otherwise invalidate all dashboard queries
        await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      }

      // Call custom refresh handler if provided
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      // Keep spinning for at least 500ms for better UX
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`gap-2 ${className || ''}`}
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {showLabel && <span>{label}</span>}
    </Button>
  )
}
