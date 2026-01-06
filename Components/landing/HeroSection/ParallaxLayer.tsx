// Components/landing/HeroSection/ParallaxLayer.tsx
// T159 - Individual parallax layer
'use client'

import React from 'react'
import { ParallaxContainer, ParallaxContainerProps } from './ParallaxContainer'

export interface ParallaxLayerProps extends ParallaxContainerProps {
  /**
   * Layer depth (higher = more parallax)
   * @default 1
   */
  depth?: number
}

/**
 * ParallaxLayer - Parallax layer component
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  depth = 1,
  ...props
}) => {
  const speed = depth * 0.2

  return <ParallaxContainer speed={speed} {...props} />
}

ParallaxLayer.displayName = 'ParallaxLayer'
