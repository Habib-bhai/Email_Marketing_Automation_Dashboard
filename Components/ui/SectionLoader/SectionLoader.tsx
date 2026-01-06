'use client'

import { cn } from '@/lib/utils'
import styles from './sectionLoader.module.css'

interface SectionLoaderProps {
  /**
   * Minimum height for the skeleton
   * @default '400px'
   */
  minHeight?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to show animated pulse effect
   * @default true
   */
  animated?: boolean
}

/**
 * SectionLoader component displays a skeleton placeholder for lazy-loaded sections.
 * Respects prefers-reduced-motion for accessibility.
 * 
 * @example
 * ```tsx
 * <SectionLoader minHeight="600px" />
 * ```
 */
export function SectionLoader({
  minHeight = '400px',
  className,
  animated = true,
}: SectionLoaderProps) {
  return (
    <div
      className={cn(
        styles.sectionLoader,
        animated && styles.animated,
        className
      )}
      style={{ minHeight }}
      aria-label="Loading section"
      role="status"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSkeleton} />
          <div className={styles.subtitleSkeleton} />
        </div>
        <div className={styles.body}>
          <div className={styles.blockSkeleton} />
          <div className={styles.blockSkeleton} />
          <div className={styles.blockSkeleton} />
        </div>
      </div>
    </div>
  )
}

export default SectionLoader
