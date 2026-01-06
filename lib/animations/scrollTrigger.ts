// lib/animations/scrollTrigger.ts

/**
 * T129 - Scroll trigger manager for scroll-based animations
 * Manages scroll event listeners and triggers animations based on scroll position
 */

export interface ScrollTriggerOptions {
  trigger: string | HTMLElement // Element selector or element to trigger on
  start?: string // Start position (e.g., "top center", "50% 80%")
  end?: string // End position
  scrub?: boolean | number // Smooth scrubbing (true or smoothness value)
  pin?: boolean // Pin element during animation
  markers?: boolean // Show debug markers
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
  onUpdate?: (progress: number) => void
}

export interface ScrollTriggerInstance {
  kill: () => void
  refresh: () => void
  progress: () => number
}

class ScrollTriggerManager {
  private triggers: Map<string, ScrollTriggerInstance> = new Map()
  private rafId: number | null = null
  private isScrolling = false

  /**
   * Create a scroll trigger
   */
  create(id: string, options: ScrollTriggerOptions): ScrollTriggerInstance {
    const element =
      typeof options.trigger === 'string'
        ? document.querySelector(options.trigger)
        : options.trigger

    if (!element) {
      console.warn(`ScrollTrigger: Element not found for ${options.trigger}`)
      return this.createDummyInstance()
    }

    const instance = this.setupTrigger(element as HTMLElement, options)
    this.triggers.set(id, instance)

    // Start scroll listener if not already running
    if (!this.isScrolling) {
      this.startScrollListener()
    }

    return instance
  }

  /**
   * Setup individual trigger
   */
  private setupTrigger(
    element: HTMLElement,
    options: ScrollTriggerOptions
  ): ScrollTriggerInstance {
    let isActive = false
    let hasEntered = false
    let currentProgress = 0

    const update = () => {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Parse start and end positions
      const { startOffset, endOffset } = this.parsePositions(
        options.start || 'top bottom',
        options.end || 'bottom top',
        viewportHeight
      )

      // Calculate if trigger is active
      const elementTop = rect.top
      const elementBottom = rect.bottom

      const isInView =
        elementTop < viewportHeight - startOffset && elementBottom > endOffset

      // Calculate progress (0 to 1)
      const totalDistance = viewportHeight - startOffset + rect.height - endOffset
      const currentPosition = viewportHeight - startOffset - elementTop
      const progress = Math.max(0, Math.min(1, currentPosition / totalDistance))

      currentProgress = progress

      // Handle state changes
      if (isInView && !isActive) {
        isActive = true
        if (!hasEntered) {
          hasEntered = true
          options.onEnter?.()
        } else {
          options.onEnterBack?.()
        }
      } else if (!isInView && isActive) {
        isActive = false
        if (elementTop > viewportHeight) {
          options.onLeaveBack?.()
        } else {
          options.onLeave?.()
        }
      }

      // Update progress
      if (isActive && options.onUpdate) {
        options.onUpdate(progress)
      }

      // Handle scrubbing
      if (options.scrub && isActive) {
        const scrubValue =
          typeof options.scrub === 'number' ? options.scrub : 0.1
        this.applyScrub(element, progress, scrubValue)
      }

      // Handle pinning
      if (options.pin && isActive) {
        this.applyPin(element)
      }
    }

    // Initial update
    update()

    // Return instance
    return {
      kill: () => {
        this.triggers.delete(element.id || element.className)
      },
      refresh: () => {
        update()
      },
      progress: () => currentProgress
    }
  }

  /**
   * Parse position strings (e.g., "top center" = 50% of viewport)
   */
  private parsePositions(
    start: string,
    end: string,
    viewportHeight: number
  ): { startOffset: number; endOffset: number } {
    const parsePosition = (pos: string): number => {
      const parts = pos.split(' ')
      let offset = 0

      parts.forEach(part => {
        if (part.endsWith('%')) {
          const percent = parseFloat(part) / 100
          offset += viewportHeight * percent
        } else if (part === 'top') {
          offset += 0
        } else if (part === 'center') {
          offset += viewportHeight / 2
        } else if (part === 'bottom') {
          offset += viewportHeight
        } else if (part.endsWith('px')) {
          offset += parseFloat(part)
        }
      })

      return offset
    }

    return {
      startOffset: parsePosition(start),
      endOffset: parsePosition(end)
    }
  }

  /**
   * Apply scrubbing effect
   */
  private applyScrub(element: HTMLElement, progress: number, smoothness: number) {
    // Smooth transition based on progress
    const currentTransform = element.style.transform || ''
    // You can customize this based on your needs
    element.style.setProperty('--scroll-progress', progress.toString())
  }

  /**
   * Apply pin effect
   */
  private applyPin(element: HTMLElement) {
    element.style.position = 'sticky'
    element.style.top = '0'
  }

  /**
   * Start scroll listener
   */
  private startScrollListener() {
    this.isScrolling = true

    const handleScroll = () => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
      }

      this.rafId = requestAnimationFrame(() => {
        this.triggers.forEach(trigger => trigger.refresh())
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
  }

  /**
   * Kill all triggers
   */
  killAll() {
    this.triggers.forEach(trigger => trigger.kill())
    this.triggers.clear()
    this.isScrolling = false

    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  /**
   * Create dummy instance for error cases
   */
  private createDummyInstance(): ScrollTriggerInstance {
    return {
      kill: () => {},
      refresh: () => {},
      progress: () => 0
    }
  }
}

// Singleton instance
const scrollTriggerManager = new ScrollTriggerManager()

/**
 * Create a scroll trigger
 */
export function createScrollTrigger(
  id: string,
  options: ScrollTriggerOptions
): ScrollTriggerInstance {
  return scrollTriggerManager.create(id, options)
}

/**
 * Kill all scroll triggers
 */
export function killAllScrollTriggers() {
  scrollTriggerManager.killAll()
}

/**
 * Simple scroll to element with animation
 */
export function scrollToElement(
  element: string | HTMLElement,
  options: ScrollToOptions = {}
) {
  const target =
    typeof element === 'string' ? document.querySelector(element) : element

  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    })
  }
}

/**
 * Get current scroll progress of page (0 to 1)
 */
export function getScrollProgress(): number {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  return scrollTop / (documentHeight - windowHeight)
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset: number = 0): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  )
}
