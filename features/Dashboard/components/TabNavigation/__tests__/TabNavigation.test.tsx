/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { TabNavigation } from '../TabNavigation'

describe('TabNavigation', () => {
  const mockOnTabChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all tabs', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Lead Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Email Analytics')).toBeInTheDocument()
    expect(screen.getByText('Automation Health')).toBeInTheDocument()
  })

  it('highlights the active tab', () => {
    render(<TabNavigation activeTab="pipeline" onTabChange={mockOnTabChange} />)
    const pipelineTab = screen.getByText('Lead Pipeline').closest('button')
    expect(pipelineTab).toHaveClass('bg-primary')
  })

  it('calls onTabChange when a tab is clicked', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />)
    const analyticsTab = screen.getByText('Email Analytics')
    fireEvent.click(analyticsTab)
    expect(mockOnTabChange).toHaveBeenCalledWith('analytics')
  })

  it('applies custom className', () => {
    const { container } = render(
      <TabNavigation activeTab="overview" onTabChange={mockOnTabChange} className="custom-tabs" />
    )
    expect(container.firstChild).toHaveClass('custom-tabs')
  })

  it('renders correct number of tabs', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })
})
