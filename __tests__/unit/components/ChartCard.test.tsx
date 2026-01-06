// __tests__/unit/components/ChartCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChartCard } from '@/Components/dashboard/ChartCard/ChartCard'

/**
 * T059 - Test: ChartCard renders loading/empty/error states
 */

describe('ChartCard Component', () => {
  describe('Loading State', () => {
    it('should render loading state when loading prop is true', () => {
      render(
        <ChartCard
          title="Test Chart"
          loading={true}
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      expect(screen.getByText('Test Chart')).toBeInTheDocument()
      expect(screen.queryByText('Chart Content')).not.toBeInTheDocument()
      // LoadingState component renders skeletons
      const skeletons = document.querySelectorAll('.h-4')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should not render children when loading', () => {
      render(
        <ChartCard
          title="Loading Chart"
          loading={true}
        >
          <div data-testid="chart-content">Chart</div>
        </ChartCard>
      )

      expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should render error state when error prop is provided', () => {
      const error = new Error('Failed to fetch data')
      render(
        <ChartCard
          title="Error Chart"
          error={error}
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      expect(screen.getByText('Failed to load chart')).toBeInTheDocument()
      expect(screen.getByText('Failed to fetch data')).toBeInTheDocument()
      expect(screen.queryByText('Chart Content')).not.toBeInTheDocument()
    })

    it('should render error state with string error', () => {
      render(
        <ChartCard
          title="Error Chart"
          error="Network error occurred"
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      expect(screen.getByText('Network error occurred')).toBeInTheDocument()
    })

    it('should call onRetry when retry button is clicked', () => {
      const onRetry = vi.fn()
      render(
        <ChartCard
          title="Error Chart"
          error="Test error"
          onRetry={onRetry}
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      const retryButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(retryButton)

      expect(onRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('Empty State', () => {
    it('should render empty state when isEmpty is true', () => {
      render(
        <ChartCard
          title="Empty Chart"
          isEmpty={true}
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      expect(screen.getByText('No data')).toBeInTheDocument()
      expect(screen.getByText('No data available for this chart')).toBeInTheDocument()
      expect(screen.queryByText('Chart Content')).not.toBeInTheDocument()
    })

    it('should render custom empty message', () => {
      render(
        <ChartCard
          title="Empty Chart"
          isEmpty={true}
          emptyMessage="Custom empty message"
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      expect(screen.getByText('Custom empty message')).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    it('should render children when no loading/error/empty state', () => {
      render(
        <ChartCard
          title="Success Chart"
          loading={false}
          isEmpty={false}
        >
          <div data-testid="chart-content">Chart Content</div>
        </ChartCard>
      )

      expect(screen.getByTestId('chart-content')).toBeInTheDocument()
      expect(screen.getByText('Chart Content')).toBeInTheDocument()
    })

    it('should render description when provided', () => {
      render(
        <ChartCard
          title="Test Chart"
          description="This is a test chart description"
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      expect(screen.getByText('This is a test chart description')).toBeInTheDocument()
    })

    it('should render header action when provided', () => {
      render(
        <ChartCard
          title="Test Chart"
          headerAction={<button>Refresh</button>}
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
    })
  })

  describe('State Priority', () => {
    it('should prioritize loading over error', () => {
      render(
        <ChartCard
          title="Priority Chart"
          loading={true}
          error="Error message"
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      // Should show loading, not error
      expect(screen.queryByText('Failed to load chart')).not.toBeInTheDocument()
      const skeletons = document.querySelectorAll('.h-4')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should prioritize error over empty', () => {
      render(
        <ChartCard
          title="Priority Chart"
          loading={false}
          error="Error message"
          isEmpty={true}
        >
          <div>Chart Content</div>
        </ChartCard>
      )

      // Should show error, not empty
      expect(screen.getByText('Failed to load chart')).toBeInTheDocument()
      expect(screen.queryByText('No data')).not.toBeInTheDocument()
    })

    it('should prioritize empty over content', () => {
      render(
        <ChartCard
          title="Priority Chart"
          isEmpty={true}
        >
          <div data-testid="chart-content">Chart Content</div>
        </ChartCard>
      )

      // Should show empty, not content
      expect(screen.getByText('No data')).toBeInTheDocument()
      expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()
    })
  })
})
