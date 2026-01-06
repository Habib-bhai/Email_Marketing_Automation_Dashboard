/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { SummaryCard } from '../SummaryCard'

describe('SummaryCard', () => {
  const defaultProps = {
    title: 'Total Leads',
    value: '1,234',
    change: '+12%',
    trend: 'up' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the title correctly', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.getByText('Total Leads')).toBeInTheDocument()
  })

  it('renders the value correctly', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('renders the change percentage', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  it('applies correct trend styling for up trend', () => {
    const { container } = render(<SummaryCard {...defaultProps} trend="up" />)
    const changeElement = screen.getByText('+12%')
    expect(changeElement).toHaveClass('text-green-600')
  })

  it('applies correct trend styling for down trend', () => {
    const { container } = render(<SummaryCard {...defaultProps} trend="down" change="-5%" />)
    const changeElement = screen.getByText('-5%')
    expect(changeElement).toHaveClass('text-red-600')
  })

  it('applies correct trend styling for neutral trend', () => {
    const { container } = render(<SummaryCard {...defaultProps} trend="neutral" change="0%" />)
    const changeElement = screen.getByText('0%')
    expect(changeElement).toHaveClass('text-muted-foreground')
  })

  it('renders loading state', () => {
    render(<SummaryCard {...defaultProps} isLoading />)
    const skeletons = screen.getAllByRole('status')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('applies custom className', () => {
    const { container } = render(<SummaryCard {...defaultProps} className="custom-card" />)
    expect(container.firstChild).toHaveClass('custom-card')
  })

  it('renders without optional change and trend props', () => {
    render(<SummaryCard title="Simple Card" value="100" />)
    expect(screen.getByText('Simple Card')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })
})
