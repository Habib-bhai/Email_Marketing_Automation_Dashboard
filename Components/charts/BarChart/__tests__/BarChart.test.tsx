/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { BarChart } from '../BarChart'

describe('BarChart', () => {
  const mockData = [
    { name: 'New', value: 45, fill: 'hsl(var(--chart-1))' },
    { name: 'Contacted', value: 32, fill: 'hsl(var(--chart-2))' },
    { name: 'Qualified', value: 21, fill: 'hsl(var(--chart-3))' },
    { name: 'Proposal', value: 12, fill: 'hsl(var(--chart-4))' },
    { name: 'Won', value: 8, fill: 'hsl(var(--chart-5))' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<BarChart data={mockData} />)).not.toThrow()
  })

  it('renders chart with data', () => {
    const { container } = render(<BarChart data={mockData} />)
    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument()
  })

  it('handles empty data gracefully', () => {
    const { container } = render(<BarChart data={[]} />)
    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<BarChart data={mockData} className="custom-chart" />)
    expect(container.firstChild).toHaveClass('custom-chart')
  })

  it('uses custom dataKey when provided', () => {
    render(<BarChart data={mockData} dataKey="value" />)
    // Recharts will use the dataKey internally
    expect(screen.queryByText('0')).toBeInTheDocument() // Y-axis starts at 0
  })

  it('uses custom xAxisKey when provided', () => {
    render(<BarChart data={mockData} xAxisKey="name" />)
    // X-axis will use the specified key
    const wrapper = screen.getByRole('img', { hidden: true })
    expect(wrapper).toBeInTheDocument()
  })
})
