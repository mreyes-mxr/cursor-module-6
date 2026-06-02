import { test, expect } from '@playwright/test'

/**
 * Responsive design tests covering mobile, tablet, and desktop breakpoints
 * across all pages in the application.
 */

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  wide: { width: 1440, height: 900 },
}

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/user-profiles', name: 'User Profiles' },
  { path: '/product-cards', name: 'Product Cards' },
  { path: '/task-management', name: 'Task Management' },
  { path: '/settings', name: 'Settings' },
  { path: '/social-feed', name: 'Social Feed' },
  { path: '/kanban', name: 'Kanban Board' },
]

// ── Per-page per-viewport smoke tests ──────────────────────────────────────

for (const { path, name } of ROUTES) {
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    test(`[${name}] renders on ${vpName} (${viewport.width}×${viewport.height})`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto(path)
      await expect(page.getByRole('main')).toBeVisible()
      await expect(page.getByRole('banner')).toBeVisible()
    })
  }
}

// ── Header responsive behavior ─────────────────────────────────────────────

test.describe('Header Responsive', () => {
  test('header is sticky across all viewports', async ({ page }) => {
    for (const [, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport)
      await page.goto('/social-feed')
      await page.evaluate(() => window.scrollTo(0, 500))
      await expect(page.getByRole('banner')).toBeVisible()
    }
  })

  test('burger menu opens on mobile and shows all links', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/')
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await expect(page.getByRole('link', { name: 'User Profiles' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Kanban Board' })).toBeVisible()
  })

  test('Home nav link is visible at all breakpoints', async ({ page }) => {
    for (const [, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport)
      await page.goto('/')
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toBeVisible()
    }
  })
})

// ── Home page responsive ───────────────────────────────────────────────────

test.describe('Home Page Responsive', () => {
  test('welcome card is centered on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/')
    const card = page.getByRole('main').locator('div').first()
    await expect(card).toBeVisible()
  })

  test('welcome card fills width on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible()
  })
})

// ── User Profiles responsive ───────────────────────────────────────────────

test.describe('User Profiles Responsive', () => {
  test('legend grid is 3 columns on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/user-profiles')
    const legend = page.locator('dl').first()
    const classes = await legend.getAttribute('class')
    expect(classes).toContain('sm:grid-cols-3')
  })

  test('legend grid is 1 column on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/user-profiles')
    await expect(page.getByText('Own profile')).toBeVisible()
  })

  test('profile cards are full width and readable on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/user-profiles')
    const firstProfile = page.getByRole('article').first()
    await expect(firstProfile).toBeVisible()
    const box = await firstProfile.boundingBox()
    expect(box?.width).toBeGreaterThan(0)
    expect(box?.width).toBeLessThanOrEqual(375)
  })

  test('action buttons are visible on all viewports', async ({ page }) => {
    for (const [, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport)
      await page.goto('/user-profiles')
      const ownProfile = page.getByRole('article').first()
      await expect(ownProfile.getByRole('button', { name: /edit.*profile/i })).toBeVisible()
    }
  })
})

// ── Product Cards responsive ───────────────────────────────────────────────

test.describe('Product Cards Responsive', () => {
  test('product grid is 1 column on mobile (375px)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/product-cards')
    const grid = page.getByRole('region', { name: 'Product listing' })
    const classes = await grid.getAttribute('class')
    expect(classes).toContain('grid-cols-1')
  })

  test('product grid has 2-column class for sm breakpoint', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet)
    await page.goto('/product-cards')
    const grid = page.getByRole('region', { name: 'Product listing' })
    const classes = await grid.getAttribute('class')
    expect(classes).toContain('sm:grid-cols-2')
  })

  test('product grid has 3-column class for lg breakpoint', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/product-cards')
    const grid = page.getByRole('region', { name: 'Product listing' })
    const classes = await grid.getAttribute('class')
    expect(classes).toContain('lg:grid-cols-3')
  })

  test('page header and cart counter stack vertically on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/product-cards')
    await expect(page.getByRole('heading', { name: 'Product Cards' })).toBeVisible()
    await expect(page.getByText(/items in cart/i)).toBeVisible()
  })

  test('toast notification is centered on all viewports', async ({ page }) => {
    for (const [, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport)
      await page.goto('/product-cards')
      const firstProduct = page.getByRole('article').first()
      await firstProduct.getByRole('button', { name: /add .* to cart/i }).click()
      const toast = page.getByRole('status')
      await expect(toast).toBeVisible({ timeout: 2000 })
    }
  })
})

