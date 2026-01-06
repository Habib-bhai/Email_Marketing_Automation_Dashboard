// Components/aceternity/SparklesCore/SparklesCore.tsx
'use client'
import React from 'react'

/** T142 - SparklesCore component placeholder from Aceternity UI */
export interface SparklesCoreProps {
  id?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleColor?: string
  particleDensity?: number
  className?: string
}

export function SparklesCore({
  id = 'sparkles',
  background = 'transparent',
  minSize = 0.6,
  maxSize = 1.4,
  particleColor = '#FFF',
  particleDensity = 100,
  className = ''
}: SparklesCoreProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ background }}>
      <canvas id={id} className="w-full h-full" />
    </div>
  )
}
