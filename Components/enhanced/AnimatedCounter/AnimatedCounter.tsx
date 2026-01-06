// Components/enhanced/AnimatedCounter/AnimatedCounter.tsx
// T149 - Animated counter component with smooth transitions
'use client'

import React, { useEffect, useState } from 'react'
import { useAnimatedCounter } from '@/lib/hooks/useAnimatedCounter'
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils/cn'

export interface AnimatedCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Target number to count to
   */
  value: number

  /**
   * Animation duration in milliseconds
   * @default 2000
   */
  duration?: number

  /**
   * Number format options (Intl.NumberFormat)
   */
  formatOptions?: Intl.NumberFormatOptions

  /**
   * Locale for number formatting
   * @default 'en-US'
   */
  locale?: string

  /**
   * Prefix to display before number
   */
  prefix?: string

  /**
   * Suffix to display after number
   */
  suffix?: string

  /**
   * Decimal places to display
   * @default 0
   */
  decimals?: number

  /**
   * Start animation when component enters viewport
   * @default true
   */
  startOnIntersect?: boolean

  /**
   * Intersection threshold (0-1)
   * @default 0.5
   */
  threshold?: number

  /**
   * Custom easing function
   */
  easing?: (t: number) => number

  /**
   * Additional CSS class for wrapper
   */
  wrapperClassName?: string
}

/**
 * AnimatedCounter - Animated number counter component
 *
 * Features:
 * - Smooth number animation
 * - Intersection observer support
 * - Customizable formatting
 * - Prefix/suffix support
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * <AnimatedCounter
 *   value={1250}
 *   duration={2000}
 *   prefix="$"
 *   formatOptions={{ notation: 'compact' }}
 * />
 * ```
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
  formatOptions,
  locale = 'en-US',
  prefix,
  suffix,
  decimals = 0,
  startOnIntersect = true,
  threshold = 0.5,
  easing,
  className,
  wrapperClassName,
  ...props
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(!startOnIntersect)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Use intersection observer if startOnIntersect is enabled
  const { isIntersecting } = useIntersectionObserver(ref, {
    threshold,
    triggerOnce: true
  })

  const isVisible = isIntersecting

  useEffect(() => {
    if (startOnIntersect && isVisible && !hasAnimated) {
      setShouldAnimate(true)
      setHasAnimated(true)
    }
  }, [isVisible, startOnIntersect, hasAnimated])

  // Animate counter
  const currentValue = useAnimatedCounter(value, {
    duration: prefersReducedMotion ? 0 : duration,
    startOnMount: shouldAnimate,
    easing
  })

  // Format number
  const formattedValue = React.useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...formatOptions
    })

    return formatter.format(currentValue)
  }, [currentValue, locale, decimals, formatOptions])

  return (
    <span
      ref={ref}
      className={cn('inline-flex items-baseline', wrapperClassName)}
      {...props}
    >
      {prefix && (
        <span className={cn('mr-1', className)} aria-hidden="true">
          {prefix}
        </span>
      )}
      <span className={className} aria-label={`${prefix || ''}${value}${suffix || ''}`}>
        {formattedValue}
      </span>
      {suffix && (
        <span className={cn('ml-1', className)} aria-hidden="true">
          {suffix}
        </span>
      )}
    </span>
  )
}

AnimatedCounter.displayName = 'AnimatedCounter'
