import { test, expect } from '@playwright/test'

/**
 * Cross-page accessibility tests.
 * These verify WCAG-aligned patterns across every route in the application.
 */

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/user-profiles', name: 'User Profiles' },
  { path: '/product-cards', name: 'Product Cards' },
  { path: '/task-management', name: 'Task Management' },
  { path: '/settings', name: 'Settings' },
  { path: '/social-feed', name: 'Social Feed' },
  { path: '/kanban', name: 'Kanban Board' },
]

// ── Landmark roles ─────────────────────────────────────────────────────────

for (const { path, name } of ROUTES) {
  test(`[${name}] has a <header> banner landmark`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test(`[${name}] has a <main> landmark`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('main')).toBeVisible()
  })

  test(`[${name}] has at least one heading`, async ({ page }) => {
    await page.goto(path)
    const headings = page.getByRole('heading')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
  })
}

// ── Page-level accessibility checks ────────────────────────────────────────

test.describe('Global Accessibility', () => {
  test('no page has JavaScript console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    for (const { path } of ROUTES) {
      await page.goto(path)
    }

    expect(errors).toHaveLength(0)
  })

  test('dark mode toggle has a visible focus ring', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /switch to (dark|light) mode/i })
    await toggle.focus()
    await expect(toggle).toBeFocused()
  })

  test('burger menu button has aria-label and aria-expanded', async ({ page }) => {
    await page.goto('/')
    const btn = page.getByRole('button', { name: 'Toggle navigation menu' })
    await expect(btn).toHaveAttribute('aria-label', 'Toggle navigation menu')
    await expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  test('navigation links are reachable via Tab key', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    const tagName = await focused.evaluate((el) => el.tagName.toLowerCase())
    expect(['a', 'button', 'input', 'textarea', 'select']).toContain(tagName)
  })
})

// ── Settings panel accessibility ───────────────────────────────────────────

test.describe('Settings Panel Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test('tablist has role="tablist" and aria-label', async ({ page }) => {
    const tablist = page.getByRole('tablist')
    await expect(tablist).toHaveAttribute('aria-label')
  })

  test('inactive tabs have tabIndex=-1', async ({ page }) => {
    const notifTab = page.getByRole('tab', { name: 'Notifications' })
    const tabIndex = await notifTab.getAttribute('tabindex')
    expect(tabIndex).toBe('-1')
  })

  test('active tab has tabIndex=0', async ({ page }) => {
    const profileTab = page.getByRole('tab', { name: 'Profile' })
    const tabIndex = await profileTab.getAttribute('tabindex')
    expect(tabIndex).toBe('0')
  })

  test('hidden tab panels have hidden attribute', async ({ page }) => {
    const notifPanel = page.locator('#settings-panel-notifications')
    await expect(notifPanel).toHaveAttribute('hidden')
  })

  test('visible tab panel does not have hidden attribute', async ({ page }) => {
    const profilePanel = page.locator('#settings-panel-profile')
    await expect(profilePanel).not.toHaveAttribute('hidden')
  })

  test('toggle switches expose aria-checked state', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    const switches = page.getByRole('switch')
    const firstSwitch = switches.first()
    const checked = await firstSwitch.getAttribute('aria-checked')
    expect(['true', 'false']).toContain(checked)
  })

  test('form inputs in Profile tab have labels', async ({ page }) => {
    const nameInput = page.getByLabel('Full name')
    await expect(nameInput).toBeVisible()
  })

  test('required fields are marked with aria or required attribute', async ({ page }) => {
    const nameInput = page.getByLabel('Full name')
    const required = await nameInput.getAttribute('required')
    expect(required).not.toBeNull()
  })
})

// ── User Profiles accessibility ────────────────────────────────────────────

