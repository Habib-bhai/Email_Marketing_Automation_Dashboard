// Components/landing/HeroSection/HeroSection.tsx
// T160-T163 - Hero section with advanced animations
'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { TypewriterEffect } from '@/Components/aceternity/TypewriterEffect/TypewriterEffect'
import { MagneticButton } from '@/Components/enhanced/MagneticButton'
import { useResponsiveAnimation } from '@/lib/hooks/useResponsiveAnimation'
import { cn } from '@/lib/utils/cn'
import styles from './heroSection.module.css'

// Lazy load heavy animation components
const AuroraBackground = dynamic(() => import('@/Components/aceternity/AuroraBackground/AuroraBackground').then(m => ({ default: m.AuroraBackground })), {
  ssr: false,
})

const DataParticleField = dynamic(() => import('./DataParticleField').then(m => ({ default: m.DataParticleField })), {
  ssr: false,
})

// Load other sub-components normally (they're lighter)
import { GeometricGrid } from './GeometricGrid'
import { DashboardPreview } from './DashboardPreview'
import { FloatingMetrics } from './FloatingMetrics'
import { DataFlowAnimation } from './DataFlowAnimation'
import { ScrollIndicator } from './ScrollIndicator'
import { ParallaxContainer } from './ParallaxContainer'
import { ParallaxLayer } from './ParallaxLayer'

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * HeroSection - Main landing page hero with advanced animations
 *
 * Features:
 * - Multi-layer parallax (disabled on mobile)
 * - TypewriterEffect for headline
 * - Aurora background (reduced animation on mobile) - LAZY LOADED
 * - Particle field (scaled down on mobile) - LAZY LOADED
 * - Geometric grid
 * - Dashboard preview
 * - Floating metrics
 * - Data flow visualization
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  className,
  ...props
}) => {
  const animationConfig = useResponsiveAnimation()

  const words = [
    { text: 'Automate', className: 'text-blue-500' },
    { text: 'Your', className: 'text-white' },
    { text: 'Email', className: 'text-white' },
    { text: 'Marketing', className: 'text-blue-500' },
    { text: 'Pipeline', className: 'text-white' }
  ]

  return (
    <section
      className={cn(styles.heroSection, 'relative min-h-screen flex items-center', className)}
      {...props}
    >
      {/* Background layers */}
      <ParallaxLayer depth={0} className="absolute inset-0 z-0">
        <AuroraBackground 
          className="absolute inset-0" 
          reducedAnimation={animationConfig.shouldReduce}
        />
      </ParallaxLayer>

      <ParallaxLayer depth={1} className="absolute inset-0 z-10">
        <GeometricGrid />
      </ParallaxLayer>

      <ParallaxLayer depth={2} className="absolute inset-0 z-20">
        <DataParticleField particleCount={Math.floor(30 * animationConfig.particleScale)} />
      </ParallaxLayer>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-30">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <ParallaxContainer speed={0.3} className="space-y-8">
            <div className="space-y-4">
              <TypewriterEffect
                words={words}
                className="text-5xl lg:text-7xl font-bold"
                cursorClassName="bg-blue-500"
              />
              <p className="text-xl text-gray-300 max-w-2xl">
                Seamless N8N integration. Real-time dashboards.
                Intelligent lead processing. Transform your email marketing workflow.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <MagneticButton
                variant="default"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started Free
              </MagneticButton>
              <MagneticButton
                variant="outline"
                size="lg"
              >
                View Demo
              </MagneticButton>
            </div>

            {/* Floating Metrics */}
            <FloatingMetrics className="hidden lg:block" />
          </ParallaxContainer>

          {/* Right column - Dashboard preview & data flow */}
          <ParallaxContainer speed={0.5} className="space-y-6">
            <DashboardPreview className="transform hover:scale-105 transition-transform duration-500" />
            <DataFlowAnimation />
          </ParallaxContainer>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </div>

      {/* Scroll fade-out effect */}
      <div className={styles.scrollFade} />
    </section>
  )
}

HeroSection.displayName = 'HeroSection'
