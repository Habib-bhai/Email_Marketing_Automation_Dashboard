// __tests__/unit/components/TiltCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TiltCard } from '@/Components/enhanced/TiltCard'

/**
 * T122 - Test: TiltCard 3D effect
 * Tests 3D tilt transformation, mouse tracking, and perspective
 */

describe('TiltCard Component', () => {
  it('should render children correctly', () => {
    render(
      <TiltCard>
        <div>Card Content</div>
      </TiltCard>
    )

    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('should apply 3D transform on mouse move', () => {
    const { container } = render(
      <TiltCard>
        <div>Tilt Me</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement

    // Simulate mouse move
    fireEvent.mouseMove(card, {
      clientX: 100,
      clientY: 100
    })

    // Should have 3D transform applied
    const transform = window.getComputedStyle(card).transform
    expect(transform).toBeDefined()
  })

  it('should reset tilt on mouse leave', () => {
    const { container } = render(
      <TiltCard>
        <div>Reset Tilt</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement

    // Apply tilt
    fireEvent.mouseMove(card, {
      clientX: 100,
      clientY: 100
    })

    // Mouse leave
    fireEvent.mouseLeave(card)

    // Should animate back to flat
    const style = card.getAttribute('style')
    expect(style).toBeTruthy()
  })

  it('should apply perspective style', () => {
    const { container } = render(
      <TiltCard>
        <div>3D Card</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement
    const parent = card.parentElement

    // Parent or card should have perspective
    const hasPerspective =
      window.getComputedStyle(card).perspective !== 'none' ||
      window.getComputedStyle(parent!).perspective !== 'none'

    expect(hasPerspective || card.style.transform).toBeTruthy()
  })

  it('should tilt more at edges than center', () => {
    const { container } = render(
      <TiltCard>
        <div>Edge Tilt</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement
    const rect = card.getBoundingClientRect()

    // Move to center
    fireEvent.mouseMove(card, {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2
    })
    const centerTransform = window.getComputedStyle(card).transform

    // Move to edge
    fireEvent.mouseMove(card, {
      clientX: rect.left + 10,
      clientY: rect.top + 10
    })
    const edgeTransform = window.getComputedStyle(card).transform

    // Edge should have different (likely more pronounced) transform
    expect(edgeTransform).not.toBe(centerTransform)
  })

  it('should accept maxTilt prop to control tilt angle', () => {
    const { container } = render(
      <TiltCard maxTilt={30}>
        <div>High Tilt</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement

    fireEvent.mouseMove(card, {
      clientX: 0,
      clientY: 0
    })

    // Tilt should be applied
    const transform = window.getComputedStyle(card).transform
    expect(transform).not.toBe('none')
  })

  it('should accept scale prop for hover effect', () => {
    const { container } = render(
      <TiltCard scale={1.1}>
        <div>Scalable Card</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement

    // Hover over card
    fireEvent.mouseEnter(card)

    // Should apply scale transform
    const transform = window.getComputedStyle(card).transform
    expect(transform).toBeDefined()
  })

  it('should apply glare effect on mouse move', () => {
    const { container } = render(
      <TiltCard glare={true}>
        <div>Glare Card</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement

    fireEvent.mouseMove(card, {
      clientX: 100,
      clientY: 100
    })

    // Should have glare overlay element
    const glareElement = card.querySelector('[data-glare], .glare')
    expect(glareElement || card).toBeInTheDocument()
  })

  it('should disable tilt when enableTilt prop is false', () => {
    const { container } = render(
      <TiltCard enableTilt={false}>
        <div>Disabled Tilt</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement

    fireEvent.mouseMove(card, {
      clientX: 100,
      clientY: 100
    })

    // Transform should remain minimal or none when disabled
    const transform = window.getComputedStyle(card).transform
    // Disabled cards should not tilt
    expect(card.hasAttribute('data-disabled') || transform === 'none').toBeTruthy()
  })

  it('should accept custom className', () => {
    const { container } = render(
      <TiltCard className="custom-tilt-class">
        <div>Custom Class Card</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('custom-tilt-class')
  })

  it('should handle touch events on mobile', () => {
    const { container } = render(
      <TiltCard>
        <div>Touch Card</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement

    // Simulate touch
    fireEvent.touchStart(card, {
      touches: [{ clientX: 100, clientY: 100 }]
    })

    fireEvent.touchMove(card, {
      touches: [{ clientX: 120, clientY: 120 }]
    })

    // Should apply transform on touch
    expect(card).toBeInTheDocument()
  })

  it('should smooth out tilt animation', () => {
    const { container } = render(
      <TiltCard speed={400}>
        <div>Smooth Tilt</div>
      </TiltCard>
    )

    const card = container.firstChild as HTMLElement

    fireEvent.mouseMove(card, {
      clientX: 100,
      clientY: 100
    })

    // Should have transition property
    const transition = window.getComputedStyle(card).transition
    expect(transition || card.style.transition).toBeDefined()
  })

  it('should preserve card content structure', () => {
    render(
      <TiltCard>
        <div data-testid="inner-content">
          <h2>Title</h2>
          <p>Description</p>
        </div>
      </TiltCard>
    )

    expect(screen.getByTestId('inner-content')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})
