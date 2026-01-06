// Components/landing/StatisticsSection/ParticleNetwork.tsx
// T156 - Particle network visualization
'use client'

import React from 'react'
import { DataParticleField } from '../HeroSection/DataParticleField'

export interface ParticleNetworkProps extends React.HTMLAttributes<HTMLCanvasElement> {
  /**
   * Network density
   * @default 'medium'
   */
  density?: 'low' | 'medium' | 'high'
}

export const ParticleNetwork: React.FC<ParticleNetworkProps> = ({
  density = 'medium',
  className,
  ...props
}) => {
  const particleCount = {
    low: 30,
    medium: 50,
    high: 80
  }[density]

  return (
    <DataParticleField
      particleCount={particleCount}
      connectionDistance={120}
      showConnections={true}
      interactive={true}
      className={className}
      {...props}
    />
  )
}

ParticleNetwork.displayName = 'ParticleNetwork'
