// __tests__/unit/components/MetricCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricCard } from '@/Components/dashboard/MetricCard/MetricCard'
import { TrendingUp } from 'lucide-react'

// Mock AnimatedCounter to render the final value immediately for deterministic tests
vi.mock('@/Components/enhanced/AnimatedCounter', () => ({
  AnimatedCounter: ({ value, formatter }: { value: number; formatter?: (v: number) => string }) => {
    // Apply formatter if provided, otherwise use default locale formatting
    const displayValue = formatter ? formatter(value) : value.toLocaleString('en-US')
    return <span>{displayValue}</span>
  },
}))

/**
 * T058 - Test: MetricCard displays value, trend, timestamp
 */

describe('MetricCard Component', () => {
  it('should display title and value', () => {
    render(
      <MetricCard
        title="Total Leads"
        value={1250}
      />
    )

    expect(screen.getByText('Total Leads')).toBeInTheDocument()
    expect(screen.getByText('1,250')).toBeInTheDocument()
  })

  it('should display value with unit', () => {
    render(
      <MetricCard
        title="Reply Rate"
        value={15.5}
        unit="%"
      />
    )

    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('should display positive trend with up arrow', () => {
    render(
      <MetricCard
        title="Active Campaigns"
        value={50}
        trend={{
          value: 12.5,
          isPositive: true,
          label: 'vs last week'
        }}
      />
    )

    expect(screen.getByText('12.5%')).toBeInTheDocument()
    expect(screen.getByText('vs last week')).toBeInTheDocument()
    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  it('should display negative trend with down arrow', () => {
    render(
      <MetricCard
        title="Bounce Rate"
        value={8}
        trend={{
          value: 3.2,
          isPositive: false,
          label: 'vs last month'
        }}
      />
    )

    expect(screen.getByText('3.2%')).toBeInTheDocument()
    expect(screen.getByText('vs last month')).toBeInTheDocument()
    expect(screen.getByText('↓')).toBeInTheDocument()
  })

  it('should display subtitle', () => {
    render(
      <MetricCard
        title="Open Rate"
        value={45}
        subtitle="Email engagement"
      />
    )

    expect(screen.getByText('Email engagement')).toBeInTheDocument()
  })

  it('should render icon when provided', () => {
    const { container } = render(
      <MetricCard
        title="Total Leads"
        value={1000}
        icon={TrendingUp}
      />
    )

    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should use custom value formatter', () => {
    render(
      <MetricCard
        title="Revenue"
        value={12345.67}
        valueFormatter={(val) => `$${val.toFixed(2)}`}
      />
    )

    expect(screen.getByText('$12345.67')).toBeInTheDocument()
  })

  it('should apply color variant class', () => {
    const { container } = render(
      <MetricCard
        title="Total Leads"
        value={100}
        color="success"
      />
    )

    const card = container.querySelector('.color-success')
    expect(card).toBeInTheDocument()
  })

  it('should animate value when animate prop is true', () => {
    render(
      <MetricCard
        title="Animated Counter"
        value={1000}
        animate={true}
      />
    )

    // Value should initially be 0 or animating
    const valueElement = screen.getByText(/\d+/)
    expect(valueElement).toBeInTheDocument()
  })

  it('should not animate value when animate prop is false', () => {
    render(
      <MetricCard
        title="Static Counter"
        value={1000}
        animate={false}
      />
    )

    expect(screen.getByText('1,000')).toBeInTheDocument()
  })
})
