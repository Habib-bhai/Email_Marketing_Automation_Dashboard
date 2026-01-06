// lib/hooks/useParallax.ts
'use client'

import { useEffect, useState, RefObject } from 'react'
import { calculateParallax, ParallaxOptions } from '@/lib/animations/parallax'

/**
 * T136 - Hook for parallax scroll effects
 * Creates multi-layer parallax based on scroll position
 */

interface UseParallaxReturn {
  offset: { x: number; y: number }
  style: React.CSSProperties
}

export function useParallax(
  elementRef: RefObject<HTMLElement>,
  options: ParallaxOptions = {}
): UseParallaxReturn {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let ticking = false

    const updateParallax = () => {
      const rect = element.getBoundingClientRect()
      const elementY = rect.top + window.pageYOffset
      const scrollY = window.pageYOffset

      const parallaxOffset = calculateParallax(scrollY, elementY, options)
      setOffset(parallaxOffset)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    // Initial calculation
    updateParallax()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [elementRef, options])

  const style: React.CSSProperties = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    willChange: 'transform'
  }

  return { offset, style }
}

/**
 * Hook for mouse parallax effect
 */
export function useMouseParallax(
  elementRef: RefObject<HTMLElement>,
  strength: number = 20
) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / rect.width
      const deltaY = (e.clientY - centerY) / rect.height

      setOffset({
        x: deltaX * strength,
        y: deltaY * strength
      })
    }

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [elementRef, strength])

  const style: React.CSSProperties = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: 'transform 0.3s ease-out'
  }

  return { offset, style }
}

/**
 * Hook for multiple parallax layers with different speeds
 */
export function useParallaxLayers(
  layers: Array<{
    ref: RefObject<HTMLElement>
    speed: number
    direction?: 'up' | 'down'
  }>
) {
  const [offsets, setOffsets] = useState<Array<{ x: number; y: number }>>(
    layers.map(() => ({ x: 0, y: 0 }))
  )

  useEffect(() => {
    let ticking = false

    const updateLayers = () => {
      const scrollY = window.pageYOffset

      const newOffsets = layers.map((layer) => {
        if (!layer.ref.current) return { x: 0, y: 0 }

        const rect = layer.ref.current.getBoundingClientRect()
        const elementY = rect.top + scrollY

        return calculateParallax(scrollY, elementY, {
          speed: layer.speed,
          direction: layer.direction || 'up'
        })
      })

      setOffsets(newOffsets)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateLayers)
        ticking = true
      }
    }

    // Initial calculation
    updateLayers()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [layers])

  return offsets.map((offset) => ({
    style: {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      willChange: 'transform'
    }
  }))
}

/**
 * Hook for scroll-based opacity fade
 */
export function useParallaxFade(
  elementRef: RefObject<HTMLElement>,
  options: { fadeStart?: number; fadeEnd?: number } = {}
) {
  const { fadeStart = 0, fadeEnd = 500 } = options
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let ticking = false

    const updateOpacity = () => {
      const rect = element.getBoundingClientRect()
      const elementY = rect.top + window.pageYOffset
      const scrollY = window.pageYOffset

      const distance = scrollY - elementY
      const progress = (distance - fadeStart) / (fadeEnd - fadeStart)
      const newOpacity = Math.max(0, Math.min(1, 1 - progress))

      setOpacity(newOpacity)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOpacity)
        ticking = true
      }
    }

    updateOpacity()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [elementRef, fadeStart, fadeEnd])

  const style: React.CSSProperties = {
    opacity,
    willChange: 'opacity'
  }

  return { opacity, style }
}
