// lib/hooks/useIntersectionObserver.ts
'use client'

import { useEffect, useState, RefObject } from 'react'

/**
 * T134 - Hook for intersection observer (scroll reveal animations)
 * Detects when element enters/exits viewport
 */

interface IntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean // Only trigger once (default: true)
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: IntersectionObserverOptions = {}
): {
  isIntersecting: boolean
  entry: IntersectionObserverEntry | null
} {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true
  } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        setEntry(entry)

        // If triggerOnce is true, disconnect after first intersection
        if (entry.isIntersecting && triggerOnce) {
          observer.disconnect()
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, threshold, root, rootMargin, triggerOnce])

  return { isIntersecting, entry }
}

/**
 * Hook for multiple elements intersection
 */
export function useMultipleIntersectionObserver(
  elementsRef: RefObject<Element>[],
  options: IntersectionObserverOptions = {}
): Map<Element, boolean> {
  const [intersectingElements, setIntersectingElements] = useState<Map<Element, boolean>>(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIntersectingElements(prev => {
          const newMap = new Map(prev)
          entries.forEach(entry => {
            newMap.set(entry.target, entry.isIntersecting)
          })
          return newMap
        })
      },
      {
        threshold: options.threshold || 0.1,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px'
      }
    )

    elementsRef.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [elementsRef, options])

  return intersectingElements
}

/**
 * Hook for intersection with callback
 */
export function useIntersectionCallback(
  elementRef: RefObject<Element>,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverOptions = {}
): void {
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        callback(entry)

        if (entry.isIntersecting && options.triggerOnce) {
          observer.disconnect()
        }
      },
      {
        threshold: options.threshold || 0.1,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px'
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, callback, options])
}
