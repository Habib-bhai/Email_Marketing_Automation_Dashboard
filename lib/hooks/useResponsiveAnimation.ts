'use client'

import { useEffect, useState } from 'react'

interface AnimationConfig {
  /**
   * Whether to reduce animations (mobile or prefers-reduced-motion)
   */
  shouldReduce: boolean
  /**
   * Whether user is on a mobile device
   */
  isMobile: boolean
  /**
   * Whether user prefers reduced motion
   */
  prefersReducedMotion: boolean
  /**
   * Particle count multiplier (0.3 for mobile, 1 for desktop)
   */
  particleScale: number
  /**
   * Animation duration multiplier (1.5 for reduced, 1 for normal)
   */
  durationScale: number
}

/**
 * Hook to detect device capabilities and user preferences for animations.
 * Automatically scales down animations on mobile devices and respects
 * prefers-reduced-motion accessibility preference.
 * 
 * @example
 * ```tsx
 * const { shouldReduce, particleScale, isMobile } = useResponsiveAnimation()
 * 
 * // Use particleScale to adjust particle counts
 * const particleCount = Math.floor(100 * particleScale) // 30 on mobile, 100 on desktop
 * 
 * // Conditionally disable expensive animations
 * {!shouldReduce && <ExpensiveAnimation />}
 * ```
 */
export function useResponsiveAnimation(): AnimationConfig {
  const [config, setConfig] = useState<AnimationConfig>({
    shouldReduce: false,
    isMobile: false,
    prefersReducedMotion: false,
    particleScale: 1,
    durationScale: 1,
  })

  useEffect(() => {
    // Check if running on mobile device
    const checkMobile = (): boolean => {
      if (typeof window === 'undefined') return false
      
      // Check for touch support and screen width
      const hasTouchScreen = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      
      const isSmallScreen = window.innerWidth < 768 // Tailwind md breakpoint
      
      // Check user agent for mobile devices
      const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      
      return (hasTouchScreen && isSmallScreen) || mobileUserAgent
    }

    // Check for prefers-reduced-motion
    const checkReducedMotion = (): boolean => {
      if (typeof window === 'undefined') return false
      
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    const isMobile = checkMobile()
    const prefersReducedMotion = checkReducedMotion()
    const shouldReduce = isMobile || prefersReducedMotion

    setConfig({
      shouldReduce,
      isMobile,
      prefersReducedMotion,
      // Reduce particles to 30% on mobile, 50% if prefers-reduced-motion
      particleScale: prefersReducedMotion ? 0.5 : isMobile ? 0.3 : 1,
      // Slow down animations for reduced motion
      durationScale: prefersReducedMotion ? 1.5 : 1,
    })

    // Listen for changes to prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      const prefersReduced = e.matches
      const mobile = checkMobile()
      const reduce = mobile || prefersReduced

      setConfig({
        shouldReduce: reduce,
        isMobile: mobile,
        prefersReducedMotion: prefersReduced,
        particleScale: prefersReduced ? 0.5 : mobile ? 0.3 : 1,
        durationScale: prefersReduced ? 1.5 : 1,
      })
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return config
}

/**
 * Calculate scaled particle count based on device capabilities.
 * 
 * @param baseCount - Base particle count for desktop
 * @param config - Animation configuration from useResponsiveAnimation
 * @returns Scaled particle count (rounded to nearest integer)
 * 
 * @example
 * ```tsx
 * const config = useResponsiveAnimation()
 * const particleCount = getScaledParticleCount(100, config) // 30 on mobile
 * ```
 */
export function getScaledParticleCount(
  baseCount: number,
  config: AnimationConfig
): number {
  return Math.floor(baseCount * config.particleScale)
}

/**
 * Calculate scaled animation duration based on user preferences.
 * 
 * @param baseDuration - Base duration in milliseconds
 * @param config - Animation configuration from useResponsiveAnimation
 * @returns Scaled duration (1.5x for reduced motion)
 * 
 * @example
 * ```tsx
 * const config = useResponsiveAnimation()
 * const duration = getScaledDuration(1000, config) // 1500ms if prefers-reduced-motion
 * ```
 */
export function getScaledDuration(
  baseDuration: number,
  config: AnimationConfig
): number {
  return baseDuration * config.durationScale
}

export default useResponsiveAnimation
