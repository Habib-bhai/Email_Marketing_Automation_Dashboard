'use client'

import React, { useState, useEffect } from 'react'
import { HorizontalScroll } from '@/Components/landing/HowItWorksSection/HorizontalScroll'
import { HorizontalScrollSection } from '@/Components/landing/HowItWorksSection/HorizontalScrollSection'
import { AnimatedDiagram } from '@/Components/landing/HowItWorksSection/AnimatedDiagram'
import styles from '@/Components/landing/HowItWorksSection/howItWorksSection.module.css'
import { cn } from '@/lib/utils/cn'

const steps = [
  {
    title: 'Data Ingestion from N8N',
    description: 'N8N workflows send lead, campaign, and engagement data to our open HTTP endpoint. Rate limiting ensures system stability with 100 requests per minute.',
    diagram: 'ingestion' as const
  },
  {
    title: 'Validation & Processing',
    description: 'Zod schemas validate incoming data with field-level error reporting. Idempotent upserts prevent duplicates while maintaining data integrity.',
    diagram: 'processing' as const
  },
  {
    title: 'Real-Time Visualization',
    description: 'Interactive dashboard displays metrics with React Query caching. See lead pipeline, email engagement, and campaign performance at a glance.',
    diagram: 'visualization' as const
  }
]

export const HowItWorksSection: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('how-it-works')
      if (!section) return

      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionHeight = rect.height

      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const progress = Math.abs(rect.top) / (sectionHeight - windowHeight)
        setScrollProgress(Math.min(Math.max(progress, 0), 1))

        // Update active step based on scroll progress
        const stepIndex = Math.floor(progress * steps.length)
        setActiveStep(Math.min(stepIndex, steps.length - 1))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="how-it-works"
      className={styles.howItWorksSection}
    >
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>How It Works</h2>
        <p className={styles.subtitle}>
          Three simple steps to automate your email marketing workflow end-to-end
        </p>
      </div>

      {/* Tracing Beam - synced with scroll */}
      <div className={cn(styles.tracingBeam, scrollProgress > 0 && styles.active)}>
        <div
          className={styles.tracingBeamDot}
          style={{ top: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Horizontal Scroll Container */}
      <HorizontalScroll>
        {steps.map((step, index) => (
          <HorizontalScrollSection
            key={index}
            title={step.title}
            step={index + 1}
          >
            <p className="mb-8">{step.description}</p>
            <AnimatedDiagram
              type={step.diagram}
              isActive={activeStep === index}
            />
          </HorizontalScrollSection>
        ))}
      </HorizontalScroll>
    </section>
  )
}
