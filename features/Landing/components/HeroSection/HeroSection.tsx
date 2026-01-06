'use client'

import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface HeroSectionProps {
  title?: string
  subtitle?: string
  ctaText?: string
  onCtaClick?: () => void
  className?: string
}

export const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      title = 'Email Marketing Automation',
      subtitle = 'Automate your email campaigns and track performance in real-time',
      ctaText = 'Get Started',
      onCtaClick,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={twMerge('relative overflow-hidden bg-background py-24 sm:py-32', className)}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={onCtaClick}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {ctaText}
            </button>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
)

HeroSection.displayName = 'HeroSection'
