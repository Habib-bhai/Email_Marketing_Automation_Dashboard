/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { PieChart } from '../PieChart'

describe('PieChart', () => {
  const mockData = [
    { name: 'Healthy', value: 5, fill: 'hsl(var(--chart-1))' },
    { name: 'Warning', value: 2, fill: 'hsl(var(--chart-2))' },
    { name: 'Error', value: 1, fill: 'hsl(var(--chart-3))' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<PieChart data={mockData} />)).not.toThrow()
  })

  it('renders chart with data', () => {
    const { container } = render(<PieChart data={mockData} />)
    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument()
  })

  it('handles empty data gracefully', () => {
    const { container } = render(<PieChart data={[]} />)
    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<PieChart data={mockData} className="custom-chart" />)
    expect(container.firstChild).toHaveClass('custom-chart')
  })

  it('uses custom dataKey when provided', () => {
    render(<PieChart data={mockData} dataKey="value" />)
    const wrapper = screen.getByRole('img', { hidden: true })
    expect(wrapper).toBeInTheDocument()
  })
})
