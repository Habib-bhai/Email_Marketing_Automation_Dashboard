'use client'

import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface Feature {
  id: string
  title: string
  description: string
  icon: 'trending-up' | 'mail' | 'zap'
}

export interface FeatureSectionProps {
  features?: Feature[]
  className?: string
}

const iconMap = {
  'trending-up': (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    </svg>
  ),
  mail: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  ),
  zap: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  ),
}

export const FeatureSection = forwardRef<HTMLDivElement, FeatureSectionProps>(
  ({ features = [], className }, ref) => {
    return (
      <section
        ref={ref}
        id="features"
        className={twMerge('py-16 sm:py-24 bg-muted/50', className)}
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="flex flex-col items-start rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary">
                  {iconMap[feature.icon]}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }
)

FeatureSection.displayName = 'FeatureSection'
