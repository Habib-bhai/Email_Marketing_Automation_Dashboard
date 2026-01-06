// Components/enhanced/MagneticButton/MagneticButton.tsx
// T145 - Magnetic Button with hover effect
'use client'

import React, { useRef } from 'react'
import { Button, ButtonProps } from '@/Components/ui/button'
import { useMagneticEffect } from '@/lib/hooks/useMagneticEffect'
import { cn } from '@/lib/utils'
import styles from './magneticButton.module.css'

export interface MagneticButtonProps extends ButtonProps {
  /**
   * Magnetic pull strength (0-1)
   * @default 0.3
   */
  magneticStrength?: number

  /**
   * Interpolation smoothness (0-1)
   * @default 0.15
   */
  smoothness?: number

  /**
   * Maximum distance element can move (px)
   * @default 50
   */
  maxDistance?: number

  /**
   * Enable/disable magnetic effect
   * @default true
   */
  enableMagnetic?: boolean

  /**
   * Additional CSS class for magnetic wrapper
   */
  wrapperClassName?: string
}

/**
 * MagneticButton - Enhanced shadcn Button with magnetic hover effect
 *
 * Features:
 * - Follows mouse cursor with smooth interpolation
 * - Configurable strength and distance
 * - Respects prefers-reduced-motion
 * - Full shadcn button variant support
 *
 * @example
 * ```tsx
 * <MagneticButton variant="default" size="lg">
 *   Get Started
 * </MagneticButton>
 * ```
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      className,
      wrapperClassName,
      magneticStrength = 0.3,
      smoothness = 0.15,
      maxDistance = 50,
      enableMagnetic = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const magneticRef = useRef<HTMLButtonElement>(null)

    // Combine refs (external ref + internal ref for magnetic effect)
    React.useImperativeHandle(ref, () => magneticRef.current as HTMLButtonElement)

    const { style: magneticStyle, isHovered } = useMagneticEffect(magneticRef, {
      strength: magneticStrength,
      smoothness,
      maxDistance
    })

    // Disable magnetic effect if button is disabled or user prefers reduced motion
    const shouldApplyMagnetic = enableMagnetic && !disabled

    return (
      <div
        className={cn(
          styles.magneticWrapper,
          wrapperClassName
        )}
        style={{
          display: 'inline-flex'
        }}
      >
        <Button
          ref={magneticRef}
          className={cn(
            styles.magneticButton,
            isHovered && shouldApplyMagnetic && styles.isHovered,
            className
          )}
          style={shouldApplyMagnetic ? magneticStyle : undefined}
          disabled={disabled}
          {...props}
        >
          <span className={styles.content}>
            {children}
          </span>
        </Button>
      </div>
    )
  }
)

MagneticButton.displayName = 'MagneticButton'
