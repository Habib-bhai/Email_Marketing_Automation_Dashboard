'use client'

import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'

interface StatisticCardProps {
  value: number
  label: string
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  value,
  label,
  suffix = '',
  prefix = '',
  duration = 2000,
  className
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useIntersectionObserver(cardRef, { threshold: 0.5 })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!isInView || hasAnimated) return

    setHasAnimated(true)
    let startTime: number | null = null
    const startValue = 0
    const endValue = value

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (easeOutExpo)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const currentValue = startValue + (endValue - startValue) * easeOutExpo

      setDisplayValue(Math.floor(currentValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration, hasAnimated])

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US')
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        'flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-gray-600 hover:shadow-2xl hover:shadow-blue-500/10',
        className
      )}
    >
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
        {prefix}{formatNumber(displayValue)}{suffix}
      </div>
      <div className="text-lg md:text-xl text-gray-300 font-medium text-center">
        {label}
      </div>
    </div>
  )
}
