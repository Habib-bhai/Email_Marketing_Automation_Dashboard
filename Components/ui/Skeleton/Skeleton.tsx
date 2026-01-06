'use client'

import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, ...props }, ref) => {
    const baseStyles = 'animate-pulse bg-muted'

    const variantStyles = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    }

    return (
      <div
        ref={ref}
        className={twMerge(baseStyles, variantStyles[variant], className)}
        style={{
          width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
          height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'
