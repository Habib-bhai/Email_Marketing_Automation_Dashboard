// lib/animations/lerp.ts

/**
 * T128 - Linear interpolation (lerp) utility
 * Smoothly interpolates between values for fluid animations
 */

/**
 * Basic linear interpolation between two values
 * @param start - Starting value
 * @param end - Ending value
 * @param t - Progress value between 0 and 1
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t
}

/**
 * Lerp with clamping to ensure result stays between start and end
 */
export function lerpClamped(start: number, end: number, t: number): number {
  const clampedT = Math.max(0, Math.min(1, t))
  return lerp(start, end, clampedT)
}

/**
 * Inverse lerp - find the progress value given start, end, and current value
 */
export function inverseLerp(start: number, end: number, value: number): number {
  return (value - start) / (end - start)
}

/**
 * Smooth lerp using exponential smoothing
 * Lower smoothness = faster interpolation
 */
export function smoothLerp(current: number, target: number, smoothness: number = 0.1): number {
  return current + (target - current) * smoothness
}

/**
 * Lerp between two 2D points
 */
export function lerpPoint(
  start: { x: number; y: number },
  end: { x: number; y: number },
  t: number
): { x: number; y: number } {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t)
  }
}

/**
 * Lerp between two colors (hex format)
 */
export function lerpColor(color1: string, color2: string, t: number): string {
  // Remove # if present
  const c1 = color1.replace('#', '')
  const c2 = color2.replace('#', '')

  // Parse hex to RGB
  const r1 = parseInt(c1.substring(0, 2), 16)
  const g1 = parseInt(c1.substring(2, 4), 16)
  const b1 = parseInt(c1.substring(4, 6), 16)

  const r2 = parseInt(c2.substring(0, 2), 16)
  const g2 = parseInt(c2.substring(2, 4), 16)
  const b2 = parseInt(c2.substring(4, 6), 16)

  // Lerp each channel
  const r = Math.round(lerp(r1, r2, t))
  const g = Math.round(lerp(g1, g2, t))
  const b = Math.round(lerp(b1, b2, t))

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Lerp angle with shortest path (for rotations)
 */
export function lerpAngle(start: number, end: number, t: number): number {
  // Normalize angles to 0-360
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360

  const startNorm = normalizeAngle(start)
  const endNorm = normalizeAngle(end)

  // Calculate shortest distance
  let diff = endNorm - startNorm

  if (diff > 180) {
    diff -= 360
  } else if (diff < -180) {
    diff += 360
  }

  return startNorm + diff * t
}

/**
 * Smooth damp - spring-like interpolation
 * Based on Unity's SmoothDamp
 */
export function smoothDamp(
  current: number,
  target: number,
  currentVelocity: number,
  smoothTime: number,
  deltaTime: number,
  maxSpeed: number = Infinity
): { value: number; velocity: number } {
  smoothTime = Math.max(0.0001, smoothTime)

  const omega = 2 / smoothTime
  const x = omega * deltaTime
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)

  let change = current - target
  const originalTo = target

  // Clamp maximum speed
  const maxChange = maxSpeed * smoothTime
  change = Math.max(-maxChange, Math.min(change, maxChange))
  const temp = (currentVelocity + omega * change) * deltaTime

  let newVelocity = (currentVelocity - omega * temp) * exp
  let newValue = target + (change + temp) * exp

  // Prevent overshooting
  if ((originalTo - current > 0) === (newValue > originalTo)) {
    newValue = originalTo
    newVelocity = (newValue - originalTo) / deltaTime
  }

  return { value: newValue, velocity: newVelocity }
}

/**
 * Eased lerp using custom easing function
 */
export function easedLerp(
  start: number,
  end: number,
  t: number,
  easingFn: (t: number) => number
): number {
  const easedT = easingFn(t)
  return lerp(start, end, easedT)
}

/**
 * Multi-point interpolation (spline)
 */
export function multiLerp(points: number[], t: number): number {
  if (points.length === 0) return 0
  if (points.length === 1) return points[0]

  const scaledT = t * (points.length - 1)
  const index = Math.floor(scaledT)
  const localT = scaledT - index

  if (index >= points.length - 1) {
    return points[points.length - 1]
  }

  return lerp(points[index], points[index + 1], localT)
}

/**
 * Catmull-Rom spline interpolation
 * Smooth curve through all points
 */
export function catmullRom(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number
): number {
  const t2 = t * t
  const t3 = t2 * t

  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  )
}

/**
 * Bezier curve interpolation
 */
export function bezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const oneMinusT = 1 - t
  return (
    oneMinusT * oneMinusT * oneMinusT * p0 +
    3 * oneMinusT * oneMinusT * t * p1 +
    3 * oneMinusT * t * t * p2 +
    t * t * t * p3
  )
}

/**
 * Spring interpolation with overshoot
 */
export function springLerp(
  current: number,
  target: number,
  velocity: number,
  stiffness: number = 170,
  damping: number = 26,
  mass: number = 1,
  deltaTime: number = 1 / 60
): { value: number; velocity: number } {
  const springForce = -stiffness * (current - target)
  const dampingForce = -damping * velocity
  const acceleration = (springForce + dampingForce) / mass

  const newVelocity = velocity + acceleration * deltaTime
  const newValue = current + newVelocity * deltaTime

  return { value: newValue, velocity: newVelocity }
}
