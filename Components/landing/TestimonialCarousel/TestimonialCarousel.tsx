'use client'

import React, { useState, useEffect, useRef } from 'react'
import { TestimonialCard } from './TestimonialCard'
import { cn } from '@/lib/utils/cn'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  className?: string
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [velocity, setVelocity] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout>()

  // Auto-play carousel
  useEffect(() => {
    if (isDragging) return

    autoPlayRef.current = setInterval(() => {
      handleNext()
    }, 5000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [activeIndex, isDragging])

  const handleNext = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsFlipping(false), 600)
  }

  const handlePrev = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsFlipping(false), 600)
  }

  // Drag handling with velocity calculation
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setDragStart(clientX)
    setDragOffset(0)
    setVelocity(0)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    const offset = clientX - dragStart
    setDragOffset(offset)
    setVelocity(offset)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    // Velocity-based momentum
    if (Math.abs(velocity) > 50) {
      if (velocity > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }

    setDragOffset(0)
    setVelocity(0)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd()
    }
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div
        ref={carouselRef}
        className="relative h-[400px] perspective-1000"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {testimonials.map((testimonial, index) => {
          const offset = index - activeIndex
          const isActive = index === activeIndex
          const isPrev = offset === -1
          const isNext = offset === 1

          return (
            <div
              key={testimonial.id}
              className={cn(
                'absolute inset-0 transition-all duration-600 ease-out',
                isActive && 'z-20',
                (isPrev || isNext) && 'z-10',
                isFlipping && 'pointer-events-none'
              )}
              style={{
                transform: `
                  translateX(${offset * 100 + (dragOffset / window.innerWidth) * 100}%)
                  scale(${isActive ? 1 : 0.9})
                  rotateY(${isFlipping && isActive ? (velocity > 0 ? 180 : -180) : 0}deg)
                `,
                opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.5,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <TestimonialCard
                quote={testimonial.content}
                author={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
              />
            </div>
          )
        })}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFlipping}
          aria-label="Previous testimonial"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isFlipping) {
                  setIsFlipping(true)
                  setActiveIndex(index)
                  setTimeout(() => setIsFlipping(false), 600)
                }
              }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === activeIndex
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFlipping}
          aria-label="Next testimonial"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
