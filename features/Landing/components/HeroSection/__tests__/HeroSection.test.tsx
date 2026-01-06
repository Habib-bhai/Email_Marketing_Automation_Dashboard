/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { HeroSection } from '../HeroSection'

describe('HeroSection', () => {
  const defaultProps = {
    title: 'Email Marketing Automation',
    subtitle: 'Automate your email campaigns and track performance in real-time',
    ctaText: 'Get Started',
    onCtaClick: expect.any(Function),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the title correctly', () => {
    render(<HeroSection {...defaultProps} />)
    expect(screen.getByText('Email Marketing Automation')).toBeInTheDocument()
  })

  it('renders the subtitle correctly', () => {
    render(<HeroSection {...defaultProps} />)
    expect(screen.getByText('Automate your email campaigns and track performance in real-time')).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    render(<HeroSection {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
  })

  it('calls onCtaClick when CTA button is clicked', () => {
    const onCtaClick = vi.fn()
    render(<HeroSection {...defaultProps} onCtaClick={onCtaClick} />)
    const button = screen.getByRole('button', { name: 'Get Started' })
    button.click()
    expect(onCtaClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    const { container } = render(<HeroSection {...defaultProps} className="custom-hero" />)
    expect(container.firstChild).toHaveClass('custom-hero')
  })

  it('renders with default props when not provided', () => {
    render(<HeroSection title="Test Title" subtitle="Test Subtitle" ctaText="Click Me" onCtaClick={vi.fn()} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument()
  })
})
