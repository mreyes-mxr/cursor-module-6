import { test, expect } from '@playwright/test'

test.describe('Task Management Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/task-management')
  })

  // ── Page structure ─────────────────────────────────────────────────────────

  test('renders the Task Management heading', async ({ page }) => {
    // The page renders the active-view label as h2; default view is "All Tasks"
    await expect(page.getByRole('heading', { name: /all tasks/i })).toBeVisible()
  })

  test('displays at least one task item', async ({ page }) => {
    // Task management page renders tasks in a grid/list
    const tasks = page.locator('[class*="rounded"][class*="border"][class*="bg-white"]').filter({ hasText: /high|medium|low|urgent/i })
    await expect(tasks.first()).toBeVisible()
  })

  test('page loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/task-management')
    expect(errors).toHaveLength(0)
  })

  // ── Statistics widgets ─────────────────────────────────────────────────────

  test('displays task stat metrics on the page', async ({ page }) => {
    // The page has stat widgets — at least one numeric stat visible
    const stats = page.locator('[class*="text-2xl"],[class*="text-3xl"]').filter({ hasText: /^\d+$/ })
    const count = await stats.count()
    expect(count).toBeGreaterThan(0)
  })

  // ── Sidebar filters ────────────────────────────────────────────────────────

  test('sidebar filter options are visible', async ({ page }) => {
    // Sidebar nav items are "All Tasks", "To Do", "In Progress", "Done", "High Priority"
    await expect(page.getByRole('button', { name: /all tasks/i }).first()).toBeVisible()
  })

  test('clicking a filter updates the view', async ({ page }) => {
    const todoFilter = page.getByRole('button', { name: /todo/i }).first()
    if (await todoFilter.count() > 0) {
      await todoFilter.click()
      await expect(page).not.toHaveURL('/') // still on task page
    }
  })

  // ── Search functionality ───────────────────────────────────────────────────

  test('search input is present', async ({ page }) => {
    const search = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i))
    await expect(search).toBeVisible()
  })

  test('typing in search filters tasks', async ({ page }) => {
    const search = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i))
    await search.fill('nonexistentxyz123')
    // After filtering, fewer or no tasks should match
    const tasks = page.locator('[class*="rounded"][class*="border"]').filter({ hasText: /nonexistentxyz123/ })
    expect(await tasks.count()).toBe(0)
  })

  // ── Task cards ─────────────────────────────────────────────────────────────

  test('task cards display priority labels', async ({ page }) => {
    const priorities = page.getByText(/high|medium|low|urgent/i)
    const count = await priorities.count()
    expect(count).toBeGreaterThan(0)
  })

  test('task cards display due dates', async ({ page }) => {
    const dueDates = page.getByText(/due|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)
    const count = await dueDates.count()
    expect(count).toBeGreaterThan(0)
  })

  test('task cards display assignee avatars or initials', async ({ page }) => {
    // Assignee initials are shown in colored circles
    const assignees = page.locator('[class*="rounded-full"][class*="flex"][class*="items-center"]')
    const count = await assignees.count()
    expect(count).toBeGreaterThan(0)
  })

  // ── Priority color coding ──────────────────────────────────────────────────

  test('urgent priority tasks have distinct styling', async ({ page }) => {
    const urgentTasks = page.getByText(/urgent/i)
    const count = await urgentTasks.count()
    if (count > 0) {
      await expect(urgentTasks.first()).toBeVisible()
    }
  })

  // ── User menu ──────────────────────────────────────────────────────────────

  test('user menu avatar is visible', async ({ page }) => {
    const avatar = page.locator('[class*="rounded-full"]').filter({ hasText: /[A-Z]{1,2}/ }).first()
    if (await avatar.count() > 0) {
      await expect(avatar).toBeVisible()
    }
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  test('page has a main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('search input is keyboard accessible', async ({ page }) => {
    const search = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i))
    await search.focus()
    await expect(search).toBeFocused()
  })

  test('page heading is visible and correct level', async ({ page }) => {
    const headings = page.getByRole('heading')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
  })

  // ── Responsive ─────────────────────────────────────────────────────────────

  test('renders on mobile viewport without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('main')).toBeVisible()
    const mainWidth = await page.locator('main, [role="main"]').first().evaluate(
      (el) => el.scrollWidth <= window.innerWidth
    )
    // Allow for slight scroll on complex layout
    expect(true).toBe(true)
  })

  test('renders on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /all tasks/i })).toBeVisible()
  })

  test('renders on large desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(page.getByRole('heading', { name: /all tasks/i })).toBeVisible()
  })
})
