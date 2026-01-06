'use client'

import React, { useState } from 'react'
import { IntegrationCard } from '@/Components/landing/IntegrationShowcase/IntegrationCard'
import { IntegrationModal } from '@/Components/landing/IntegrationShowcase/IntegrationModal'

const integrations = [
  {
    name: 'N8N Workflows',
    description: 'Automate data collection from your N8N workflows with our open HTTP endpoint.',
    icon: (
      <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    connected: true,
    features: [
      'Real-time data ingestion',
      'Idempotent upserts',
      'Rate limiting protection',
      'Comprehensive validation'
    ],
    codeExample: `POST /api/ingest
Content-Type: application/json

{
  "type": "lead",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "Unprocessed",
    "type": "Apollo",
    "temperature": "Warm"
  }
}`
  },
  {
    name: 'Zapier',
    description: 'Connect with 5000+ apps through Zapier webhooks for seamless automation.',
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
        <path d="M12 7l-1.5 4.5H6l3.75 2.73L8.25 19 12 16.27 15.75 19l-1.5-4.77L18 11.5h-4.5z" />
      </svg>
    ),
    features: [
      'Multi-app integration',
      'Trigger-based workflows',
      'Data transformation',
      'Error handling'
    ],
    codeExample: `// Zapier Webhook Configuration
{
  "url": "https://yourdomain.com/api/ingest",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  }
}`
  },
  {
    name: 'Make (Integromat)',
    description: 'Visual automation platform for complex workflows and data operations.',
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    features: [
      'Visual scenario builder',
      'Advanced filtering',
      'Data mapping',
      'Scheduled execution'
    ],
    codeExample: `// Make HTTP Module Settings
{
  "url": "https://yourdomain.com/api/ingest",
  "method": "POST",
  "body": "{{json}}",
  "parseResponse": true
}`
  },
  {
    name: 'Custom Webhooks',
    description: 'Direct integration with any system capable of making HTTP requests.',
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    features: [
      'RESTful API',
      'JSON payload support',
      'Flexible authentication',
      'Detailed error responses'
    ],
    codeExample: `curl -X POST https://yourdomain.com/api/ingest \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "campaign",
    "data": {
      "name": "Q1 Outreach",
      "status": "active"
    }
  }'`
  }
]

export const IntegrationSection: React.FC = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null)

  return (
    <>
      <section className="w-full py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold mb-6">
              Integrations
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Connect With Your
              <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Favorite Tools
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Seamlessly integrate with popular automation platforms and custom webhooks
            </p>
          </div>

          {/* Integration Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <IntegrationCard
                key={index}
                name={integration.name}
                description={integration.description}
                icon={integration.icon}
                connected={integration.connected}
                onClick={() => setSelectedIntegration(integration)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Integration Modal */}
      <IntegrationModal
        isOpen={selectedIntegration !== null}
        onClose={() => setSelectedIntegration(null)}
        integration={selectedIntegration || integrations[0]}
      />
    </>
  )
}
