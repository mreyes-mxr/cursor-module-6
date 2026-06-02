import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays the welcome heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible()
  })

  test('displays the showcase description text', async ({ page }) => {
    await expect(
      page.getByText('This page is a showcase for Lesson 6 practical examples.')
    ).toBeVisible()
  })

  test('renders inside a centered card layout', async ({ page }) => {
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
    const card = main.locator('div').first()
    await expect(card).toBeVisible()
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/module-6|Cursor apps showcase|Vite/i)
  })

  test('has no broken layout at desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible()
  })

  test('has no broken layout at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible()
  })

  test('links to demos via the header menu', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation menu' }).click()
    await expect(page.getByRole('link', { name: 'User Profiles' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Product Cards' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Task Management' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Settings Panel' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Media Feed' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Kanban Board' })).toBeVisible()
  })

  test('accessibility: main landmark is present', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('accessibility: heading hierarchy starts at h1', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    await expect(h1).toHaveText('Welcome!')
  })
})
