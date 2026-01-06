'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface HorizontalScrollSectionProps {
  children: React.ReactNode
  title: string
  step: number
  className?: string
}

export const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  children,
  title,
  step,
  className
}) => {
  return (
    <div className={cn('flex-none w-screen h-full px-8 md:px-16 flex items-center justify-center', className)}>
      <div className="max-w-4xl w-full">
        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
            {step}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h3 className="text-4xl md:text-5xl font-bold text-white">
            {title}
          </h3>
          <div className="text-lg text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