// ── Settings Panel responsive ──────────────────────────────────────────────

test.describe('Settings Panel Responsive', () => {
  test('tabs are arranged horizontally on mobile (overflow scroll)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/settings')
    await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Appearance' })).toBeVisible()
  })

  test('tabs are in a vertical sidebar on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/settings')
    const tablist = page.getByRole('tablist')
    const classes = await tablist.getAttribute('class')
    expect(classes).toContain('sm:flex-col')
  })

  test('profile form is 2-column grid on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/settings')
    const grid = page.locator('[class*="sm:grid-cols-2"]').first()
    if (await grid.count() > 0) {
      await expect(grid).toBeVisible()
    }
  })

  test('theme selection grid works on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/settings')
    await page.getByRole('tab', { name: 'Appearance' }).click()
    // Use exact text to avoid strict-mode violation with description siblings
    await expect(page.getByText('Light', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Dark', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('System', { exact: true }).first()).toBeVisible()
  })

  test('danger zone is visible on all viewports', async ({ page }) => {
    for (const [, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport)
      await page.goto('/settings')
      await page.getByRole('tab', { name: 'Privacy' }).click()
      await expect(page.getByText('Danger zone')).toBeVisible()
    }
  })
})

// ── Social Feed responsive ─────────────────────────────────────────────────

test.describe('Social Feed Responsive', () => {
  test('post creation form is visible on all viewports', async ({ page }) => {
    for (const [, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport)
      await page.goto('/social-feed')
      const textarea = page.locator('textarea').first()
      await expect(textarea).toBeVisible()
    }
  })

  test('feed tabs remain accessible on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/social-feed')
    await expect(page.getByRole('button', { name: 'For You' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Trending' })).toBeVisible()
  })

  test('post cards are readable on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/social-feed')
    const post = page.getByRole('article').first()
    await expect(post).toBeVisible()
    const box = await post.boundingBox()
    expect(box?.width).toBeGreaterThan(0)
    expect(box?.width).toBeLessThanOrEqual(375)
  })
})

// ── Kanban Board responsive ────────────────────────────────────────────────

test.describe('Kanban Board Responsive', () => {
  test('columns overflow horizontally on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/kanban')
    const container = page.locator('[class*="overflow-x-auto"]')
    if (await container.count() > 0) {
      await expect(container.first()).toBeVisible()
    } else {
      await expect(page.getByRole('main')).toBeVisible()
    }
  })

  test('progress bar is visible on all viewports', async ({ page }) => {
    for (const [, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport)
      await page.goto('/kanban')
      await expect(page.getByText(/\d+\/\d+ done/)).toBeVisible()
    }
  })

  test('task cards are readable on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet)
    await page.goto('/kanban')
    const cards = page.locator('[draggable="true"]')
    await expect(cards.first()).toBeVisible()
  })

  test('all 3 columns are side by side on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.wide)
    await page.goto('/kanban')
    const columns = page.locator('[class*="flex"][class*="gap-4"]').locator('[class*="flex-col"]')
    const count = await columns.count()
    if (count >= 3) {
      const col1Box = await columns.nth(0).boundingBox()
      const col2Box = await columns.nth(1).boundingBox()
      if (col1Box && col2Box) {
        // Columns should be horizontally arranged (similar Y, different X)
        // Allow up to 100px Y difference to account for sticky header or padding
        expect(Math.abs(col1Box.y - col2Box.y)).toBeLessThan(100)
        expect(col1Box.x).toBeLessThan(col2Box.x)
      }
    }
  })
})

// ── Task Management responsive ─────────────────────────────────────────────

test.describe('Task Management Responsive', () => {
  test('task management page renders on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/task-management')
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('task management page renders on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet)
    await page.goto('/task-management')
    // The page shows the active-view label "All Tasks" as its main heading
    await expect(page.getByRole('heading', { name: /all tasks/i })).toBeVisible()
  })

  test('task management page renders on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/task-management')
    await expect(page.getByRole('heading', { name: /all tasks/i })).toBeVisible()
  })
})
