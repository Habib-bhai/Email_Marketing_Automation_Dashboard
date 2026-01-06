'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Card } from '@/Components/ui/card'
import styles from './featureCard.module.css'
import { cn } from '@/lib/utils/cn'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  gradient?: string
  spotlight?: boolean
  magnetic?: boolean
  className?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  gradient = 'from-blue-500 to-purple-500',
  spotlight = true,
  magnetic = false,
  className
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [magneticTransform, setMagneticTransform] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!spotlight || !cardRef.current) return

    const card = cardRef.current
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }

    if (isHovered) {
      card.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isHovered, spotlight])

  // Magnetic attraction effect
  useEffect(() => {
    if (!magnetic || !cardRef.current) return

    const card = cardRef.current
    const magneticRadius = 100 // Attraction radius in pixels

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const cardCenterX = rect.left + rect.width / 2
      const cardCenterY = rect.top + rect.height / 2

      const distanceX = e.clientX - cardCenterX
      const distanceY = e.clientY - cardCenterY
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

      if (distance < magneticRadius) {
        // Apply magnetic pull (stronger when closer)
        const strength = 1 - distance / magneticRadius
        const pullX = distanceX * strength * 0.15 // 15% pull strength
        const pullY = distanceY * strength * 0.15

        setMagneticTransform({ x: pullX, y: pullY })
      } else {
        setMagneticTransform({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [magnetic])

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <div
      ref={cardRef}
      className={cn(styles.featureCard, magnetic && styles.magnetic, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        magnetic
          ? {
              transform: `translate(${magneticTransform.x}px, ${magneticTransform.y}px)`,
              transition: magneticTransform.x === 0 ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }
          : undefined
      }
    >
      <Card className={styles.card}>
        {/* Spotlight effect */}
        {spotlight && isHovered && (
          <div
            className={styles.spotlight}
            style={{
              background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 80%)`,
            }}
          />
        )}

        {/* Border gradient */}
        <div className={cn(styles.borderGradient, `bg-gradient-to-r ${gradient}`)} />

        {/* Ripple effect container */}
        <div className={styles.rippleContainer}>
          {isHovered && (
            <div className={styles.ripple} />
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {icon && (
            <div className={styles.iconWrapper}>
              {icon}
            </div>
          )}

          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </Card>
    </div>
  )
}
