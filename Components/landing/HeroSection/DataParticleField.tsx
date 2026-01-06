// Components/landing/HeroSection/DataParticleField.tsx
// T151 - Animated particle field for hero background
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  hue: number
}

export interface DataParticleFieldProps extends React.HTMLAttributes<HTMLCanvasElement> {
  /**
   * Number of particles
   * @default 50
   */
  particleCount?: number

  /**
   * Particle speed multiplier
   * @default 1
   */
  speed?: number

  /**
   * Connection distance threshold (px)
   * @default 150
   */
  connectionDistance?: number

  /**
   * Show particle connections
   * @default true
   */
  showConnections?: boolean

  /**
   * Particle color (hue value 0-360)
   * @default 200
   */
  hue?: number

  /**
   * Enable mouse interaction
   * @default true
   */
  interactive?: boolean

  /**
   * Background color
   * @default 'transparent'
   */
  backgroundColor?: string
}

/**
 * DataParticleField - Animated particle network background
 *
 * Features:
 * - Floating particles with physics
 * - Connection lines between nearby particles
 * - Mouse interaction (repulsion/attraction)
 * - Respects prefers-reduced-motion
 * - Performance optimized with RAF
 */
export const DataParticleField: React.FC<DataParticleFieldProps> = ({
  particleCount = 50,
  speed = 1,
  connectionDistance = 150,
  showConnections = true,
  hue = 200,
  interactive = true,
  backgroundColor = 'transparent',
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isInside: false })
  const rafRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Check for reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Initialize particles
  useEffect(() => {
    if (!canvasRef.current || prefersReducedMotion) return

    const canvas = canvasRef.current
    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      setDimensions({ width: rect.width, height: rect.height })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    // Initialize particle positions
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      hue: hue + (Math.random() * 40 - 20)
    }))

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [particleCount, speed, hue, prefersReducedMotion])

  // Mouse interaction
  useEffect(() => {
    if (!interactive || !canvasRef.current || prefersReducedMotion) return

    const canvas = canvasRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isInside: true
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [interactive, prefersReducedMotion])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || prefersReducedMotion) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Mouse interaction
        if (interactive && mouse.isInside) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 200

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            particle.vx -= (dx / distance) * force * 0.5
            particle.vy -= (dy / distance) * force * 0.5
          }
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1
          particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1
          particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        }

        // Apply friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Maintain minimum speed
        const currentSpeed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2)
        if (currentSpeed < 0.1) {
          particle.vx += (Math.random() - 0.5) * 0.1
          particle.vy += (Math.random() - 0.5) * 0.1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        if (showConnections) {
          particles.slice(i + 1).forEach((other) => {
            const dx = other.x - particle.x
            const dy = other.y - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectionDistance) {
              const opacity = (1 - distance / connectionDistance) * 0.3
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${opacity})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          })
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [
    dimensions,
    connectionDistance,
    showConnections,
    interactive,
    backgroundColor,
    prefersReducedMotion
  ])

  if (prefersReducedMotion) {
    return (
      <canvas
        className={cn('absolute inset-0', className)}
        style={{ backgroundColor }}
        {...props}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0', className)}
      style={{ backgroundColor }}
      {...props}
    />
  )
}

DataParticleField.displayName = 'DataParticleField'
