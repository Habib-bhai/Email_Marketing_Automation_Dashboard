// app/dashboard/leads/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { FilterBar } from '@/Components/dashboard/FilterBar/FilterBar'
import { RefreshButton } from '@/Components/dashboard/RefreshButton/RefreshButton'
import { LoadingState } from '@/Components/dashboard/StateHandlers/LoadingState'
import { ErrorState } from '@/Components/dashboard/StateHandlers/ErrorState'
import { EmptyState } from '@/Components/dashboard/StateHandlers/EmptyState'
import { useLeads } from '@/lib/api/useLeads'
import { useDashboardFilters } from '@/lib/stores/dashboardFilters'
import { Button } from '@/Components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * T110 - Leads page
 * Browse and filter leads
 */
export default function LeadsPage() {
  const {
    leadStatus,
    leadType,
    leadTemperature,
    leadSource,
    dateFrom,
    dateTo,
    leadsPage,
    leadsLimit,
    setLeadsPage
  } = useDashboardFilters()

  const { data, isLoading, error, refetch } = useLeads({
    status: leadStatus,
    type: leadType,
    temperature: leadTemperature,
    source: leadSource,
    dateFrom,
    dateTo,
    page: leadsPage,
    limit: leadsLimit
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage your leads
          </p>
        </div>
        <RefreshButton
          queryKeys={[['dashboard', 'leads']]}
          showLabel
        />
      </div>

      <FilterBar showLeadFilters showDateFilters />

      <Card>
        <CardHeader>
          <CardTitle>
            {data ? `${data.pagination.total} Leads` : 'Leads'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState count={5} />
          ) : error ? (
            <ErrorState
              error={error}
              title="Failed to load leads"
              onRetry={() => refetch()}
            />
          ) : !data || data.data.length === 0 ? (
            <EmptyState
              title="No leads found"
              message="Try adjusting your filters or add new leads"
            />
          ) : (
            <>
              <div className="space-y-2">
                {data.data.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{lead.company ?? lead.name ?? lead.id}</h4>
                      <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{lead.status}</span>
                        <span>•</span>
                        <span>{lead.type}</span>
                        {lead.temperature && (
                          <>
                            <span>•</span>
                            <span>{lead.temperature}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((leadsPage - 1) * leadsLimit) + 1} to {Math.min(leadsPage * leadsLimit, data.pagination.total)} of {data.pagination.total} leads
                </p>
                {(() => {
                  const hasMore = leadsPage < data.pagination.totalPages

                  return (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLeadsPage(Math.max(1, leadsPage - 1))}
                        disabled={leadsPage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <span className="text-sm text-muted-foreground">
                        Page {leadsPage} of {data.pagination.totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLeadsPage(leadsPage + 1)}
                        disabled={!hasMore}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })()}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
