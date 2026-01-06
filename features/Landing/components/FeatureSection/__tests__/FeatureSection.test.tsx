/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { FeatureSection } from '../FeatureSection'

describe('FeatureSection', () => {
  const mockFeatures = [
    {
      id: '1',
      title: 'Lead Tracking',
      description: 'Track leads through your pipeline with detailed analytics and insights.',
      icon: 'trending-up',
    },
    {
      id: '2',
      title: 'Email Analytics',
      description: 'Monitor open rates, click-through rates, and engagement metrics.',
      icon: 'mail',
    },
    {
      id: '3',
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and nurture leads automatically.',
      icon: 'zap',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all feature items', () => {
    render(<FeatureSection features={mockFeatures} />)
    expect(screen.getByText('Lead Tracking')).toBeInTheDocument()
    expect(screen.getByText('Email Analytics')).toBeInTheDocument()
    expect(screen.getByText('Workflow Automation')).toBeInTheDocument()
  })

  it('renders feature descriptions', () => {
    render(<FeatureSection features={mockFeatures} />)
    expect(screen.getByText('Track leads through your pipeline with detailed analytics and insights.')).toBeInTheDocument()
    expect(screen.getByText('Monitor open rates, click-through rates, and engagement metrics.')).toBeInTheDocument()
    expect(screen.getByText('Automate repetitive tasks and nurture leads automatically.')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<FeatureSection features={mockFeatures} className="custom-feature" />)
    expect(container.firstChild).toHaveClass('custom-feature')
  })

  it('renders correct number of feature cards', () => {
    render(<FeatureSection features={mockFeatures} />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
  })

  it('handles empty features array', () => {
    render(<FeatureSection features={[]} />)
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('handles single feature', () => {
    const singleFeature = [mockFeatures[0]]
    render(<FeatureSection features={singleFeature} />)
    expect(screen.getByText('Lead Tracking')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })
})
