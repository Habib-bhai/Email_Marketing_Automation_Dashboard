// lib/hooks/useMagneticEffect.ts
'use client'

import { useState, useEffect, useCallback, RefObject } from 'react'
import { lerp } from '@/lib/animations/lerp'

/**
 * T132 - Hook for magnetic button/element effect
 * Elements follow mouse cursor with smooth interpolation
 */

interface MagneticEffectOptions {
  strength?: number // Magnetic pull strength (default: 0.3)
  smoothness?: number // Interpolation smoothness (default: 0.15)
  maxDistance?: number // Maximum distance element can move (default: 50)
}

interface MagneticState {
  x: number
  y: number
}

export function useMagneticEffect(
  elementRef: RefObject<HTMLElement>,
  options: MagneticEffectOptions = {}
) {
  const {
    strength = 0.3,
    smoothness = 0.15,
    maxDistance = 50
  } = options

  const [transform, setTransform] = useState<MagneticState>({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate distance from center
    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    // Apply strength and limit distance
    let moveX = deltaX * strength
    let moveY = deltaY * strength

    // Clamp to maxDistance
    const distance = Math.sqrt(moveX * moveX + moveY * moveY)
    if (distance > maxDistance) {
      const scale = maxDistance / distance
      moveX *= scale
      moveY *= scale
    }

    setTransform(prev => ({
      x: lerp(prev.x, moveX, smoothness),
      y: lerp(prev.y, moveY, smoothness)
    }))
  }, [elementRef, strength, smoothness, maxDistance])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTransform({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mousemove', handleMouseMove)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mousemove', handleMouseMove)
    }
  }, [elementRef, handleMouseEnter, handleMouseLeave, handleMouseMove])

  // Smooth animation frame
  useEffect(() => {
    if (!isHovered) return

    let rafId: number

    const animate = () => {
      setTransform(prev => ({
        x: lerp(prev.x, prev.x, 0.9),
        y: lerp(prev.y, prev.y, 0.9)
      }))
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isHovered])

  return {
    transform,
    isHovered,
    style: {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
      transition: isHovered ? 'none' : 'transform 0.4s ease-out'
    }
  }
}
