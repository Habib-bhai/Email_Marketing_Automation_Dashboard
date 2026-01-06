// lib/hooks/useScrollProgress.ts
'use client'

import { useState, useEffect } from 'react'

/**
 * T131 - Hook to track scroll progress (0 to 1)
 * Returns percentage of page scrolled
 */

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      const totalScroll = documentHeight - windowHeight
      const currentProgress = totalScroll > 0 ? scrollTop / totalScroll : 0

      setProgress(Math.min(Math.max(currentProgress, 0), 1))
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    // Initial calculation
    updateProgress()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return progress
}

/**
 * Hook to track scroll progress of a specific element
 */
export function useElementScrollProgress(elementRef: React.RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!elementRef.current) return

    let ticking = false

    const updateProgress = () => {
      const element = elementRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Calculate how much of element has scrolled through viewport
      const elementTop = rect.top
      const elementHeight = rect.height

      // Progress from element entering bottom to leaving top
      const totalDistance = viewportHeight + elementHeight
      const currentPosition = viewportHeight - elementTop

      const currentProgress = currentPosition / totalDistance

      setProgress(Math.min(Math.max(currentProgress, 0), 1))
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    updateProgress()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateProgress)
    }
  }, [elementRef])

  return progress
}
