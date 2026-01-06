// Components/aceternity/Meteors/Meteors.tsx
'use client'
import React from 'react'

/** T141 - Meteors component placeholder from Aceternity UI */
export interface MeteorsProps {
  number?: number
  className?: string
}

export function Meteors({ number = 20, className = '' }: MeteorsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: number }).map((_, idx) => (
        <span
          key={idx}
          className="absolute h-0.5 w-0.5 rounded-full bg-white animate-meteor"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 2 + 1}s`
          }}
        />
      ))}
    </div>
  )
}
