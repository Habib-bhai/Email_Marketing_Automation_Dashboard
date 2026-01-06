'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface IntegrationCardProps {
  name: string
  description: string
  icon: React.ReactNode
  logo?: string
  connected?: boolean
  onClick?: () => void
  className?: string
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  icon,
  connected = false,
  onClick,
  className
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-gray-600 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-105 text-left w-full',
        className
      )}
    >
      {/* Status badge */}
      {connected && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-semibold">
          Connected
        </div>
      )}

      {/* Icon */}
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center gap-2 text-blue-400 group-hover:gap-3 transition-all">
        <span className="text-sm font-semibold">Learn more</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}
