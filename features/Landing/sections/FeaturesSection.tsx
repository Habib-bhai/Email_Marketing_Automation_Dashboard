'use client'

import React from 'react'
import { BentoGrid, BentoGridItem } from '@/Components/landing/BentoGrid/BentoGrid'
import { FeatureCard } from '@/Components/landing/FeatureCard/FeatureCard'

const features = [
  {
    title: 'Real-Time Data Ingestion',
    description: 'Seamlessly integrate with N8N workflows to automatically ingest lead, campaign, and engagement data in real-time.',
    gradient: 'from-blue-500 to-cyan-500',
    span: 'medium' as const,
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Advanced Analytics',
    description: 'Visualize lead pipeline, email engagement, and campaign performance with interactive charts and metrics.',
    gradient: 'from-purple-500 to-pink-500',
    span: 'small' as const,
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: 'Intelligent Rate Limiting',
    description: 'Built-in protection with 100 requests per minute limit ensures system stability and prevents abuse.',
    gradient: 'from-green-500 to-teal-500',
    span: 'small' as const,
    icon: (
      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Type-Safe Operations',
    description: 'Full TypeScript support with Zod validation ensures data integrity at every step of the pipeline.',
    gradient: 'from-orange-500 to-red-500',
    span: 'large' as const,
    icon: (
      <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    title: 'Serverless Architecture',
    description: 'Powered by Neon PostgreSQL and Upstash Redis for instant scalability and zero infrastructure management.',
    gradient: 'from-indigo-500 to-purple-500',
    span: 'small' as const,
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    title: 'Comprehensive Audit Logs',
    description: 'Track every ingestion attempt with detailed logs for debugging and compliance.',
    gradient: 'from-yellow-500 to-orange-500',
    span: 'medium' as const,
    icon: (
      <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: 'Award-Worthy UI',
    description: 'Production-grade interface with advanced animations, parallax effects, and stunning visual design.',
    gradient: 'from-pink-500 to-rose-500',
    span: 'small' as const,
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  {
    title: 'WCAG 2.1 AA Compliant',
    description: 'Fully accessible with keyboard navigation, screen reader support, and reduced motion preferences.',
    gradient: 'from-teal-500 to-cyan-500',
    span: 'small' as const,
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  }
]

export const FeaturesSection: React.FC = () => {
  return (
    <section className="w-full py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to automate lead management and email campaigns with enterprise-grade reliability.
          </p>
        </div>

        {/* Bento Grid */}
        <BentoGrid>
          {features.map((feature, index) => (
            <BentoGridItem key={index} span={feature.span}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                gradient={feature.gradient}
                spotlight={true}
                magnetic={true}
              />
            </BentoGridItem>
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
