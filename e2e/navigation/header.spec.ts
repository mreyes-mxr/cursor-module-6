import { test, expect } from '@playwright/test'

test.describe('Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── Rendering ──────────────────────────────────────────────────────────────

  test('renders the app logo and title', async ({ page }) => {
    const logo = page.getByRole('link', { name: /cursor apps showcase/i })
    await expect(logo).toBeVisible()
  })

  test('renders the Home nav link', async ({ page }) => {
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toBeVisible()
  })

  test('renders the dark mode toggle button', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /switch to (dark|light) mode/i })
    await expect(toggle).toBeVisible()
  })

  test('renders the burger menu button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Toggle navigation menu' })).toBeVisible()
  })

  // ── Logo navigation ────────────────────────────────────────────────────────

  test('clicking the logo navigates to home', async ({ page }) => {
    await page.goto('/product-cards')
    await page.getByRole('link', { name: /cursor apps showcase/i }).click()
    await expect(page).toHaveURL('/')
  })

  // ── Burger menu ────────────────────────────────────────────────────────────

  test('burger menu is closed by default', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'User Profiles' })).not.toBeVisible()
  })

  test('opens the burger menu on click', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await expect(page.getByRole('link', { name: 'User Profiles' })).toBeVisible()
  })

  test('closes the burger menu when clicking outside', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await expect(page.getByRole('link', { name: 'User Profiles' })).toBeVisible()
    await page.click('body', { position: { x: 50, y: 50 } })
    await expect(page.getByRole('link', { name: 'User Profiles' })).not.toBeVisible()
  })

  test('closes the burger menu after clicking a link', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await page.getByRole('link', { name: 'User Profiles' }).click()
    await expect(page.getByRole('link', { name: 'User Profiles' })).not.toBeVisible()
    await expect(page).toHaveURL('/user-profiles')
  })

  test('burger menu shows all 6 demo pages', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await expect(page.getByRole('link', { name: 'User Profiles' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Product Cards' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Task Management' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Settings Panel' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Media Feed' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Kanban Board' })).toBeVisible()
  })

  // ── Search ─────────────────────────────────────────────────────────────────

  test('search input is focused when menu opens', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    const search = page.getByPlaceholder('Search menu…')
    await expect(search).toBeFocused()
  })

  test('filters links by search term', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await page.getByPlaceholder('Search menu…').fill('kanban')
    await expect(page.getByRole('link', { name: 'Kanban Board' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'User Profiles' })).not.toBeVisible()
  })

  test('shows "No results" when search has no matches', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await page.getByPlaceholder('Search menu…').fill('xxxxnonexistent')
    await expect(page.getByText('No results')).toBeVisible()
  })

  test('pressing Enter on search navigates to first result', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await page.getByPlaceholder('Search menu…').fill('product')
    await page.getByPlaceholder('Search menu…').press('Enter')
    await expect(page).toHaveURL('/product-cards')
  })

  test('pressing Escape closes the menu', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await page.getByPlaceholder('Search menu…').press('Escape')
    await expect(page.getByRole('link', { name: 'User Profiles' })).not.toBeVisible()
  })

  // ── Dark mode toggle ───────────────────────────────────────────────────────

  test('dark mode toggle switches theme', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /switch to dark mode/i })
    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('dark mode toggle has accessible aria-label', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /switch to (dark|light) mode/i })
    await expect(toggle).toHaveAttribute('aria-label')
  })

  test('dark mode persists after page reload via localStorage', async ({ page }) => {
    await page.getByRole('button', { name: /switch to dark mode/i }).click()
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  // ── Active state ───────────────────────────────────────────────────────────

  test('Home link is active on the home route', async ({ page }) => {
    const homeLink = page.getByRole('navigation').getByRole('link', { name: 'Home' })
    await expect(homeLink).toHaveClass(/text-blue-700|bg-blue-50/)
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  test('header landmark is present', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('nav has an accessible label', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  })

  test('burger button has aria-expanded attribute', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Toggle navigation menu' })
    await expect(btn).toHaveAttribute('aria-expanded', 'false')
    await btn.click()
    await expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  test('all interactive elements are keyboard focusable', async ({ page }) => {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  // ── Responsive ─────────────────────────────────────────────────────────────

  test('header is sticky and visible on scroll', async ({ page }) => {
    await page.goto('/social-feed')
    await page.evaluate(() => window.scrollBy(0, 600))
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('header renders correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('button', { name: 'Toggle navigation menu' })).toBeVisible()
    await expect(page.getByRole('button', { name: /switch to (dark|light) mode/i })).toBeVisible()
  })
})
