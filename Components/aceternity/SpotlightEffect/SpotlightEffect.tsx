// Components/aceternity/SpotlightEffect/SpotlightEffect.tsx
'use client'
import React from 'react'

/** T144 - SpotlightEffect component placeholder from Aceternity UI */
export interface SpotlightEffectProps {
  className?: string
  fill?: string
}

export function SpotlightEffect({
  className = '',
  fill = 'white'
}: SpotlightEffectProps) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="spotlight">
          <stop offset="0%" stopColor={fill} stopOpacity="0.3" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx="50%"
        cy="50%"
        rx="50%"
        ry="50%"
        fill="url(#spotlight)"
        className="animate-pulse-slow"
      />
    </svg>
  )
}
