'use client'

import Image, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export interface OptimizedImageProps extends Omit<NextImageProps, 'placeholder'> {
  /**
   * Fallback src for error states
   */
  fallbackSrc?: string
  /**
   * Whether to show blur placeholder during loading
   * @default true
   */
  showBlurPlaceholder?: boolean
  /**
   * Custom blur data URL (generated with tools like blurhash or plaiceholder)
   */
  blurDataURL?: string
  /**
   * Container aspect ratio to prevent layout shift
   * @default 'auto'
   * @example '16/9', '4/3', '1/1'
   */
  aspectRatio?: string
  /**
   * Additional wrapper class names
   */
  wrapperClassName?: string
  /**
   * Rounded corners
   * @default false
   */
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full'
  /**
   * Border style
   */
  border?: boolean | string
}

/**
 * OptimizedImage component with Next.js Image optimization, WebP support,
 * lazy loading, blur placeholder, and error handling.
 * 
 * Features:
 * - Automatic WebP/AVIF conversion (Next.js)
 * - Responsive srcset generation (Next.js)
 * - Lazy loading with blur placeholder
 * - Error fallback handling
 * - Aspect ratio preservation to prevent layout shift
 * - Accessibility (alt text required)
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={600}
 *   aspectRatio="16/9"
 *   priority // Above fold
 * />
 * 
 * <OptimizedImage
 *   src="/images/testimonial.jpg"
 *   alt="John Doe"
 *   width={100}
 *   height={100}
 *   rounded="full"
 *   border
 * />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  showBlurPlaceholder = true,
  blurDataURL,
  aspectRatio = 'auto',
  wrapperClassName,
  rounded = false,
  border = false,
  className,
  onError,
  ...props
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true)
    setIsLoading(false)
    onError?.(e)
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false)
    props.onLoad?.(e)
  }

  // Determine rounding class
  const roundedClass = rounded
    ? typeof rounded === 'string'
      ? `rounded-${rounded}`
      : 'rounded-lg'
    : ''

  // Determine border class
  const borderClass = border
    ? typeof border === 'string'
      ? border
      : 'border-2 border-gray-300 dark:border-gray-700'
    : ''

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        roundedClass,
        wrapperClassName
      )}
      style={{
        aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
      }}
    >
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading && showBlurPlaceholder ? 'opacity-0' : 'opacity-100',
          borderClass,
          className
        )}
        placeholder={showBlurPlaceholder && blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />

      {/* Loading placeholder */}
      {isLoading && showBlurPlaceholder && !blurDataURL && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 animate-pulse',
            roundedClass
          )}
          aria-hidden="true"
        />
      )}

      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800',
            roundedClass
          )}
        >
          <svg
            className="w-1/3 h-1/3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export default OptimizedImage
