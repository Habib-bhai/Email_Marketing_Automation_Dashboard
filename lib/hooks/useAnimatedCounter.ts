// lib/hooks/useAnimatedCounter.ts
import { useEffect, useRef, useState } from 'react'

export interface UseAnimatedCounterOptions {
  duration?: number
  startOnMount?: boolean
  easing?: (t: number) => number
}

/**
 * T087 - Animated counter hook
 * Smoothly animates a number from 0 to target value
 */
export function useAnimatedCounter(
  target: number,
  options: UseAnimatedCounterOptions = {}
) {
  const {
    duration = 1000,
    startOnMount = true,
    easing = (t) => t * (2 - t) // ease-out quad
  } = options

  const [current, setCurrent] = useState(startOnMount ? 0 : target)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!startOnMount) {
      setCurrent(target)
      return
    }

    const start = performance.now()
    startTimeRef.current = start

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)

      setCurrent(Math.floor(target * easedProgress))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCurrent(target)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [target, duration, startOnMount, easing])

  return current
}