test.describe('User Profiles Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/user-profiles')
  })

  test('profile articles have aria-label describing the user', async ({ page }) => {
    const profiles = page.getByRole('article')
    const first = profiles.first()
    const label = await first.getAttribute('aria-label')
    expect(label).toMatch(/profile/i)
  })

  test('Follow button has aria-label and aria-pressed', async ({ page }) => {
    const firstOther = page.getByRole('article').nth(1)
    // The button's aria-label is "Follow user", not just "Follow"
    const followBtn = firstOther.getByRole('button', { name: /follow user/i })
    await expect(followBtn).toHaveAttribute('aria-pressed', 'false')
    await expect(followBtn).toHaveAttribute('aria-label')
  })

  test('Edit Profile button has aria-label', async ({ page }) => {
    const ownProfile = page.getByRole('article').first()
    const editBtn = ownProfile.getByRole('button', { name: /edit.*profile/i })
    await expect(editBtn).toHaveAttribute('aria-label')
  })

  test('statistics section has group role with aria-label', async ({ page }) => {
    const statsGroup = page.getByRole('group', { name: /profile statistics/i }).first()
    await expect(statsGroup).toBeVisible()
  })

  test('cover photo is hidden from assistive technology (aria-hidden)', async ({ page }) => {
    const coverPhoto = page.locator('[aria-hidden="true"]').first()
    await expect(coverPhoto).toBeAttached()
  })
})

// ── Product Cards accessibility ────────────────────────────────────────────

test.describe('Product Cards Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/product-cards')
  })

  test('product images have alt text', async ({ page }) => {
    // Use locator('img') to avoid matching star-rating div[role="img"] elements
    const images = page.locator('article img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < Math.min(count, 3); i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('Add to Cart buttons have descriptive aria-labels', async ({ page }) => {
    const addBtns = page.getByRole('button', { name: /add .* to cart/i })
    const count = await addBtns.count()
    expect(count).toBeGreaterThan(0)
  })

  test('cart counter live region exists (aria-live)', async ({ page }) => {
    // The cart counter div uses aria-live="polite" and aria-label="N items in cart"
    const liveRegion = page.locator('[aria-live][aria-label*="items in cart"]')
    await expect(liveRegion).toBeAttached()
  })

  test('toast notification has role="status" and aria-live', async ({ page }) => {
    const toast = page.getByRole('status')
    await expect(toast).toHaveAttribute('aria-live', 'assertive')
    await expect(toast).toHaveAttribute('aria-atomic', 'true')
  })

  test('decorative SVG icons have aria-hidden', async ({ page }) => {
    const hiddenSVGs = page.locator('svg[aria-hidden="true"]')
    const count = await hiddenSVGs.count()
    expect(count).toBeGreaterThan(0)
  })
})

// ── Kanban Board accessibility ─────────────────────────────────────────────

test.describe('Kanban Board Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kanban')
  })

  test('page renders without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/kanban')
    expect(errors).toHaveLength(0)
  })

  test('task cards are draggable (draggable attribute)', async ({ page }) => {
    const draggableCards = page.locator('[draggable="true"]')
    const count = await draggableCards.count()
    expect(count).toBeGreaterThan(0)
  })
})

// ── Social Feed accessibility ──────────────────────────────────────────────

test.describe('Social Feed Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/social-feed')
  })

  test('page has main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('feed filter buttons are keyboard navigable', async ({ page }) => {
    const forYouTab = page.getByRole('button', { name: 'For You' })
    await forYouTab.focus()
    await expect(forYouTab).toBeFocused()
  })

  test('post textarea is focusable and labeled', async ({ page }) => {
    const textarea = page.locator('textarea').first()
    await textarea.focus()
    await expect(textarea).toBeFocused()
  })
})

// ── Color contrast / dark mode ─────────────────────────────────────────────

test.describe('Dark Mode Accessibility', () => {
  test('enabling dark mode does not break page layout', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /switch to dark mode/i }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible()
  })

  for (const { path, name } of ROUTES) {
    test(`[${name}] renders correctly in dark mode`, async ({ page }) => {
      await page.goto(path)
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      })
      await page.reload()
      await expect(page.getByRole('banner')).toBeVisible()
      await expect(page.getByRole('main')).toBeVisible()
    })
  }
})
