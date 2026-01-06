// Components/dashboard/Layout/Sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Mail,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  BarChart3,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/ui/sheet'

export interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3
  },
  {
    label: 'Leads',
    href: '/dashboard/leads',
    icon: Users
  },
  {
    label: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: Mail
  },
  {
    label: 'Workflows',
    href: '/dashboard/workflows',
    icon: Activity
  },
  {
    label: 'Data Sources',
    href: '/dashboard/sources',
    icon: Database
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  }
]

/**
 * T098 - Sidebar component
 * Navigation sidebar with collapsible state and mobile drawer
 */
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavigationItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Mobile Hamburger Menu Button - Fixed at top left */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-3 left-3 z-50 h-10 w-10 bg-background/80 backdrop-blur-sm border shadow-sm"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Navigation Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="px-4 py-4 border-b">
            <SheetTitle className="text-left">Email Automation</SheetTitle>
          </SheetHeader>
          <nav className="p-2 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
            <NavigationItems onItemClick={() => setMobileOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 z-40
          hidden md:block
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {!collapsed && (
            <h1 className="text-lg font-semibold truncate">Email Automation</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto flex-shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          <NavigationItems />
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-xs font-medium truncate w-full text-center">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
