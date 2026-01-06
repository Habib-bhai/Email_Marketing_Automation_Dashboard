// Components/aceternity/GridPattern/GridPattern.tsx
'use client'
import React from 'react'

/** T143 - GridPattern component placeholder from Aceternity UI */
export interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: string
  className?: string
}

export function GridPattern({
  width = 40,
  height = 40,
  x = 0,
  y = 0,
  strokeDasharray = '0',
  className = ''
}: GridPatternProps) {
  return (
    <svg className={`absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          x={x}
          y={y}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray={strokeDasharray}
            opacity="0.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  )
}
