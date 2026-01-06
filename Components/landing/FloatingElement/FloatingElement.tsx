'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  delay = 0
}) => {
  return (
    <div
      className={cn('animate-float', className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: '3s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite'
      }}
    >
      {children}
    </div>
  )
}
