// lib/hooks/useHorizontalScroll.ts
'use client'

import { useEffect, useRef, useState, RefObject } from 'react'

/**
 * T135 - Hook for horizontal scrolling effects
 * Converts vertical scroll to horizontal scroll for carousel/timeline effects
 */

interface HorizontalScrollOptions {
  speed?: number // Scroll speed multiplier (default: 1)
  direction?: 'left' | 'right' // Scroll direction (default: 'left')
  smooth?: boolean // Smooth scrolling (default: true)
}

export function useHorizontalScroll(
  containerRef: RefObject<HTMLElement>,
  options: HorizontalScrollOptions = {}
) {
  const {
    speed = 1,
    direction = 'left',
    smooth = true
  } = options

  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ticking = false

    const updateScroll = () => {
      const containerRect = container.getBoundingClientRect()
      const scrollWidth = container.scrollWidth - container.clientWidth

      // Calculate scroll based on element position in viewport
      const viewportHeight = window.innerHeight
      const elementTop = containerRect.top
      const elementHeight = containerRect.height

      // Progress through the viewport (0 to 1)
      const startScroll = viewportHeight
      const endScroll = -elementHeight

      const totalDistance = startScroll - endScroll
      const currentPosition = startScroll - elementTop

      let progress = currentPosition / totalDistance
      progress = Math.max(0, Math.min(1, progress))

      // Apply direction
      if (direction === 'right') {
        progress = 1 - progress
      }

      // Calculate horizontal scroll position
      const scrollPos = progress * scrollWidth * speed

      setScrollPosition(scrollPos)
      setMaxScroll(scrollWidth)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    // Initial calculation
    updateScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [containerRef, speed, direction])

  const style = {
    transform: `translateX(-${scrollPosition}px)`,
    transition: smooth ? 'transform 0.1s ease-out' : 'none'
  }

  return {
    scrollPosition,
    maxScroll,
    progress: maxScroll > 0 ? scrollPosition / maxScroll : 0,
    style
  }
}

/**
 * Hook for mouse wheel horizontal scroll
 */
export function useWheelHorizontalScroll(
  containerRef: RefObject<HTMLElement>,
  options: { preventDefault?: boolean } = {}
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      // Prevent default vertical scroll
      if (options.preventDefault) {
        e.preventDefault()
      }

      // Scroll horizontally instead
      container.scrollLeft += e.deltaY

      // Also handle horizontal wheel/trackpad
      if (e.deltaX !== 0) {
        container.scrollLeft += e.deltaX
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: !options.preventDefault })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [containerRef, options.preventDefault])
}

/**
 * Hook for drag-to-scroll horizontal
 */
export function useDragHorizontalScroll(containerRef: RefObject<HTMLElement>) {
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      startX.current = e.pageX - container.offsetLeft
      scrollLeft.current = container.scrollLeft
      container.style.cursor = 'grabbing'
    }

    const handleMouseLeave = () => {
      setIsDragging(false)
      container.style.cursor = 'grab'
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      container.style.cursor = 'grab'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()

      const x = e.pageX - container.offsetLeft
      const walk = (x - startX.current) * 2 // Scroll speed multiplier

      container.scrollLeft = scrollLeft.current - walk
    }

    container.style.cursor = 'grab'

    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [containerRef, isDragging])

  return { isDragging }
}
