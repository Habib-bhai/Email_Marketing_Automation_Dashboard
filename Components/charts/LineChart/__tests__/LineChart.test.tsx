/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { LineChart } from '../LineChart'

describe('LineChart', () => {
  const mockData = [
    { name: 'Mon', opens: 120, clicks: 45, replies: 12 },
    { name: 'Tue', opens: 135, clicks: 52, replies: 15 },
    { name: 'Wed', opens: 150, clicks: 60, replies: 18 },
    { name: 'Thu', opens: 142, clicks: 55, replies: 14 },
    { name: 'Fri', opens: 165, clicks: 68, replies: 20 },
  ]

  const lines = [
    { dataKey: 'opens', stroke: 'hsl(var(--chart-1))', name: 'Opens' },
    { dataKey: 'clicks', stroke: 'hsl(var(--chart-2))', name: 'Clicks' },
    { dataKey: 'replies', stroke: 'hsl(var(--chart-3))', name: 'Replies' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<LineChart data={mockData} lines={lines} />)).not.toThrow()
  })

  it('renders chart with data', () => {
    const { container } = render(<LineChart data={mockData} lines={lines} />)
    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument()
  })

  it('handles empty data gracefully', () => {
    const { container } = render(<LineChart data={[]} lines={lines} />)
    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<LineChart data={mockData} lines={lines} className="custom-chart" />)
    expect(container.firstChild).toHaveClass('custom-chart')
  })

  it('uses custom xAxisKey when provided', () => {
    render(<LineChart data={mockData} lines={lines} xAxisKey="name" />)
    const wrapper = screen.getByRole('img', { hidden: true })
    expect(wrapper).toBeInTheDocument()
  })
})
