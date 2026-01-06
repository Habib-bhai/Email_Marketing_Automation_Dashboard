'use client'

import { lazy, Suspense } from 'react'
import { HeroSection } from './components/HeroSection'
import { InViewport } from '@/Components/ui/InViewport'
import { SectionLoader } from '@/Components/ui/SectionLoader'
import styles from './landingPage.module.css'

// Lazy load below-fold sections for performance
const FeaturesSection = lazy(() => import('./sections/FeaturesSection').then(m => ({ default: m.FeaturesSection })))
const HowItWorksSection = lazy(() => import('./sections/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })))
const StatisticsSection = lazy(() => import('./sections/StatisticsSection').then(m => ({ default: m.StatisticsSection })))
const SocialProofSection = lazy(() => import('./sections/SocialProofSection').then(m => ({ default: m.SocialProofSection })))
const IntegrationSection = lazy(() => import('./sections/IntegrationSection').then(m => ({ default: m.IntegrationSection })))

// Legacy feature section for compatibility
import { FeatureSection } from './components/FeatureSection'

const legacyFeatures = [
  {
    id: '1',
    title: 'Lead Tracking',
    description: 'Track leads through your pipeline with detailed analytics and insights.',
    icon: 'trending-up' as const,
  },
  {
    id: '2',
    title: 'Email Analytics',
    description: 'Monitor open rates, click-through rates, and engagement metrics.',
    icon: 'mail' as const,
  },
  {
    id: '3',
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and nurture leads automatically.',
    icon: 'zap' as const,
  },
]

export function LandingPage() {
  const handleCtaClick = () => {
    window.location.href = '/dashboard'
  }

  return (
    <main className={styles.landingPage}>
      {/* Hero Section - Eager loaded (above the fold) */}
      <HeroSection onCtaClick={handleCtaClick} />

      {/* Features Section - Deferred until in viewport */}
      <InViewport 
        fallback={<SectionLoader minHeight="600px" />}
        rootMargin="200px"
      >
        <Suspense fallback={<SectionLoader minHeight="600px" />}>
          <FeaturesSection />
        </Suspense>
      </InViewport>

      {/* How It Works Section - Deferred until in viewport */}
      <InViewport 
        fallback={<SectionLoader minHeight="500px" />}
        rootMargin="200px"
      >
        <Suspense fallback={<SectionLoader minHeight="500px" />}>
          <HowItWorksSection />
        </Suspense>
      </InViewport>

      {/* Statistics Section - Deferred until in viewport */}
      <InViewport 
        fallback={<SectionLoader minHeight="400px" />}
        rootMargin="200px"
      >
        <Suspense fallback={<SectionLoader minHeight="400px" />}>
          <StatisticsSection />
        </Suspense>
      </InViewport>

      {/* Social Proof Section - Deferred until in viewport */}
      <InViewport 
        fallback={<SectionLoader minHeight="600px" />}
        rootMargin="200px"
      >
        <Suspense fallback={<SectionLoader minHeight="600px" />}>
          <SocialProofSection />
        </Suspense>
      </InViewport>

      {/* Integration Section - Deferred until in viewport */}
      <InViewport 
        fallback={<SectionLoader minHeight="500px" />}
        rootMargin="150px"
      >
        <Suspense fallback={<SectionLoader minHeight="500px" />}>
          <IntegrationSection />
        </Suspense>
      </InViewport>

      {/* Legacy Feature Section - For backward compatibility */}
      <FeatureSection features={legacyFeatures} />
    </main>
  )
}
