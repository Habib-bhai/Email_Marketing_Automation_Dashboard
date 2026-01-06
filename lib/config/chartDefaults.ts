// lib/config/chartDefaults.ts

/**
 * T111 - Extract chart configs to centralized configuration
 * Provides reusable chart configurations for consistent styling
 */

export const chartDefaults = {
  /**
   * Common margin configuration for all charts
   */
  margin: {
    top: 5,
    right: 30,
    left: 20,
    bottom: 5
  },

  /**
   * Responsive container default height
   */
  height: 300,

  /**
   * Tooltip configuration
   */
  tooltip: {
    contentStyle: {
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px'
    },
    cursor: {
      fill: 'hsl(var(--muted) / 0.3)'
    }
  },

  /**
   * Axis configuration
   */
  axis: {
    stroke: 'hsl(var(--foreground))',
    fontSize: 12,
    tickLine: false,
    axisLine: false
  },

  /**
   * CartesianGrid configuration
   */
  grid: {
    strokeDasharray: '3 3',
    stroke: 'hsl(var(--border))'
  },

  /**
   * Legend configuration
   */
  legend: {
    verticalAlign: 'top' as const,
    height: 36,
    wrapperStyle: {
      fontSize: '14px'
    }
  },

  /**
   * Bar chart specific configs
   */
  bar: {
    radius: [8, 8, 0, 0] as [number, number, number, number],
    fill: 'hsl(var(--primary))'
  },

  /**
   * Line chart specific configs
   */
  line: {
    type: 'monotone' as const,
    strokeWidth: 2,
    dot: { r: 4 },
    activeDot: { r: 6 }
  },

  /**
   * Pie/Donut chart specific configs
   */
  pie: {
    innerRadius: 60,
    outerRadius: 90,
    paddingAngle: 2
  },

  /**
   * Animation configuration
   */
  animation: {
    duration: 800,
    easing: 'ease-out' as const
  }
}

/**
 * Helper to format tick values with locale
 */
export const formatTick = (value: number): string => {
  return value.toLocaleString()
}

/**
 * Helper to format percentage values
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`
}

/**
 * Helper to get responsive font size
 */
export const getResponsiveFontSize = (baseSize: number, screenWidth: number): number => {
  if (screenWidth < 640) return baseSize * 0.8
  if (screenWidth < 1024) return baseSize * 0.9
  return baseSize
}
