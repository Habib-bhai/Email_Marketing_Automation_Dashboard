'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ className, active = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          active
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          className
        )}
        {...props}
      />
    )
  }
)

Tab.displayName = 'Tab'

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Array<{ id: string; label: string }>
  activeTab: string
  onTabChange: (id: string) => void
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ tabs, activeTab, onTabChange, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1', className)}
        {...props}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-4"
          >
            {tab.label}
          </Tab>
        ))}
      </div>
    )
  }
)

TabList.displayName = 'TabList'
