// app/dashboard/analytics/page.tsx
'use client'

import { LeadPipeline } from '@/Components/dashboard/Sections/LeadPipeline'
import { EmailEngagement } from '@/Components/dashboard/Sections/EmailEngagement'

/**
 * T108 - Analytics page
 * Detailed analytics view
 */
export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Detailed insights into your leads and email campaigns
        </p>
      </div>

      <LeadPipeline />
      <EmailEngagement />
    </div>
  )
}
