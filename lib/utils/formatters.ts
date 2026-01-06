/**
 * Formatting utilities for numbers, dates, and currencies
 */

/**
 * Format a number as a percentage
 * @example formatPercentage(0.456) => "45.6%"
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format a large number with K/M/B suffixes
 * @example formatCompactNumber(1234) => "1.2K"
 */
export function formatCompactNumber(value: number): string {
  if (value < 1000) return value.toString()
  if (value < 1000000) return `${(value / 1000).toFixed(1)}K`
  if (value < 1000000000) return `${(value / 1000000).toFixed(1)}M`
  return `${(value / 1000000000).toFixed(1)}B`
}

/**
 * Format a number with thousands separators
 * @example formatNumber(1234567) => "1,234,567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`
  if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`
  if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format a date to a standard display format
 * @example formatDate(new Date()) => "Jan 1, 2026"
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format a date and time
 * @example formatDateTime(new Date()) => "Jan 1, 2026, 10:30 AM"
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

/**
 * Calculate reply rate percentage
 * FR-008: (repliesReceived / emailsSent) * 100
 */
export function calculateReplyRate(repliesReceived: number, emailsSent: number): number {
  if (emailsSent === 0) return 0
  return (repliesReceived / emailsSent) * 100
}

/**
 * Calculate open rate percentage
 * FR-009: (opensDetected / emailsSent) * 100
 */
export function calculateOpenRate(opensDetected: number, emailsSent: number): number {
  if (emailsSent === 0) return 0
  return (opensDetected / emailsSent) * 100
}
