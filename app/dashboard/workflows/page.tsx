// app/dashboard/workflows/page.tsx
'use client'

import { AutomationHealth } from '@/Components/dashboard/Sections/AutomationHealth'

/**
 * T109 - Workflows page
 * n8n automation management
 */
export default function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Workflows</h1>
        <p className="text-muted-foreground mt-2">
          Manage and monitor your n8n automation workflows
        </p>
      </div>

      <AutomationHealth />
    </div>
  )
}
