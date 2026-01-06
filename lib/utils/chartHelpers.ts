// lib/utils/chartHelpers.ts

/**
 * T096 - Chart helpers utility
 * Common utilities for chart data transformation and formatting
 */

export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface TrendDataPoint {
  date: string
  [key: string]: string | number
}

/**
 * Transforms object with counts into chart data array
 */
export function transformToChartData(
  data: Record<string, number>,
  colorMap?: Record<string, string>
): ChartDataPoint[] {
  return Object.entries(data).map(([name, value]) => ({
    name,
    value,
    color: colorMap?.[name]
  }))
}

/**
 * Formats number with commas for display
 */
export function formatChartNumber(value: number): string {
  return value.toLocaleString()
}

/**
 * Formats percentage with 1 decimal place
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * Calculates percentage from two numbers
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return (part / total) * 100
}

/**
 * Generates date labels for trend charts
 */
export function generateDateLabels(days: number): string[] {
  const labels: string[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    labels.push(date.toISOString().split('T')[0])
  }

  return labels
}

/**
 * Formats date for display in charts
 */
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

/**
 * Sorts chart data by value descending
 */
export function sortChartDataByValue(data: ChartDataPoint[]): ChartDataPoint[] {
  return [...data].sort((a, b) => b.value - a.value)
}

/**
 * Calculates trend direction and percentage change
 */
export function calculateTrend(current: number, previous: number): {
  value: number
  isPositive: boolean
  label: string
} {
  if (previous === 0) {
    return {
      value: current > 0 ? 100 : 0,
      isPositive: current > 0,
      label: 'vs previous period'
    }
  }

  const change = ((current - previous) / previous) * 100

  return {
    value: Math.abs(change),
    isPositive: change >= 0,
    label: 'vs previous period'
  }
}

/**
 * Color palette for charts
 */
export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(142 76% 36%)',
  warning: 'hsl(38 92% 50%)',
  danger: 'hsl(0 84% 60%)',
  info: 'hsl(199 89% 48%)',
  muted: 'hsl(var(--muted-foreground))',

  // Lead status colors
  processed: 'hsl(142 76% 36%)',
  unprocessed: 'hsl(38 92% 50%)',

  // Temperature colors
  hot: 'hsl(0 84% 60%)',
  warm: 'hsl(38 92% 50%)',
  cold: 'hsl(199 89% 48%)',

  // Type colors
  brand: 'hsl(262 83% 58%)',
  apollo: 'hsl(199 89% 48%)',
  coldLead: 'hsl(216 92% 60%)',
  warmLead: 'hsl(38 92% 50%)'
}

/**
 * Get color for lead status
 */
export function getLeadStatusColor(status: string): string {
  const statusLower = status.toLowerCase()
  return CHART_COLORS[statusLower as keyof typeof CHART_COLORS] || CHART_COLORS.muted
}

/**
 * Get color for temperature
 */
export function getTemperatureColor(temperature: string): string {
  const tempLower = temperature.toLowerCase()
  return CHART_COLORS[tempLower as keyof typeof CHART_COLORS] || CHART_COLORS.muted
}

/**
 * Aggregate data by time period
 */
export function aggregateByPeriod<T extends { createdAt: Date }>(
  data: T[],
  days: number
): Record<string, number> {
  const dateLabels = generateDateLabels(days)
  const aggregated: Record<string, number> = {}

  // Initialize all dates with 0
  dateLabels.forEach(date => {
    aggregated[date] = 0
  })

  // Count items per date
  data.forEach(item => {
    const dateKey = item.createdAt.toISOString().split('T')[0]
    if (aggregated[dateKey] !== undefined) {
      aggregated[dateKey]++
    }
  })

  return aggregated
}
