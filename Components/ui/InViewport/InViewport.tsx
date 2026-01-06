'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface InViewportProps {
  children: ReactNode
  /**
   * Fallback to show while content is not in viewport
   * @default null (renders nothing until in viewport)
   */
  fallback?: ReactNode
  /**
   * Root margin for Intersection Observer (e.g., '100px' to trigger 100px before entering viewport)
   * @default '200px'
   */
  rootMargin?: string
  /**
   * Percentage of element that must be visible to trigger (0-1)
   * @default 0.1 (10%)
   */
  threshold?: number
  /**
   * Whether to unobserve after first intersection
   * @default true
   */
  triggerOnce?: boolean
  /**
   * Callback when element enters viewport
   */
  onIntersect?: () => void
  /**
   * CSS class to apply to wrapper div
   */
  className?: string
}

/**
 * InViewport component that defers rendering children until they enter the viewport.
 * Uses Intersection Observer API for efficient viewport detection.
 * 
 * @example
 * ```tsx
 * <InViewport 
 *   fallback={<Skeleton />}
 *   rootMargin="200px"
 *   onIntersect={() => console.log('Section visible')}
 * >
 *   <ExpensiveComponent />
 * </InViewport>
 * ```
 */
export function InViewport({
  children,
  fallback = null,
  rootMargin = '200px',
  threshold = 0.1,
  triggerOnce = true,
  onIntersect,
  className,
}: InViewportProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback for unsupported browsers: render immediately
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true)
            onIntersect?.()

            // Unobserve after first intersection if triggerOnce is true
            if (triggerOnce) {
              observer.unobserve(element)
            }
          } else if (!triggerOnce) {
            // Allow re-hiding if triggerOnce is false
            setIsIntersecting(false)
          }
        })
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, threshold, triggerOnce, onIntersect])

  return (
    <div ref={ref} className={className}>
      {isIntersecting ? children : fallback}
    </div>
  )
}

export default InViewport
