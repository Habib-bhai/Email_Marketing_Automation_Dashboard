// Components/dashboard/FilterBar/FilterBar.tsx
'use client'

import { useCallback } from 'react'
import { Button } from '@/Components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import { useDashboardFilters } from '@/lib/stores/dashboardFilters'
import { X } from 'lucide-react'

export interface FilterBarProps {
  showLeadFilters?: boolean
  showCampaignFilters?: boolean
  showDateFilters?: boolean
  className?: string
}

/**
 * T091 - Filter bar component
 * Connects to Zustand store for dashboard filtering
 */
export function FilterBar({
  showLeadFilters = true,
  showCampaignFilters = false,
  showDateFilters = false,
  className
}: FilterBarProps) {
  const {
    leadStatus,
    leadType,
    leadTemperature,
    campaignStatus,
    setLeadStatus,
    setLeadType,
    setLeadTemperature,
    setCampaignStatus,
    resetLeadFilters,
    resetCampaignFilters,
    resetAllFilters
  } = useDashboardFilters()

  const hasLeadFilters = leadStatus || leadType || leadTemperature
  const hasCampaignFilters = campaignStatus
  const hasAnyFilters = hasLeadFilters || hasCampaignFilters

  // Memoize handlers to prevent infinite re-renders
  // Don't include state values in deps - only the setters
  const handleLeadStatusChange = useCallback((value: string) => {
    setLeadStatus(value === 'all' ? undefined : value as any)
  }, [setLeadStatus])

  const handleLeadTypeChange = useCallback((value: string) => {
    setLeadType(value === 'all' ? undefined : value as any)
  }, [setLeadType])

  const handleLeadTemperatureChange = useCallback((value: string) => {
    setLeadTemperature(value === 'all' ? undefined : value as any)
  }, [setLeadTemperature])

  const handleCampaignStatusChange = useCallback((value: string) => {
    setCampaignStatus(value === 'all' ? undefined : value as any)
  }, [setCampaignStatus])

  return (
    <div className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 ${className || ''}`}>
      {/* Lead Filters */}
      {showLeadFilters && (
        <>
          <Select 
            key="lead-status-filter"
            value={leadStatus || 'all'} 
            onValueChange={handleLeadStatusChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Lead Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Processed">Processed</SelectItem>
              <SelectItem value="Unprocessed">Unprocessed</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            key="lead-type-filter"
            value={leadType || 'all'} 
            onValueChange={handleLeadTypeChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Lead Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Brand">Brand</SelectItem>
              <SelectItem value="Apollo">Apollo</SelectItem>
              <SelectItem value="Cold">Cold</SelectItem>
              <SelectItem value="Warm">Warm</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            key="lead-temperature-filter"
            value={leadTemperature || 'all'} 
            onValueChange={handleLeadTemperatureChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Temperature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Temperatures</SelectItem>
              <SelectItem value="Hot">Hot</SelectItem>
              <SelectItem value="Warm">Warm</SelectItem>
              <SelectItem value="Cold">Cold</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {/* Campaign Filters */}
      {showCampaignFilters && (
        <Select 
          key="campaign-status-filter"
          value={campaignStatus || 'all'} 
          onValueChange={handleCampaignStatusChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Campaign Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Clear Filters */}
      {hasAnyFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (showLeadFilters && showCampaignFilters) {
              resetAllFilters()
            } else if (showLeadFilters) {
              resetLeadFilters()
            } else if (showCampaignFilters) {
              resetCampaignFilters()
            }
          }}
          className="gap-1"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
