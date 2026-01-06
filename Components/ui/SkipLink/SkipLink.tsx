'use client'

import { cn } from '@/lib/utils/cn'
import styles from './skipLink.module.css'

export interface SkipLinkProps {
  /**
   * Target element ID to skip to
   * @default 'main-content'
   */
  targetId?: string
  /**
   * Link text
   * @default 'Skip to main content'
   */
  children?: React.ReactNode
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * SkipLink component provides keyboard navigation shortcut to main content.
 * Appears only when focused (tab key), essential for WCAG 2.1 AA compliance.
 * 
 * Features:
 * - Visually hidden until focused
 * - Keyboard accessible (tab to reveal)
 * - High contrast focus indicator
 * - Smooth scroll to target
 * - Screen reader friendly
 * 
 * @example
 * ```tsx
 * // In root layout
 * <body>
 *   <SkipLink />
 *   <Header />
 *   <main id="main-content">{children}</main>
 * </body>
 * ```
 */
export function SkipLink({
  targetId = 'main-content',
  children = 'Skip to main content',
  className,
}: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    const target = document.getElementById(targetId)
    if (target) {
      // Set focus to target
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: false })
      
      // Smooth scroll to target
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      
      // Remove tabindex after focus (cleanup)
      target.addEventListener(
        'blur',
        () => {
          target.removeAttribute('tabindex')
        },
        { once: true }
      )
    }
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(styles.skipLink, className)}
      data-testid="skip-link"
    >
      {children}
    </a>
  )
}

export default SkipLink
