// Components/landing/HeroSection/DataFlowAnimation.tsx
// T155 - Data flow visualization
'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface DataFlowAnimationProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DataFlowAnimation: React.FC<DataFlowAnimationProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn('relative h-64 overflow-hidden', className)} {...props}>
      <svg className="w-full h-full" viewBox="0 0 400 200">
        {/* N8N Node */}
        <g className="animate-pulse">
          <circle cx="50" cy="100" r="20" fill="#ea4b71" opacity="0.8" />
          <text x="50" y="105" textAnchor="middle" fill="white" fontSize="10">N8N</text>
        </g>

        {/* API Node */}
        <g className="animate-pulse" style={{ animationDelay: '200ms' }}>
          <circle cx="200" cy="100" r="20" fill="#3b82f6" opacity="0.8" />
          <text x="200" y="105" textAnchor="middle" fill="white" fontSize="10">API</text>
        </g>

        {/* Database Node */}
        <g className="animate-pulse" style={{ animationDelay: '400ms' }}>
          <circle cx="350" cy="100" r="20" fill="#10b981" opacity="0.8" />
          <text x="350" y="105" textAnchor="middle" fill="white" fontSize="10">DB</text>
        </g>

        {/* Connections */}
        <line x1="70" y1="100" x2="180" y2="100" stroke="white" strokeWidth="2" opacity="0.3" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite" />
        </line>
        <line x1="220" y1="100" x2="330" y2="100" stroke="white" strokeWidth="2" opacity="0.3" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  )
}

DataFlowAnimation.displayName = 'DataFlowAnimation'
