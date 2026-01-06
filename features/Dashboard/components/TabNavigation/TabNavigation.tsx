'use client'

import { forwardRef } from 'react'
import { TabList } from '@/Components/ui/Tab'
import { cn } from '@/lib/utils/cn'

export type DashboardTab = 'overview' | 'pipeline' | 'email' | 'health'

export interface TabNavigationProps {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  className?: string
}

const tabs = [
  { id: 'overview' as const, label: 'Overview' },
  { id: 'pipeline' as const, label: 'Lead Pipeline' },
  { id: 'email' as const, label: 'Email Analytics' },
  { id: 'health' as const, label: 'Automation Health' },
]

export const TabNavigation = forwardRef<HTMLDivElement, TabNavigationProps>(
  ({ activeTab, onTabChange, className }, ref) => {
    return (
      <TabList
        ref={ref}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange as (id: string) => void}
        className={cn('w-full md:w-auto', className)}
      />
    )
  }
)

TabNavigation.displayName = 'TabNavigation'
