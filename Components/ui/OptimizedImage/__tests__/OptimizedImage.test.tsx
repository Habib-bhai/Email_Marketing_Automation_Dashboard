import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { OptimizedImage } from '../OptimizedImage'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, onError, className, ...props }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    )
  },
}))

describe('OptimizedImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders image with correct props', () => {
    render(<OptimizedImage {...defaultProps} />)
    
    const img = screen.getByRole('img', { name: 'Test image' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test-image.jpg')
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('applies rounded class when rounded prop is provided', () => {
    const { container } = render(
      <OptimizedImage {...defaultProps} rounded="full" />
    )
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('rounded-full')
  })

  it('applies border class when border prop is true', () => {
    render(<OptimizedImage {...defaultProps} border />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveClass('border-2')
  })

  it('applies custom border class when border is string', () => {
    render(<OptimizedImage {...defaultProps} border="border-4 border-red-500" />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveClass('border-4', 'border-red-500')
  })

  it('sets aspect ratio on wrapper', () => {
    const { container } = render(
      <OptimizedImage {...defaultProps} aspectRatio="16/9" />
    )
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveStyle({ aspectRatio: '16/9' })
  })

  it('shows loading placeholder initially when showBlurPlaceholder is true', () => {
    const { container } = render(
      <OptimizedImage {...defaultProps} showBlurPlaceholder />
    )
    
    // Check for loading placeholder
    const placeholder = container.querySelector('.animate-pulse')
    expect(placeholder).toBeInTheDocument()
  })

  it('hides loading placeholder after image loads', async () => {
    const { container } = render(
      <OptimizedImage {...defaultProps} showBlurPlaceholder />
    )
    
    const img = screen.getByRole('img')
    
    // Simulate image load
    fireEvent.load(img)
    
    await waitFor(() => {
      const placeholder = container.querySelector('.animate-pulse')
      expect(placeholder).not.toBeInTheDocument()
    })
  })

  it('displays fallback image on error', async () => {
    const fallbackSrc = '/fallback.jpg'
    render(
      <OptimizedImage
        {...defaultProps}
        fallbackSrc={fallbackSrc}
      />
    )
    
    const img = screen.getByRole('img')
    
    // Simulate image error
    fireEvent.error(img)
    
    await waitFor(() => {
      expect(img).toHaveAttribute('src', fallbackSrc)
    })
  })

  it('calls onError callback when image fails to load', async () => {
    const onError = vi.fn()
    render(
      <OptimizedImage
        {...defaultProps}
        onError={onError}
      />
    )
    
    const img = screen.getByRole('img')
    fireEvent.error(img)
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })

  it('calls onLoad callback when image loads successfully', async () => {
    const onLoad = vi.fn()
    render(
      <OptimizedImage
        {...defaultProps}
        onLoad={onLoad}
      />
    )
    
    const img = screen.getByRole('img')
    fireEvent.load(img)
    
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1)
    })
  })

  it('shows error icon when image fails and no fallback provided', async () => {
    const { container } = render(
      <OptimizedImage
        {...defaultProps}
        fallbackSrc=""
      />
    )
    
    const img = screen.getByRole('img')
    fireEvent.error(img)
    
    await waitFor(() => {
      const errorIcon = container.querySelector('svg')
      expect(errorIcon).toBeInTheDocument()
    })
  })

  it('applies custom className to image', () => {
    render(
      <OptimizedImage
        {...defaultProps}
        className="custom-class"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveClass('custom-class')
  })

  it('applies wrapperClassName to wrapper div', () => {
    const { container } = render(
      <OptimizedImage
        {...defaultProps}
        wrapperClassName="wrapper-custom"
      />
    )
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('wrapper-custom')
  })

  it('does not show blur placeholder when showBlurPlaceholder is false', () => {
    const { container } = render(
      <OptimizedImage
        {...defaultProps}
        showBlurPlaceholder={false}
      />
    )
    
    const placeholder = container.querySelector('.animate-pulse')
    expect(placeholder).not.toBeInTheDocument()
  })

  it('transitions opacity after loading', async () => {
    render(<OptimizedImage {...defaultProps} showBlurPlaceholder />)
    
    const img = screen.getByRole('img')
    
    // Initially should be transparent
    expect(img).toHaveClass('opacity-0')
    
    // Simulate load
    fireEvent.load(img)
    
    await waitFor(() => {
      expect(img).toHaveClass('opacity-100')
    })
  })
})
