'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { MagneticButton } from '@/Components/enhanced/MagneticButton'
import { useResponsiveAnimation, getScaledParticleCount } from '@/lib/hooks/useResponsiveAnimation'
import { cn } from '@/lib/utils/cn'
import styles from './ctaSection.module.css'

// Lazy load heavy animation components
const Meteors = dynamic(() => import('@/Components/aceternity/Meteors/Meteors').then(m => ({ default: m.Meteors })), {
  ssr: false,
})

const SpotlightEffect = dynamic(() => import('@/Components/aceternity/SpotlightEffect/SpotlightEffect').then(m => ({ default: m.SpotlightEffect })), {
  ssr: false,
})

export const CTASection: React.FC = () => {
  const animationConfig = useResponsiveAnimation()
  const meteorCount = getScaledParticleCount(20, animationConfig) // 20 on desktop, 6 on mobile

  return (
    <section className={cn(styles.ctaSection, 'relative w-full py-32 px-4 overflow-hidden')}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      
      {/* Spotlight Effect - Conditionally render on desktop only */}
      {!animationConfig.isMobile && <SpotlightEffect className="absolute inset-0" />}

      {/* Meteors - Scaled count based on device */}
      <Meteors number={meteorCount} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-semibold mb-8">
          Get Started Today
        </div>

        {/* Headline */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Ready to Transform
          <span className="block text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
            Your Marketing?
          </span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join thousands of marketing teams automating their workflows with real-time insights and enterprise-grade reliability.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <MagneticButton
            variant="default"
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-2xl shadow-blue-500/50"
          >
            Start Free Trial
          </MagneticButton>

          <button className="px-8 py-4 text-lg font-semibold bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
            Schedule Demo
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </section>
  )
}
