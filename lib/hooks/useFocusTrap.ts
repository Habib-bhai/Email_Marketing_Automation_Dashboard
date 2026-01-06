'use client'

import { useEffect, useRef, RefObject } from 'react'

/**
 * Hook to trap focus within a container element (typically a modal or dialog).
 * Prevents keyboard focus from leaving the container, cycling through focusable elements.
 * Essential for WCAG 2.1 AA compliance for modal dialogs.
 * 
 * @param containerRef - Ref to the container element
 * @param isActive - Whether focus trap is active
 * @param options - Configuration options
 * 
 * @example
 * ```tsx
 * const modalRef = useRef<HTMLDivElement>(null)
 * useFocusTrap(modalRef, isOpen, {
 *   initialFocus: true,
 *   returnFocus: true
 * })
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  containerRef: RefObject<T>,
  isActive: boolean = true,
  options: {
    /**
     * Focus first focusable element on mount
     * @default true
     */
    initialFocus?: boolean
    /**
     * Return focus to previously focused element on unmount
     * @default true
     */
    returnFocus?: boolean
    /**
     * Custom selector for focusable elements
     */
    focusableSelector?: string
  } = {}
) {
  const {
    initialFocus = true,
    returnFocus = true,
    focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]',
  } = options

  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current

    // Store previously focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const elements = container.querySelectorAll<HTMLElement>(focusableSelector)
      return Array.from(elements).filter((el) => {
        // Exclude hidden elements
        return (
          !el.hasAttribute('disabled') &&
          !el.getAttribute('aria-hidden') &&
          el.offsetParent !== null
        )
      })
    }

    // Focus first element if enabled
    if (initialFocus) {
      const focusableElements = getFocusableElements()
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }

    // Handle tab key press
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement as HTMLElement

      if (e.shiftKey) {
        // Shift + Tab: move focus backwards
        if (activeElement === firstElement || !container.contains(activeElement)) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: move focus forwards
        if (activeElement === lastElement || !container.contains(activeElement)) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleTab)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleTab)

      // Return focus to previously focused element
      if (returnFocus && previouslyFocusedElement.current) {
        // Small delay to avoid conflicts
        setTimeout(() => {
          previouslyFocusedElement.current?.focus()
        }, 0)
      }
    }
  }, [isActive, containerRef, initialFocus, returnFocus, focusableSelector])
}

export default useFocusTrap
