'use client'

import React from 'react'
import { TestimonialCarousel } from '@/Components/landing/TestimonialCarousel/TestimonialCarousel'

const testimonials = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechStart Inc',
    content: 'This dashboard transformed how we track our email campaigns. The real-time insights from N8N integration allow us to make data-driven decisions instantly. Reply rates improved by 35% in just two months!',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Sales Operations Lead',
    company: 'GrowthCo',
    content: 'The automated lead pipeline visualization is a game-changer. We can see exactly where each lead is in our funnel and optimize our outreach strategy. The system handles thousands of leads effortlessly.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'VP of Marketing',
    company: 'ScaleUp Solutions',
    content: 'Integration with N8N workflows was seamless. The dashboard provides exactly what we need - clear metrics, beautiful visualizations, and enterprise-grade reliability. Highly recommended for any serious marketing team.',
    rating: 5
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Growth Engineer',
    company: 'DataFlow Systems',
    content: 'As a technical user, I appreciate the type-safe implementation and comprehensive API. The rate limiting and validation ensure our data integrity while the caching keeps everything lightning-fast.',
    rating: 5
  }
]

export const SocialProofSection: React.FC = () => {
  return (
    <section className="w-full py-24 px-4 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-semibold mb-6">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Trusted by Marketing
            <span className="block text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
              Teams Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what professionals say about transforming their email marketing workflows with our platform
          </p>
        </div>

        {/* Testimonial Carousel */}
        <TestimonialCarousel testimonials={testimonials} />

        {/* Trust Badges */}
        <div className="mt-20 pt-12 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm font-semibold uppercase tracking-wider mb-8">
            Powering campaigns for teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {['TechStart', 'GrowthCo', 'ScaleUp', 'DataFlow', 'Marketing Pro', 'Sales Engine'].map((company) => (
              <div key={company} className="text-2xl font-bold text-gray-600">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
