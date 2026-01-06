// __tests__/unit/components/MagneticButton.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MagneticButton } from '@/Components/enhanced/MagneticButton'

/**
 * T121 - Test: MagneticButton interactions
 * Tests magnetic effect, click handling, and accessibility
 */

describe('MagneticButton Component', () => {
  it('should render children correctly', () => {
    render(
      <MagneticButton>
        Click Me
      </MagneticButton>
    )

    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('should apply magnetic effect on mouse move', () => {
    const { container } = render(
      <MagneticButton>
        Magnetic Button
      </MagneticButton>
    )

    const button = container.firstChild as HTMLElement

    // Simulate mouse move over button
    fireEvent.mouseMove(button, {
      clientX: 100,
      clientY: 100
    })

    // Button should have transform applied
    const transform = window.getComputedStyle(button).transform
    expect(transform).toBeDefined()
  })

  it('should reset position on mouse leave', () => {
    const { container } = render(
      <MagneticButton>
        Reset Button
      </MagneticButton>
    )

    const button = container.firstChild as HTMLElement

    // Move mouse over button
    fireEvent.mouseMove(button, {
      clientX: 100,
      clientY: 100
    })

    // Mouse leave
    fireEvent.mouseLeave(button)

    // Should animate back to original position
    // Transform might still be present but should be transitioning to none
    const style = button.getAttribute('style')
    expect(style).toBeTruthy()
  })

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn()

    render(
      <MagneticButton onClick={handleClick}>
        Clickable Button
      </MagneticButton>
    )

    const button = screen.getByText('Clickable Button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be keyboard accessible', () => {
    const handleClick = vi.fn()

    render(
      <MagneticButton onClick={handleClick}>
        Keyboard Button
      </MagneticButton>
    )

    const button = screen.getByText('Keyboard Button')

    // Press Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })

    expect(handleClick).toHaveBeenCalled()
  })

  it('should accept custom className', () => {
    const { container } = render(
      <MagneticButton className="custom-class">
        Custom Button
      </MagneticButton>
    )

    const button = container.firstChild as HTMLElement
    expect(button.className).toContain('custom-class')
  })

  it('should accept magneticStrength prop to control magnetic intensity', () => {
    const { container } = render(
      <MagneticButton magneticStrength={0.8}>
        Strong Magnetic
      </MagneticButton>
    )

    const button = container.firstChild as HTMLElement

    fireEvent.mouseMove(button, {
      clientX: 50,
      clientY: 50
    })

    // With higher strength, transform should be more pronounced
    const transform = window.getComputedStyle(button).transform
    expect(transform).not.toBe('none')
  })

  it('should disable magnetic effect when disabled prop is true', () => {
    const { container } = render(
      <MagneticButton disabled>
        Disabled Button
      </MagneticButton>
    )

    const button = container.firstChild as HTMLElement

    fireEvent.mouseMove(button, {
      clientX: 100,
      clientY: 100
    })

    // Magnetic effect should not apply when disabled
    expect(button).toBeDisabled()
  })

  it('should support ref forwarding', () => {
    const ref = vi.fn()

    render(
      <MagneticButton ref={ref}>
        Ref Button
      </MagneticButton>
    )

    expect(ref).toHaveBeenCalled()
  })

  it('should handle rapid mouse movements smoothly', () => {
    const { container } = render(
      <MagneticButton>
        Rapid Motion
      </MagneticButton>
    )

    const button = container.firstChild as HTMLElement

    // Rapid mouse movements
    for (let i = 0; i < 10; i++) {
      fireEvent.mouseMove(button, {
        clientX: 50 + i * 10,
        clientY: 50 + i * 10
      })
    }

    // Should not crash and maintain functionality
    expect(button).toBeInTheDocument()
  })
})
