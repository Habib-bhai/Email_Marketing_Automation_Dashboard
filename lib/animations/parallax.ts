// lib/animations/parallax.ts

/**
 * T127 - Parallax calculator for scroll-based animations
 * Calculates parallax offsets based on scroll position
 */

export interface ParallaxOptions {
  speed?: number // Multiplier for parallax effect (default: 0.5)
  direction?: 'up' | 'down' | 'left' | 'right' // Direction of movement
  offset?: number // Initial offset
  limit?: number // Maximum offset limit
}

/**
 * Calculate parallax transform based on scroll position
 */
export function calculateParallax(
  scrollY: number,
  elementY: number,
  options: ParallaxOptions = {}
): { x: number; y: number } {
  const {
    speed = 0.5,
    direction = 'up',
    offset = 0,
    limit
  } = options

  // Calculate relative scroll position
  const relativeScroll = scrollY - elementY + offset

  // Apply speed multiplier
  let distance = relativeScroll * speed

  // Apply limit if specified
  if (limit !== undefined) {
    distance = Math.max(-limit, Math.min(limit, distance))
  }

  // Calculate x and y based on direction
  let x = 0
  let y = 0

  switch (direction) {
    case 'up':
      y = -distance
      break
    case 'down':
      y = distance
      break
    case 'left':
      x = -distance
      break
    case 'right':
      x = distance
      break
  }

  return { x, y }
}

/**
 * Calculate multi-layer parallax with different speeds
 */
export function calculateLayeredParallax(
  scrollY: number,
  layers: Array<{ speed: number; direction?: 'up' | 'down' }>
): Array<{ x: number; y: number }> {
  return layers.map(layer =>
    calculateParallax(scrollY, 0, {
      speed: layer.speed,
      direction: layer.direction || 'up'
    })
  )
}

/**
 * Calculate parallax with easing
 */
export function calculateEasedParallax(
  scrollY: number,
  elementY: number,
  viewportHeight: number,
  easing: (t: number) => number = (t) => t
): number {
  // Calculate progress through viewport (0 to 1)
  const progress = Math.max(0, Math.min(1, (scrollY - elementY + viewportHeight) / (viewportHeight * 2)))

  // Apply easing
  return easing(progress)
}

/**
 * Calculate horizontal parallax for carousel/slider effects
 */
export function calculateHorizontalParallax(
  scrollX: number,
  elementWidth: number,
  containerWidth: number,
  speed: number = 0.5
): number {
  const progress = scrollX / (elementWidth - containerWidth)
  return progress * speed * containerWidth
}

/**
 * Calculate perspective-based parallax (3D effect)
 */
export function calculatePerspectiveParallax(
  scrollY: number,
  elementY: number,
  depth: number = 1
): { translateZ: number; scale: number } {
  const distance = scrollY - elementY
  const translateZ = distance * depth
  const scale = 1 + (translateZ / 1000) // Adjust scale based on Z distance

  return { translateZ, scale }
}

/**
 * Calculate mouse-based parallax for interactive effects
 */
export function calculateMouseParallax(
  mouseX: number,
  mouseY: number,
  elementRect: { width: number; height: number; left: number; top: number },
  strength: number = 20
): { x: number; y: number } {
  // Calculate mouse position relative to element center
  const centerX = elementRect.left + elementRect.width / 2
  const centerY = elementRect.top + elementRect.height / 2

  const deltaX = (mouseX - centerX) / elementRect.width
  const deltaY = (mouseY - centerY) / elementRect.height

  return {
    x: deltaX * strength,
    y: deltaY * strength
  }
}

/**
 * Smooth parallax value with lerp
 */
export function smoothParallax(
  current: number,
  target: number,
  smoothness: number = 0.1
): number {
  return current + (target - current) * smoothness
}

/**
 * Calculate rotation based on scroll
 */
export function calculateRotationParallax(
  scrollY: number,
  elementY: number,
  maxRotation: number = 360
): number {
  const distance = scrollY - elementY
  return (distance / 1000) * maxRotation
}

/**
 * Calculate opacity fade based on scroll
 */
export function calculateOpacityParallax(
  scrollY: number,
  elementY: number,
  fadeStart: number = 0,
  fadeEnd: number = 500
): number {
  const distance = scrollY - elementY
  const progress = (distance - fadeStart) / (fadeEnd - fadeStart)
  return Math.max(0, Math.min(1, 1 - progress))
}

/**
 * Calculate scale parallax effect
 */
export function calculateScaleParallax(
  scrollY: number,
  elementY: number,
  minScale: number = 0.8,
  maxScale: number = 1.2
): number {
  const distance = scrollY - elementY
  const progress = Math.max(0, Math.min(1, distance / 1000))
  return minScale + (maxScale - minScale) * progress
}
