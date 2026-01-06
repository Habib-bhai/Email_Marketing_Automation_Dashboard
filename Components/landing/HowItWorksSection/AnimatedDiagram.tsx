'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface AnimatedDiagramProps {
  type: 'ingestion' | 'processing' | 'visualization'
  isActive: boolean
  className?: string
}

export const AnimatedDiagram: React.FC<AnimatedDiagramProps> = ({
  type,
  isActive,
  className
}) => {
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setAnimationStep(0)
      return
    }

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  const renderIngestionDiagram = () => (
    <div className="relative w-full h-64">
      {/* N8N */}
      <div className={cn(
        'absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500',
        isActive && animationStep >= 1 && 'scale-110 shadow-orange-500/50'
      )}>
        N8N
      </div>

      {/* Arrow 1 */}
      <div className={cn(
        'absolute left-24 top-1/2 w-32 h-1 bg-gradient-to-r from-orange-500 to-blue-500 transition-all duration-500',
        isActive && animationStep >= 1 ? 'opacity-100' : 'opacity-30'
      )}>
        <div className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full transition-all duration-500',
          isActive && animationStep >= 1 && 'animate-pulse'
        )} />
      </div>

      {/* API */}
      <div className={cn(
        'absolute left-60 top-1/2 -translate-y-1/2 w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500',
        isActive && animationStep >= 2 && 'scale-110 shadow-blue-500/50'
      )}>
        API
      </div>

      {/* Arrow 2 */}
      <div className={cn(
        'absolute left-84 top-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-green-500 transition-all duration-500',
        isActive && animationStep >= 2 ? 'opacity-100' : 'opacity-30'
      )}>
        <div className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full transition-all duration-500',
          isActive && animationStep >= 2 && 'animate-pulse'
        )} />
      </div>

      {/* Database */}
      <div className={cn(
        'absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500',
        isActive && animationStep >= 3 && 'scale-110 shadow-green-500/50'
      )}>
        DB
      </div>
    </div>
  )

  const renderProcessingDiagram = () => (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div className="relative">
        {/* Central processor */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-2xl">
          <span className="text-xl">Process</span>
        </div>

        {/* Orbiting elements */}
        {['Validate', 'Transform', 'Enrich', 'Store'].map((label, index) => {
          const angle = (index * 90) - 90 // Start from top
          const radius = 80
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius

          return (
            <div
              key={label}
              className={cn(
                'absolute w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-semibold shadow-lg transition-all duration-500',
                isActive && animationStep === index && 'scale-125 shadow-cyan-400/50'
              )}
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderVisualizationDiagram = () => (
    <div className="relative w-full h-64">
      {/* Data source */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
      </div>

      {/* Dashboard preview */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-40 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl overflow-hidden">
        {/* Mini chart bars */}
        <div className="p-4 space-y-2">
          {[60, 80, 40, 90].map((height, index) => (
            <div
              key={index}
              className={cn(
                'h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded transition-all duration-500',
                isActive && animationStep >= index ? 'opacity-100' : 'opacity-30'
              )}
              style={{ width: `${height}%` }}
            />
          ))}
        </div>
      </div>

      {/* Connecting lines */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'absolute left-20 h-px bg-gradient-to-r from-teal-500 to-purple-500 transition-all duration-500',
            isActive && animationStep >= index ? 'opacity-100' : 'opacity-20'
          )}
          style={{
            top: `${30 + index * 20}%`,
            width: 'calc(100% - 14rem)'
          }}
        />
      ))}
    </div>
  )

  return (
    <div className={cn('w-full', className)}>
      {type === 'ingestion' && renderIngestionDiagram()}
      {type === 'processing' && renderProcessingDiagram()}
      {type === 'visualization' && renderVisualizationDiagram()}
    </div>
  )
}
