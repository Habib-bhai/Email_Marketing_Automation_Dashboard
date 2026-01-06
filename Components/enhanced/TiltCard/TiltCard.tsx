// Components/enhanced/TiltCard/TiltCard.tsx
// T147 - 3D Tilt Card with perspective effect
'use client'

import React, { useRef } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/Components/ui/card'
import { useTiltEffect } from '@/lib/hooks/useTiltEffect'
import { cn } from '@/lib/utils'
import styles from './tiltCard.module.css'

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum tilt angle in degrees
   * @default 15
   */
  maxTilt?: number

  /**
   * Perspective value for 3D effect
   * @default 1000
   */
  perspective?: number

  /**
   * Scale factor on hover
   * @default 1.05
   */
  scale?: number

  /**
   * Animation speed in milliseconds
   * @default 400
   */
  speed?: number

  /**
   * Enable glare effect
   * @default false
   */
  glare?: boolean

  /**
   * Enable gyroscope on mobile
   * @default true
   */
  gyroscope?: boolean

  /**
   * Enable/disable tilt effect
   * @default true
   */
  enableTilt?: boolean

  /**
   * Additional CSS class for tilt wrapper
   */
  wrapperClassName?: string
}

/**
 * TiltCard - Enhanced shadcn Card with 3D tilt effect
 *
 * Features:
 * - 3D tilt based on mouse position
 * - Optional glare effect
 * - Gyroscope support on mobile
 * - Respects prefers-reduced-motion
 * - Full shadcn card component support
 *
 * @example
 * ```tsx
 * <TiltCard glare maxTilt={20}>
 *   <CardHeader>
 *     <CardTitle>Feature Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content here</CardContent>
 * </TiltCard>
 * ```
 */
export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      children,
      className,
      wrapperClassName,
      maxTilt = 15,
      perspective = 1000,
      scale = 1.05,
      speed = 400,
      glare = false,
      gyroscope = true,
      enableTilt = true,
      ...props
    },
    ref
  ) => {
    const tiltRef = useRef<HTMLDivElement>(null)

    // Combine refs (external ref + internal ref for tilt effect)
    React.useImperativeHandle(ref, () => tiltRef.current as HTMLDivElement)

    const {
      style: tiltStyle,
      glareStyle,
      isHovered
    } = useTiltEffect(tiltRef, {
      maxTilt,
      perspective,
      scale,
      speed,
      glare,
      gyroscope
    })

    return (
      <div
        className={cn(
          styles.tiltWrapper,
          wrapperClassName
        )}
        style={{
          perspective: enableTilt ? perspective : undefined
        }}
      >
        <Card
          ref={tiltRef}
          className={cn(
            styles.tiltCard,
            isHovered && enableTilt && styles.isHovered,
            className
          )}
          style={enableTilt ? tiltStyle : undefined}
          {...props}
        >
          {children}

          {/* Glare overlay */}
          {glare && enableTilt && glareStyle && (
            <div
              className={styles.glare}
              style={glareStyle}
              aria-hidden="true"
            />
          )}
        </Card>
      </div>
    )
  }
)

TiltCard.displayName = 'TiltCard'

// Re-export card sub-components for convenience
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
}
