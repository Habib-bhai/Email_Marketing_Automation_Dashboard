'use client'

import { create } from 'zustand'
import type { DashboardStore, DashboardTab, DateRange, LeadFilters } from '@/lib/types/dashboard'

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial UI State
  activeTab: 'overview',
  isLoading: false,
  error: null,

  // Initial Filter State
  dateRange: '7d',
  leadFilters: {},

  // Initial Data State
  metrics: null,
  leadPipeline: null,
  emailMetrics: null,
  automationHealth: null,

  // Actions
  setActiveTab: (tab: DashboardTab) => {
    set({ activeTab: tab })
  },

  setDateRange: (range: DateRange) => {
    set({ dateRange: range })
  },

  setLeadFilters: (filters: LeadFilters) => {
    set({ leadFilters: filters })
  },

  refreshData: async () => {
    set({ isLoading: true, error: null })
    try {
      // Fetch all dashboard data
      const [metricsRes, pipelineRes, emailRes, healthRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/leads/pipeline'),
        fetch('/api/email/engagement'),
        fetch('/api/automation/health'),
      ])

      const metricsData = await metricsRes.json()
      const pipelineData = await pipelineRes.json()
      const emailData = await emailRes.json()
      const healthData = await healthRes.json()

      if (metricsData.success) set({ metrics: metricsData.data })
      if (pipelineData.success) set({ leadPipeline: pipelineData.data })
      if (emailData.success) set({ emailMetrics: emailData.data })
      if (healthData.success) set({ automationHealth: healthData.data })

      set({ isLoading: false })
    } catch {
      set({ error: 'Failed to refresh data', isLoading: false })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
