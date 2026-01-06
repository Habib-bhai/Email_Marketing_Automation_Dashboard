// lib/hooks/useTiltEffect.ts
'use client'

import { useState, useEffect, useCallback, RefObject } from 'react'
import { lerp } from '@/lib/animations/lerp'

/**
 * T133 - Hook for 3D tilt card effect
 * Elements tilt based on mouse position with perspective
 */

interface TiltEffectOptions {
  maxTilt?: number // Maximum tilt angle in degrees (default: 15)
  perspective?: number // Perspective value (default: 1000)
  scale?: number // Scale on hover (default: 1.05)
  speed?: number // Animation speed (default: 400)
  glare?: boolean // Enable glare effect (default: false)
  gyroscope?: boolean // Enable gyroscope on mobile (default: true)
}

interface TiltState {
  rotateX: number
  rotateY: number
  scale: number
  glarePosition: { x: number; y: number; opacity: number }
}

export function useTiltEffect(
  elementRef: RefObject<HTMLElement>,
  options: TiltEffectOptions = {}
) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    glare = false,
    gyroscope = true
  } = options

  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glarePosition: { x: 50, y: 50, opacity: 0 }
  })

  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()

    // Calculate mouse position relative to element (0 to 1)
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Convert to -1 to 1 range
    const xPercent = (x - 0.5) * 2
    const yPercent = (y - 0.5) * 2

    // Calculate tilt angles
    const rotateY = xPercent * maxTilt
    const rotateX = -yPercent * maxTilt

    setTilt(prev => ({
      rotateX: lerp(prev.rotateX, rotateX, 0.1),
      rotateY: lerp(prev.rotateY, rotateY, 0.1),
      scale: scale,
      glarePosition: {
        x: x * 100,
        y: y * 100,
        opacity: glare ? 0.3 : 0
      }
    }))
  }, [elementRef, maxTilt, scale, glare])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glarePosition: { x: 50, y: 50, opacity: 0 }
    })
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

  // Gyroscope support for mobile
  useEffect(() => {
    if (!gyroscope || typeof window === 'undefined') return

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!isHovered || !e.beta || !e.gamma) return

      const beta = e.beta // X-axis (-180 to 180)
      const gamma = e.gamma // Y-axis (-90 to 90)

      // Normalize to -1 to 1
      const xPercent = gamma / 90
      const yPercent = beta / 180

      const rotateY = xPercent * maxTilt
      const rotateX = -yPercent * maxTilt

      setTilt(prev => ({
        ...prev,
        rotateX: lerp(prev.rotateX, rotateX, 0.1),
        rotateY: lerp(prev.rotateY, rotateY, 0.1)
      }))
    }

    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [gyroscope, isHovered, maxTilt])

  const style = {
    transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    transition: isHovered ? `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)` : `transform ${speed}ms ease-out`
  }

  const glareStyle = glare ? {
    background: `radial-gradient(circle at ${tilt.glarePosition.x}% ${tilt.glarePosition.y}%, rgba(255, 255, 255, ${tilt.glarePosition.opacity}) 0%, transparent 50%)`,
    pointerEvents: 'none' as const,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 'inherit'
  } : undefined

  return {
    tilt,
    isHovered,
    style,
    glareStyle
  }
}
