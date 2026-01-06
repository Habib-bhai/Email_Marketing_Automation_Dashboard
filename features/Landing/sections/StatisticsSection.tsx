'use client'

import React from 'react'
import { StatisticCard } from '@/Components/landing/StatisticsSection/StatisticCard'

const statistics = [
  {
    value: 10000,
    suffix: '+',
    label: 'Leads Processed Monthly'
  },
  {
    value: 50,
    suffix: '+',
    label: 'Active Campaigns'
  },
  {
    value: 99,
    suffix: '%',
    label: 'Uptime Reliability'
  },
  {
    value: 100,
    label: 'Requests Per Minute'
  }
]

export const StatisticsSection: React.FC = () => {
  return (
    <section className="w-full min-h-screen py-24 px-4 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Split screen layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold">
                By the Numbers
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Trusted by Teams
                <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  Worldwide
                </span>
              </h2>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed">
              Our platform powers thousands of marketing campaigns, processing millions of data points with enterprise-grade reliability and real-time insights.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Real-Time Processing</h3>
                  <p className="text-gray-400">Instant data ingestion and visualization with sub-second latency</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Enterprise Security</h3>
                  <p className="text-gray-400">Rate limiting, validation, and audit logs protect your data</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Serverless Scale</h3>
                  <p className="text-gray-400">Auto-scaling infrastructure handles any workload</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Statistics */}
          <div className="grid grid-cols-2 gap-6">
            {statistics.map((stat, index) => (
              <StatisticCard
                key={index}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                duration={2000 + index * 200}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
