// Components/dashboard/MetricCard/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { useAnimatedCounter } from '@/lib/hooks/useAnimatedCounter'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import styles from './metricCard.module.css'

export interface MetricCardProps {
  title: string
  value: number
  unit?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  subtitle?: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  loading?: boolean
  className?: string
  valueFormatter?: (value: number) => string
  animate?: boolean
}

/**
 * T088 - Metric card component
 * Displays a single metric with optional trend, icon, and animation
 */
export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  subtitle,
  color = 'primary',
  loading,
  className,
  valueFormatter,
  animate = true
}: MetricCardProps) {
  const animatedValue = useAnimatedCounter(value, {
    duration: 1000,
    startOnMount: animate
  })

  const displayValue = animate ? animatedValue : value
  const formattedValue = valueFormatter ? valueFormatter(displayValue) : displayValue.toLocaleString()

  return (
    <Card className={`${styles.metricCard} ${styles[`color-${color}`]} ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">
            {formattedValue}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </div>
        </div>

        {trend && (
          <div className={`flex items-center gap-1 text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
            {trend.label && <span className="text-muted-foreground ml-1">{trend.label}</span>}
          </div>
        )}

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
