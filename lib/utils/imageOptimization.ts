/**
 * Image optimization utilities for blur placeholders and responsive srcsets
 */

/**
 * Generate a simple base64 blur placeholder from a color
 * For production, consider using:
 * - plaiceholder: https://plaiceholder.co/
 * - sharp: https://sharp.pixelplumbing.com/
 * - blurhash: https://blurha.sh/
 * 
 * @param color - Hex color (e.g., '#3B82F6')
 * @returns Base64 data URL for blur placeholder
 */
export function generateBlurPlaceholder(color: string = '#3B82F6'): string {
  // Convert hex to RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Create a tiny 10x10 SVG with the color
  const svg = `
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10" fill="rgb(${r},${g},${b})" />
    </svg>
  `

  // Convert to base64
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Generate blur placeholder with gradient
 * 
 * @param color1 - First gradient color
 * @param color2 - Second gradient color
 * @returns Base64 data URL for gradient blur placeholder
 */
export function generateGradientPlaceholder(
  color1: string = '#3B82F6',
  color2: string = '#8B5CF6'
): string {
  const svg = `
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="10" height="10" fill="url(#grad)" />
    </svg>
  `

  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Common blur placeholders for different image types
 */
export const BLUR_PLACEHOLDERS = {
  /** Primary brand color blur */
  primary: generateBlurPlaceholder('#3B82F6'),
  
  /** Secondary brand color blur */
  secondary: generateBlurPlaceholder('#8B5CF6'),
  
  /** Gray neutral blur */
  neutral: generateBlurPlaceholder('#6B7280'),
  
  /** Blue to purple gradient */
  gradient: generateGradientPlaceholder('#3B82F6', '#8B5CF6'),
  
  /** Warm gradient */
  warm: generateGradientPlaceholder('#F59E0B', '#EF4444'),
  
  /** Cool gradient */
  cool: generateGradientPlaceholder('#06B6D4', '#3B82F6'),
} as const

/**
 * Calculate responsive srcset for images
 * 
 * @param src - Base image source
 * @param widths - Array of widths for srcset
 * @returns srcset string
 * 
 * @example
 * ```ts
 * const srcset = generateSrcSet('/image.jpg', [640, 1280, 1920])
 * // Returns: '/image.jpg?w=640 640w, /image.jpg?w=1280 1280w, /image.jpg?w=1920 1920w'
 * ```
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [640, 1280, 1920, 2560]
): string {
  return widths
    .map((width) => {
      const separator = src.includes('?') ? '&' : '?'
      return `${src}${separator}w=${width} ${width}w`
    })
    .join(', ')
}

/**
 * Calculate sizes attribute for responsive images
 * 
 * @param breakpoints - Object mapping breakpoints to image widths
 * @returns sizes string
 * 
 * @example
 * ```ts
 * const sizes = generateSizes({
 *   sm: '100vw',
 *   md: '50vw',
 *   lg: '33vw',
 *   xl: '25vw'
 * })
 * // Returns: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
 * ```
 */
export function generateSizes(breakpoints: {
  sm?: string
  md?: string
  lg?: string
  xl?: string
  '2xl'?: string
}): string {
  const mediaQueries: string[] = []
  
  if (breakpoints.sm) mediaQueries.push(`(max-width: 640px) ${breakpoints.sm}`)
  if (breakpoints.md) mediaQueries.push(`(max-width: 768px) ${breakpoints.md}`)
  if (breakpoints.lg) mediaQueries.push(`(max-width: 1024px) ${breakpoints.lg}`)
  if (breakpoints.xl) mediaQueries.push(`(max-width: 1280px) ${breakpoints.xl}`)
  if (breakpoints['2xl']) return [...mediaQueries, breakpoints['2xl']].join(', ')
  
  // Fallback to last defined size
  const lastSize = breakpoints.xl || breakpoints.lg || breakpoints.md || breakpoints.sm || '100vw'
  return [...mediaQueries, lastSize].join(', ')
}

/**
 * Check if image is external URL
 * 
 * @param src - Image source
 * @returns true if external URL
 */
export function isExternalImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://')
}

/**
 * Get optimized image loader for different CDNs
 * 
 * @param provider - CDN provider ('cloudinary', 'imgix', 'custom')
 * @returns Next.js image loader function
 */
export function getImageLoader(provider: 'cloudinary' | 'imgix' | 'custom' = 'custom') {
  return ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    switch (provider) {
      case 'cloudinary':
        return `https://res.cloudinary.com/your-cloud/image/upload/w_${width},q_${quality || 75}/${src}`
      
      case 'imgix':
        return `${src}?w=${width}&q=${quality || 75}&auto=format,compress`
      
      case 'custom':
      default:
        // Use Next.js built-in optimization
        const params = new URLSearchParams()
        params.set('w', width.toString())
        if (quality) params.set('q', quality.toString())
        return `${src}?${params.toString()}`
    }
  }
}
