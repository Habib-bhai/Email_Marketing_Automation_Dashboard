/**
 * Component-specific types for UI components
 */

import type { ChartDataPoint, TimeSeriesDataPoint } from './api'

/**
 * Common component props
 */

export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Dashboard widget props
 */

export interface WidgetProps extends BaseComponentProps {
  title: string
  loading?: boolean
  error?: string | null
  lastUpdated?: string
}

/**
 * Metric card props
 */

export interface MetricCardProps extends BaseComponentProps {
  title: string
  value: string | number
  change?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
  icon?: React.ReactNode
  loading?: boolean
  trend?: TimeSeriesDataPoint[]
}

/**
 * Chart component props
 */

export interface ChartProps extends BaseComponentProps {
  data: ChartDataPoint[]
  height?: number
  showLegend?: boolean
  loading?: boolean
}

export interface LineChartProps extends ChartProps {
  xAxisKey: string
  yAxisKey: string
  lineColor?: string
}

export interface BarChartProps extends ChartProps {
  xAxisKey: string
  yAxisKey: string
  barColor?: string
}

export interface PieChartProps extends ChartProps {
  nameKey: string
  valueKey: string
  colors?: string[]
}

/**
 * Table component props
 */

export interface TableColumn<T> {
  key: string
  header: string
  accessor: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface TableProps<T> extends BaseComponentProps {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

/**
 * Pagination props
 */

export interface PaginationProps extends BaseComponentProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * Filter props
 */

export interface FilterOption {
  label: string
  value: string
}

export interface FilterProps extends BaseComponentProps {
  label: string
  options: FilterOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiSelect?: boolean
}

/**
 * Animation states
 */

export type AnimationState = 'idle' | 'entering' | 'entered' | 'exiting' | 'exited'

export interface AnimatedComponentProps extends BaseComponentProps {
  animationState?: AnimationState
  duration?: number
  delay?: number
}

/**
 * Aceternity UI component enhancement types
 */

export interface MagneticEffectProps {
  strength?: number // 0-1, defaults to 0.3
  maxDistance?: number // px, defaults to 10
}

export interface TiltEffectProps {
  maxTilt?: number // degrees, defaults to 15
  perspective?: number // px, defaults to 1000
  scale?: number // defaults to 1.05
}

export interface ParallaxEffectProps {
  speed?: number // 0-2, defaults to 0.5
  direction?: 'vertical' | 'horizontal'
}

/**
 * Loading states
 */

export interface LoadingState {
  isLoading: boolean
  error: Error | null
  data: unknown | null
}

/**
 * Empty state props
 */

export interface EmptyStateProps extends BaseComponentProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
