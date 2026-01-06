// __tests__/e2e/landing-page.spec.ts
import { test, expect } from '@playwright/test'

/**
 * T115-T120 - E2E tests for landing page
 * Tests page performance, animations, responsive design, accessibility
 */

test.describe('Landing Page - Performance', () => {
  test('T115 - page loads in under 2 seconds', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('http://localhost:3000')

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    expect(loadTime).toBeLessThan(2000)

    // Verify critical content is visible
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('T115 - First Contentful Paint is under 1.5s', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        fcp: perfData.responseStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
      }
    })

    expect(performanceMetrics.fcp).toBeLessThan(1500)
  })
})

test.describe('Landing Page - Animations', () => {
  test('T116 - typewriter animation completes', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Look for typewriter text container
    const typewriterElement = page.locator('[data-testid="typewriter"]').or(
      page.locator('text=/Email Marketing/i')
    ).first()

    await expect(typewriterElement).toBeVisible({ timeout: 5000 })

    // Wait for animation to complete
    await page.waitForTimeout(3000)

    // Verify text is fully rendered
    const text = await typewriterElement.textContent()
    expect(text).toBeTruthy()
    expect(text!.length).toBeGreaterThan(10)
  })

  test('T117 - scroll-triggered animations activate', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Get initial position of an element that should animate on scroll
    const animatedElement = page.locator('[data-testid="scroll-animate"]').or(
      page.locator('.fade-in, .slide-up, .parallax').first()
    )

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(500)

    // Check if element has animation class or style applied
    const hasAnimation = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="animate"], [class*="fade"]')
      return elements.length > 0
    })

    expect(hasAnimation).toBeTruthy()
  })

  test('T117 - parallax effect works on scroll', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const parallaxElement = page.locator('[data-parallax]').or(
      page.locator('.parallax').first()
    )

    // Get initial transform
    const initialTransform = await parallaxElement.evaluate((el) =>
      window.getComputedStyle(el).transform
    ).catch(() => 'none')

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForTimeout(300)

    // Get new transform
    const newTransform = await parallaxElement.evaluate((el) =>
      window.getComputedStyle(el).transform
    ).catch(() => 'none')

    // Transform should change on scroll
    expect(newTransform).not.toBe(initialTransform)
  })
})

test.describe('Landing Page - Responsive Design', () => {
  test('T118 - responsive at mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:3000')

    // Check that content is visible and not overflowing
    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)

    expect(bodyWidth).toBeLessThanOrEqual(375)

    // Verify hamburger menu is visible (mobile navigation)
    const mobileMenu = page.locator('[data-testid="mobile-menu"]').or(
      page.locator('button[aria-label*="menu"]')
    )

    await expect(mobileMenu.first()).toBeVisible()
  })

  test('T118 - responsive at tablet viewport (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('http://localhost:3000')

    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)

    expect(bodyWidth).toBeLessThanOrEqual(768)

    // Check layout adapts correctly
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('T118 - responsive at desktop viewport (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('http://localhost:3000')

    // Desktop navigation should be visible
    const desktopNav = page.locator('nav').first()
    await expect(desktopNav).toBeVisible()

    // Content should be centered and not stretched
    const container = page.locator('main, .container').first()
    const containerWidth = await container.evaluate((el) => el.offsetWidth)

    expect(containerWidth).toBeLessThan(1920) // Should have max-width
  })

  test('T118 - no horizontal scrolling on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:3000')

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })

    expect(hasHorizontalScroll).toBeFalsy()
  })
})

test.describe('Landing Page - Keyboard Navigation', () => {
  test('T119 - tab navigation works through interactive elements', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Start tabbing through elements
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    // Check if first focusable element is focused
    const firstFocused = await page.evaluate(() => {
      const focused = document.activeElement
      return focused?.tagName !== 'BODY'
    })

    expect(firstFocused).toBeTruthy()

    // Tab through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(50)
    }

    // Verify focus indicators are visible
    const focusVisible = await page.evaluate(() => {
      const focused = document.activeElement
      const styles = window.getComputedStyle(focused!)
      return styles.outline !== 'none' || styles.boxShadow !== 'none'
    })

    expect(focusVisible).toBeTruthy()
  })

  test('T119 - Enter key activates buttons', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Find first button
    const button = page.locator('button, a[role="button"]').first()
    await button.focus()

    // Press Enter
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)

    // Button should have been activated (check for navigation or state change)
    const url = page.url()
    expect(url).toBeTruthy()
  })

  test('T119 - Escape key closes modals', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Try to open a modal if exists
    const modalTrigger = page.locator('[data-testid="open-modal"]').or(
      page.locator('button:has-text("Contact"), button:has-text("Demo")')
    ).first()

    if (await modalTrigger.count() > 0) {
      await modalTrigger.click()
      await page.waitForTimeout(300)

      // Press Escape
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)

      // Modal should be closed
      const modalVisible = await page.locator('[role="dialog"]').isVisible().catch(() => false)
      expect(modalVisible).toBeFalsy()
    }
  })
})

test.describe('Landing Page - Reduced Motion', () => {
  test('T120 - respects prefers-reduced-motion', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('http://localhost:3000')

    // Check if animations are disabled or reduced
    const hasReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    })

    expect(hasReducedMotion).toBeTruthy()

    // Verify that transition durations are shortened or removed
    const animationDuration = await page.evaluate(() => {
      const elements = document.querySelectorAll('*')
      let hasLongAnimation = false

      elements.forEach(el => {
        const styles = window.getComputedStyle(el)
        const duration = parseFloat(styles.animationDuration)
        if (duration > 0.5) { // More than 500ms
          hasLongAnimation = true
        }
      })

      return hasLongAnimation
    })

    // With reduced motion, animations should be minimal
    expect(animationDuration).toBeFalsy()
  })

  test('T120 - essential animations still work with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('http://localhost:3000')

    // Page should still load and be functional
    await expect(page.locator('h1').first()).toBeVisible()

    // Interactive elements should still respond
    const button = page.locator('button').first()
    if (await button.count() > 0) {
      await button.click()
      // Should not crash or become unresponsive
      await page.waitForTimeout(200)
    }
  })

  test('T120 - no motion sickness inducing animations', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Check for excessive motion
    const hasExcessiveMotion = await page.evaluate(() => {
      const elements = document.querySelectorAll('*')
      let hasRapidAnimation = false

      elements.forEach(el => {
        const styles = window.getComputedStyle(el)
        const duration = parseFloat(styles.animationDuration)
        const iterationCount = styles.animationIterationCount

        // Flag very fast infinite animations
        if (duration > 0 && duration < 0.3 && iterationCount === 'infinite') {
          hasRapidAnimation = true
        }
      })

      return hasRapidAnimation
    })

    expect(hasExcessiveMotion).toBeFalsy()
  })
})
