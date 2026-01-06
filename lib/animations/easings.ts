// lib/animations/easings.ts

/**
 * T126 - Easing functions for smooth animations
 * Custom easing curves for advanced motion design
 */

/**
 * Easing out with exponential curve
 * Creates a fast start that smoothly decelerates
 */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/**
 * Easing in and out with back overshoot
 * Creates anticipation and overshoot for playful animations
 */
export function easeInOutBack(t: number, overshoot = 1.70158): number {
  const c2 = overshoot * 1.525

  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
}

/**
 * Easing out with elastic bounce
 * Creates a spring-like elastic effect at the end
 */
export function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3

  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
}

/**
 * Easing in with exponential curve
 */
export function easeInExpo(t: number): number {
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10)
}

/**
 * Easing in and out with exponential curve
 */
export function easeInOutExpo(t: number): number {
  return t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2
}

/**
 * Easing out with back overshoot
 */
export function easeOutBack(t: number, overshoot = 1.70158): number {
  const c1 = overshoot + 1
  const c3 = overshoot

  return 1 + c1 * Math.pow(t - 1, 3) + c3 * Math.pow(t - 1, 2)
}

/**
 * Easing in with back anticipation
 */
export function easeInBack(t: number, overshoot = 1.70158): number {
  const c1 = overshoot + 1
  const c3 = overshoot

  return c1 * t * t * t - c3 * t * t
}

/**
 * Easing out with bounce effect
 */
export function easeOutBounce(t: number): number {
  const n1 = 7.5625
  const d1 = 2.75

  if (t < 1 / d1) {
    return n1 * t * t
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375
  }
}

/**
 * Easing in with bounce anticipation
 */
export function easeInBounce(t: number): number {
  return 1 - easeOutBounce(1 - t)
}

/**
 * Cubic bezier easing
 */
export function cubicBezier(t: number, p1x: number, p1y: number, p2x: number, p2y: number): number {
  // Simplified cubic bezier calculation
  const cx = 3 * p1x
  const bx = 3 * (p2x - p1x) - cx
  const ax = 1 - cx - bx

  const cy = 3 * p1y
  const by = 3 * (p2y - p1y) - cy
  const ay = 1 - cy - by

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t

  return sampleCurveY(t)
}

/**
 * Linear easing (no acceleration)
 */
export function linear(t: number): number {
  return t
}

/**
 * Ease in quad
 */
export function easeInQuad(t: number): number {
  return t * t
}

/**
 * Ease out quad
 */
export function easeOutQuad(t: number): number {
  return t * (2 - t)
}

/**
 * Ease in out quad
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/**
 * Ease in cubic
 */
export function easeInCubic(t: number): number {
  return t * t * t
}

/**
 * Ease out cubic
 */
export function easeOutCubic(t: number): number {
  return --t * t * t + 1
}

/**
 * Ease in out cubic
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}

/**
 * Get easing function by name
 */
export function getEasing(name: string): (t: number) => number {
  const easings: Record<string, (t: number) => number> = {
    linear,
    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInExpo,
    easeOutExpo,
    easeInOutExpo,
    easeInBack,
    easeOutBack,
    easeInOutBack,
    easeInBounce,
    easeOutBounce,
    easeOutElastic
  }

  return easings[name] || linear
}
