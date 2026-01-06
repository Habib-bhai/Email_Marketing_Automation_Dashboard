// Components/landing/HeroSection/ScrollIndicator.tsx
// T157 - Scroll down indicator
'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ScrollIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Show label text
   * @default true
   */
  showLabel?: boolean

  /**
   * Custom label text
   * @default "Scroll to explore"
   */
  label?: string
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  showLabel = true,
  label = 'Scroll to explore',
  className,
  ...props
}) => {
  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 cursor-pointer group',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {showLabel && (
        <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
      <div className="w-6 h-10 border-2 border-current rounded-full p-1 animate-bounce">
        <div className="w-1.5 h-3 bg-current rounded-full mx-auto animate-scroll" />
      </div>
    </div>
  )
}

ScrollIndicator.displayName = 'ScrollIndicator'
