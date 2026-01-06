// Components/aceternity/AuroraBackground/AuroraBackground.tsx
'use client'

import React from 'react'

/**
 * T137 - Aurora Background component from Aceternity UI
 * Animated gradient background with aurora borealis effect
 * Supports reduced animation mode for mobile devices and accessibility
 *
 * TODO: Install from ui.aceternity.com/components/aurora-background
 * This is a placeholder - replace with actual component from Aceternity
 */

export interface AuroraBackgroundProps {
  children?: React.ReactNode
  className?: string
  showRadialGradient?: boolean
  /**
   * Reduce animation intensity (for mobile or prefers-reduced-motion)
   * @default false
   */
  reducedAnimation?: boolean
}

export function AuroraBackground({
  children,
  className = '',
  showRadialGradient = true,
  reducedAnimation = false
}: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Aurora effect layers - static gradient if reduced animation */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 ${
        reducedAnimation ? '' : 'animate-gradient'
      }`} />

      {showRadialGradient && (
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-background" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
