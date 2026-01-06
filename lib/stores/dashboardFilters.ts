// lib/stores/dashboardFilters.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DashboardFilters {
  // Lead filters
  leadStatus?: 'Processed' | 'Unprocessed'
  leadType?: 'Brand' | 'Apollo' | 'Cold' | 'Warm'
  leadTemperature?: 'Hot' | 'Warm' | 'Cold'
  leadSource?: string

  // Campaign filters
  campaignStatus?: 'Draft' | 'Active' | 'Paused' | 'Completed'

  // Date range filters
  dateFrom?: Date
  dateTo?: Date

  // Pagination
  leadsPage: number
  leadsLimit: number
  campaignsPage: number
  campaignsLimit: number
}

interface DashboardFiltersStore extends DashboardFilters {
  // Lead filter actions
  setLeadStatus: (status?: 'Processed' | 'Unprocessed') => void
  setLeadType: (type?: 'Brand' | 'Apollo' | 'Cold' | 'Warm') => void
  setLeadTemperature: (temperature?: 'Hot' | 'Warm' | 'Cold') => void
  setLeadSource: (source?: string) => void

  // Campaign filter actions
  setCampaignStatus: (status?: 'Draft' | 'Active' | 'Paused' | 'Completed') => void

  // Date range actions
  setDateRange: (from?: Date, to?: Date) => void
  clearDateRange: () => void

  // Pagination actions
  setLeadsPage: (page: number) => void
  setLeadsLimit: (limit: number) => void
  setCampaignsPage: (page: number) => void
  setCampaignsLimit: (limit: number) => void

  // Reset actions
  resetLeadFilters: () => void
  resetCampaignFilters: () => void
  resetAllFilters: () => void
}

const initialState: DashboardFilters = {
  leadStatus: undefined,
  leadType: undefined,
  leadTemperature: undefined,
  leadSource: undefined,
  campaignStatus: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  leadsPage: 1,
  leadsLimit: 10,
  campaignsPage: 1,
  campaignsLimit: 10,
}

/**
 * T082 - Zustand store for dashboard filters
 * Persists to localStorage for user convenience
 */
export const useDashboardFilters = create<DashboardFiltersStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Lead filter actions
      setLeadStatus: (status) => set({ leadStatus: status, leadsPage: 1 }),
      setLeadType: (type) => set({ leadType: type, leadsPage: 1 }),
      setLeadTemperature: (temperature) => set({ leadTemperature: temperature, leadsPage: 1 }),
      setLeadSource: (source) => set({ leadSource: source, leadsPage: 1 }),

      // Campaign filter actions
      setCampaignStatus: (status) => set({ campaignStatus: status, campaignsPage: 1 }),

      // Date range actions
      setDateRange: (from, to) => set({ dateFrom: from, dateTo: to, leadsPage: 1, campaignsPage: 1 }),
      clearDateRange: () => set({ dateFrom: undefined, dateTo: undefined }),

      // Pagination actions
      setLeadsPage: (page) => set({ leadsPage: page }),
      setLeadsLimit: (limit) => set({ leadsLimit: limit, leadsPage: 1 }),
      setCampaignsPage: (page) => set({ campaignsPage: page }),
      setCampaignsLimit: (limit) => set({ campaignsLimit: limit, campaignsPage: 1 }),

      // Reset actions
      resetLeadFilters: () => set({
        leadStatus: undefined,
        leadType: undefined,
        leadTemperature: undefined,
        leadSource: undefined,
        leadsPage: 1,
      }),

      resetCampaignFilters: () => set({
        campaignStatus: undefined,
        campaignsPage: 1,
      }),

      resetAllFilters: () => set(initialState),
    }),
    {
      name: 'dashboard-filters-storage', // localStorage key
      // Only persist filters, not pagination
      partialize: (state) => ({
        leadStatus: state.leadStatus,
        leadType: state.leadType,
        leadTemperature: state.leadTemperature,
        leadSource: state.leadSource,
        campaignStatus: state.campaignStatus,
        dateFrom: state.dateFrom,
        dateTo: state.dateTo,
      }),
    }
  )
)
