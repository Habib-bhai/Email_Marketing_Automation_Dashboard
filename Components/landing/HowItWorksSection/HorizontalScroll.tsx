'use client'

import React, { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface HorizontalScrollProps {
  children: React.ReactNode
  className?: string
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const scrollElement = scrollRef.current

    if (!container || !scrollElement) return

    const handleScroll = () => {
      const { top, height } = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate scroll progress when section is in view
      if (top <= 0 && top > -height + windowHeight) {
        const progress = Math.abs(top) / (height - windowHeight)
        setScrollProgress(Math.min(Math.max(progress, 0), 1))

        // Apply horizontal scroll based on vertical scroll position
        const scrollWidth = scrollElement.scrollWidth - scrollElement.clientWidth
        scrollElement.scrollLeft = progress * scrollWidth
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      style={{ height: '400vh' }} // Make container tall for scroll effect
    >
      {/* Sticky container that stays in viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex h-full w-full items-center overflow-x-hidden"
        >
          {children}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-400">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}
