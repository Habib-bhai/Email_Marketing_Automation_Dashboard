/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { MetricFilter } from '../MetricFilter'

describe('MetricFilter', () => {
  const mockOnFilterChange = vi.fn()
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all filter options', () => {
    render(<MetricFilter filters={filters} activeFilter="all" onFilterChange={mockOnFilterChange} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('highlights the active filter', () => {
    render(<MetricFilter filters={filters} activeFilter="active" onFilterChange={mockOnFilterChange} />)
    const activeButton = screen.getByText('Active').closest('button')
    expect(activeButton).toHaveClass('bg-primary')
  })

  it('calls onFilterChange when a filter is clicked', () => {
    render(<MetricFilter filters={filters} activeFilter="all" onFilterChange={mockOnFilterChange} />)
    const completedFilter = screen.getByText('Completed')
    fireEvent.click(completedFilter)
    expect(mockOnFilterChange).toHaveBeenCalledWith('completed')
  })

  it('applies custom className', () => {
    const { container } = render(
      <MetricFilter
        filters={filters}
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        className="custom-filter"
      />
    )
    expect(container.firstChild).toHaveClass('custom-filter')
  })

  it('renders correct number of filter buttons', () => {
    render(<MetricFilter filters={filters} activeFilter="all" onFilterChange={mockOnFilterChange} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
  })
})
