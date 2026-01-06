// Components/dashboard/Layout/DashboardLayout.tsx
'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './dashboardLayout.module.css'

export interface DashboardLayoutProps {
  children: ReactNode
}

/**
 * T097 - Dashboard layout component
 * Main layout wrapper with sidebar and top bar
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <TopBar />
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  )
}
