// Components/landing/HeroSection/ParallaxContainer.tsx
// T158 - Parallax container for layered effects
'use client'

import React, { useRef } from 'react'
import { useParallax } from '@/lib/hooks/useParallax'
import { cn } from '@/lib/utils/cn'

export interface ParallaxContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Parallax speed multiplier
   * @default 0.5
   */
  speed?: number

  /**
   * Enable parallax effect
   * @default true
   */
  enabled?: boolean
}

/**
 * ParallaxContainer - Container with parallax scroll effect
 */
export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  speed = 0.5,
  enabled = true,
  className,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { style } = useParallax(ref, { speed })

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={enabled ? style : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

ParallaxContainer.displayName = 'ParallaxContainer'
