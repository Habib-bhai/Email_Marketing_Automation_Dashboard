// Components/landing/HeroSection/GeometricGrid.tsx
// T152 - Animated geometric grid background
'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface GeometricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Grid cell size in pixels
   * @default 50
   */
  cellSize?: number

  /**
   * Line color
   * @default 'rgba(255, 255, 255, 0.1)'
   */
  lineColor?: string

  /**
   * Line width
   * @default 1
   */
  lineWidth?: number

  /**
   * Enable perspective effect
   * @default true
   */
  perspective?: boolean

  /**
   * Animation speed (0 = no animation)
   * @default 0.5
   */
  animationSpeed?: number

  /**
   * Grid fade distance (0-1, from center)
   * @default 0.8
   */
  fadeDistance?: number
}

/**
 * GeometricGrid - Animated perspective grid background
 *
 * Features:
 * - 3D perspective grid effect
 * - Smooth scrolling animation
 * - Fade-out at edges
 * - Respects prefers-reduced-motion
 */
export const GeometricGrid: React.FC<GeometricGridProps> = ({
  cellSize = 50,
  lineColor = 'rgba(255, 255, 255, 0.1)',
  lineWidth = 1,
  perspective = true,
  animationSpeed = 0.5,
  fadeDistance = 0.8,
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef<number>()

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    const draw = () => {
      const { width, height } = canvas

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Apply perspective transform if enabled
      if (perspective) {
        ctx.save()
        ctx.setTransform(1, 0, 0, 0.6, 0, height * 0.3)
      }

      // Calculate grid dimensions
      const cols = Math.ceil(width / cellSize) + 2
      const rows = Math.ceil((perspective ? height * 2 : height) / cellSize) + 2
      const offset = offsetRef.current % cellSize

      // Draw vertical lines
      for (let i = -1; i < cols; i++) {
        const x = i * cellSize

        // Calculate fade based on distance from center
        const distanceFromCenter = Math.abs(x - width / 2) / (width / 2)
        const fade = Math.max(0, 1 - distanceFromCenter / fadeDistance)

        ctx.beginPath()
        ctx.moveTo(x, -offset)
        ctx.lineTo(x, (perspective ? height * 2 : height) + cellSize)
        ctx.strokeStyle = lineColor.replace(
          /[\d.]+\)$/,
          `${fade * parseFloat(lineColor.match(/[\d.]+\)$/)?.[0] || '0.1')})`
        )
        ctx.lineWidth = lineWidth
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let i = -1; i < rows; i++) {
        const y = i * cellSize - offset

        // Calculate fade based on distance
        const distanceRatio = y / (perspective ? height * 2 : height)
        const fade = Math.max(0, 1 - Math.abs(distanceRatio - 0.5) * 2)

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.strokeStyle = lineColor.replace(
          /[\d.]+\)$/,
          `${fade * parseFloat(lineColor.match(/[\d.]+\)$/)?.[0] || '0.1')})`
        )
        ctx.lineWidth = lineWidth
        ctx.stroke()
      }

      if (perspective) {
        ctx.restore()
      }

      // Animate offset
      if (!prefersReducedMotion && animationSpeed > 0) {
        offsetRef.current += animationSpeed
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    draw()

    if (prefersReducedMotion || animationSpeed === 0) {
      // Draw once without animation
      return () => {
        window.removeEventListener('resize', updateSize)
      }
    }

    return () => {
      window.removeEventListener('resize', updateSize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [cellSize, lineColor, lineWidth, perspective, animationSpeed, fadeDistance, prefersReducedMotion])

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} {...props}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: 0.6 }}
      />
    </div>
  )
}

GeometricGrid.displayName = 'GeometricGrid'
