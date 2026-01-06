// Components/aceternity/TracingBeam/TracingBeam.tsx
'use client'
import React from 'react'

/** T140 - TracingBeam component placeholder from Aceternity UI */
export interface TracingBeamProps {
  children: React.ReactNode
  className?: string
}

export function TracingBeam({ children, className = '' }: TracingBeamProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary to-transparent" />
      <div className="pl-12">{children}</div>
    </div>
  )
}
