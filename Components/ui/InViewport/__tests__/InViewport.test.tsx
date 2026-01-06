import { render, screen, waitFor } from '@testing-library/react'
import { InViewport } from '../InViewport'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})

// Helper to create mock IntersectionObserverEntry
const createMockEntry = (isIntersecting: boolean, target: Element): IntersectionObserverEntry => ({
  isIntersecting,
  target,
  boundingClientRect: {} as DOMRectReadOnly,
  intersectionRatio: isIntersecting ? 1 : 0,
  intersectionRect: {} as DOMRectReadOnly,
  rootBounds: null,
  time: Date.now(),
})

describe('InViewport', () => {
  beforeEach(() => {
    window.IntersectionObserver = mockIntersectionObserver as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders fallback initially', () => {
    render(
      <InViewport fallback={<div>Loading...</div>}>
        <div>Content</div>
      </InViewport>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders children when in viewport', async () => {
    let observerCallback: IntersectionObserverCallback

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    })

    render(
      <InViewport fallback={<div>Loading...</div>}>
        <div>Content</div>
      </InViewport>
    )

    // Simulate intersection
    const entries = [createMockEntry(true, document.createElement('div'))]
    observerCallback!(entries, {} as IntersectionObserver)

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('calls onIntersect callback when element enters viewport', async () => {
    const onIntersect = vi.fn()
    let observerCallback: IntersectionObserverCallback

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    })

    render(
      <InViewport onIntersect={onIntersect}>
        <div>Content</div>
      </InViewport>
    )

    // Simulate intersection
    const entries = [createMockEntry(true, document.createElement('div'))]
    observerCallback!(entries, {} as IntersectionObserver)

    await waitFor(() => {
      expect(onIntersect).toHaveBeenCalledTimes(1)
    })
  })

  it('unobserves after first intersection when triggerOnce is true', async () => {
    const unobserveMock = vi.fn()
    let observerCallback: IntersectionObserverCallback

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: vi.fn(),
        unobserve: unobserveMock,
        disconnect: vi.fn(),
      }
    })

    const { container } = render(
      <InViewport triggerOnce={true}>
        <div>Content</div>
      </InViewport>
    )

    // Simulate intersection
    const element = container.firstChild as Element
    const entries = [
      {
        isIntersecting: true,
        target: element,
      } as IntersectionObserverEntry,
    ]
    observerCallback!(entries, {} as IntersectionObserver)

    await waitFor(() => {
      expect(unobserveMock).toHaveBeenCalledWith(element)
    })
  })

  it('continues observing when triggerOnce is false', async () => {
    const unobserveMock = vi.fn()
    let observerCallback: IntersectionObserverCallback

    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: vi.fn(),
        unobserve: unobserveMock,
        disconnect: vi.fn(),
      }
    })

    render(
      <InViewport triggerOnce={false}>
        <div>Content</div>
      </InViewport>
    )

    // Simulate intersection
    const entries = [createMockEntry(true, document.createElement('div'))]
    observerCallback!(entries, {} as IntersectionObserver)

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    // Should not unobserve
    expect(unobserveMock).not.toHaveBeenCalled()
  })

  it('renders immediately when IntersectionObserver is not supported', () => {
    // Remove IntersectionObserver
    const originalIO = window.IntersectionObserver
    // @ts-expect-error - Intentionally removing for test
    delete window.IntersectionObserver

    render(
      <InViewport fallback={<div>Loading...</div>}>
        <div>Content</div>
      </InViewport>
    )

    // Should render content immediately
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()

    // Restore
    window.IntersectionObserver = originalIO
  })

  it('applies custom className', () => {
    const { container } = render(
      <InViewport className="custom-class">
        <div>Content</div>
      </InViewport>
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('uses custom rootMargin and threshold', () => {
    const observeSpy = vi.fn()

    mockIntersectionObserver.mockImplementation((callback, options) => {
      expect(options?.rootMargin).toBe('300px')
      expect(options?.threshold).toBe(0.5)
      return {
        observe: observeSpy,
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    })

    render(
      <InViewport rootMargin="300px" threshold={0.5}>
        <div>Content</div>
      </InViewport>
    )

    expect(observeSpy).toHaveBeenCalled()
  })
})
