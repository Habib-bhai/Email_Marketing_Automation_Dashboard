import { renderHook, waitFor } from '@testing-library/react'
import { useResponsiveAnimation, getScaledParticleCount, getScaledDuration } from '../useResponsiveAnimation'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('useResponsiveAnimation', () => {
  let matchMediaMock: any

  beforeEach(() => {
    // Mock window.matchMedia
    matchMediaMock = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns default config for desktop', () => {
    // Mock desktop environment
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
    Object.defineProperty(navigator, 'userAgent', { 
      writable: true, 
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' 
    })

    const { result } = renderHook(() => useResponsiveAnimation())

    expect(result.current.isMobile).toBe(false)
    expect(result.current.prefersReducedMotion).toBe(false)
    expect(result.current.shouldReduce).toBe(false)
    expect(result.current.particleScale).toBe(1)
    expect(result.current.durationScale).toBe(1)
  })

  it('detects mobile device based on screen width and touch support', () => {
    // Mock mobile environment
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 })
    Object.defineProperty(window, 'ontouchstart', { writable: true, value: {} })
    Object.defineProperty(navigator, 'maxTouchPoints', { writable: true, value: 5 })

    const { result } = renderHook(() => useResponsiveAnimation())

    expect(result.current.isMobile).toBe(true)
    expect(result.current.shouldReduce).toBe(true)
    expect(result.current.particleScale).toBe(0.3) // 30% on mobile
  })

  it('detects mobile device based on user agent', () => {
    // Mock mobile user agent
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
    Object.defineProperty(navigator, 'userAgent', { 
      writable: true, 
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' 
    })

    const { result } = renderHook(() => useResponsiveAnimation())

    expect(result.current.isMobile).toBe(true)
    expect(result.current.particleScale).toBe(0.3)
  })

  it('detects prefers-reduced-motion', () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }))

    const { result } = renderHook(() => useResponsiveAnimation())

    expect(result.current.prefersReducedMotion).toBe(true)
    expect(result.current.shouldReduce).toBe(true)
    expect(result.current.particleScale).toBe(0.5) // 50% for reduced motion
    expect(result.current.durationScale).toBe(1.5) // Slower animations
  })

  it('listens for prefers-reduced-motion changes', async () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | undefined
    
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((event: string, handler: any) => {
        if (event === 'change') changeHandler = handler
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }))

    const { result } = renderHook(() => useResponsiveAnimation())

    // Initially no reduced motion
    expect(result.current.prefersReducedMotion).toBe(false)

    // Simulate user enabling reduced motion
    if (changeHandler) {
      const event = { matches: true } as MediaQueryListEvent
      changeHandler(event)
    }

    await waitFor(() => {
      expect(result.current.prefersReducedMotion).toBe(true)
      expect(result.current.particleScale).toBe(0.5)
    })
  })

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerMock = vi.fn()
    matchMediaMock.mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }))

    const { unmount } = renderHook(() => useResponsiveAnimation())
    unmount()

    expect(removeEventListenerMock).toHaveBeenCalled()
  })
})

describe('getScaledParticleCount', () => {
  it('scales particle count on mobile', () => {
    const config = {
      shouldReduce: true,
      isMobile: true,
      prefersReducedMotion: false,
      particleScale: 0.3,
      durationScale: 1,
    }

    expect(getScaledParticleCount(100, config)).toBe(30) // 30% of 100
    expect(getScaledParticleCount(50, config)).toBe(15)  // 30% of 50
  })

  it('returns base count on desktop', () => {
    const config = {
      shouldReduce: false,
      isMobile: false,
      prefersReducedMotion: false,
      particleScale: 1,
      durationScale: 1,
    }

    expect(getScaledParticleCount(100, config)).toBe(100)
    expect(getScaledParticleCount(50, config)).toBe(50)
  })

  it('rounds to nearest integer', () => {
    const config = {
      shouldReduce: true,
      isMobile: false,
      prefersReducedMotion: true,
      particleScale: 0.5,
      durationScale: 1.5,
    }

    expect(getScaledParticleCount(33, config)).toBe(16) // floor(33 * 0.5) = 16
  })
})

describe('getScaledDuration', () => {
  it('scales duration for reduced motion', () => {
    const config = {
      shouldReduce: true,
      isMobile: false,
      prefersReducedMotion: true,
      particleScale: 0.5,
      durationScale: 1.5,
    }

    expect(getScaledDuration(1000, config)).toBe(1500) // 1.5x slower
    expect(getScaledDuration(2000, config)).toBe(3000)
  })

  it('returns base duration normally', () => {
    const config = {
      shouldReduce: false,
      isMobile: false,
      prefersReducedMotion: false,
      particleScale: 1,
      durationScale: 1,
    }

    expect(getScaledDuration(1000, config)).toBe(1000)
    expect(getScaledDuration(2000, config)).toBe(2000)
  })
})
