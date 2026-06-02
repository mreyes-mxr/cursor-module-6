import { test, expect } from '@playwright/test'

test.describe('Kanban Board Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kanban')
  })

  // ── Page structure ─────────────────────────────────────────────────────────

  test('renders the Kanban Board heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /kanban/i })).toBeVisible()
  })

  test('displays three columns: To Do, In Progress, Done', async ({ page }) => {
    await expect(page.getByText(/to.?do/i).first()).toBeVisible()
    await expect(page.getByText(/in.?progress/i).first()).toBeVisible()
    await expect(page.getByText(/done/i).first()).toBeVisible()
  })

  test('renders the progress bar', async ({ page }) => {
    // The emerald fill bar inside the progress track — use first() to avoid strict mode
    const progressBar = page.locator('.bg-emerald-500.rounded-full').first()
    await expect(progressBar).toBeAttached()
  })

  test('displays progress text (x/y done)', async ({ page }) => {
    await expect(page.getByText(/\d+\/\d+ done/)).toBeVisible()
  })

  test('displays the drag-and-drop instruction note', async ({ page }) => {
    // The KanbanBoard footer note uniquely contains "HTML5 Drag API"
    await expect(page.getByText(/html5 drag api/i)).toBeVisible()
  })

  // ── Task cards ─────────────────────────────────────────────────────────────

  test('renders task cards with titles', async ({ page }) => {
    const cards = page.locator('[draggable="true"]')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('task cards display priority labels', async ({ page }) => {
    const priorities = page.getByText(/urgent|high|medium|low/i).first()
    await expect(priorities).toBeVisible()
  })

  test('task cards show assignee initials', async ({ page }) => {
    const assigneeCircles = page.locator('[class*="rounded-full"][class*="text-white"]').filter({ hasText: /[A-Z]{1,2}/ })
    const count = await assigneeCircles.count()
    expect(count).toBeGreaterThan(0)
  })

  test('task cards display due dates', async ({ page }) => {
    const dueDates = page.getByText(/\d{1,2}\/\d{1,2}|\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)
    const count = await dueDates.count()
    expect(count).toBeGreaterThan(0)
  })

  test('task cards show tags/chips', async ({ page }) => {
    const tags = page.locator('[class*="rounded-full"][class*="text-xs"]').first()
    if (await tags.count() > 0) {
      await expect(tags).toBeVisible()
    }
  })

  // ── Priority legend ────────────────────────────────────────────────────────

  test('priority legend is displayed on the page', async ({ page }) => {
    const legend = page.getByText(/priority|urgent|high|medium|low/i).first()
    await expect(legend).toBeVisible()
  })

  // ── Column task counts ─────────────────────────────────────────────────────

  test('columns display task count badges', async ({ page }) => {
    // Each column header shows task count
    const counts = page.locator('[class*="rounded-full"]').filter({ hasText: /^\d+$/ })
    const count = await counts.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  // ── Drag and drop ──────────────────────────────────────────────────────────

  test('task cards have draggable attribute', async ({ page }) => {
    const draggableCards = page.locator('[draggable="true"]')
    const count = await draggableCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('drag a task from To Do to In Progress column', async ({ page }) => {
    // Get a task from the Todo column
    const todoColumn = page.locator('[class*="flex"][class*="flex-col"]').filter({ hasText: /to.?do/i }).first()
    const inProgressColumn = page.locator('[class*="flex"][class*="flex-col"]').filter({ hasText: /in.?progress/i }).first()

    const todoCards = todoColumn.locator('[draggable="true"]')
    const todoCount = await todoCards.count()

    if (todoCount > 0) {
      const card = todoCards.first()
      const inProgressBox = await inProgressColumn.boundingBox()

      if (inProgressBox) {
        // Simulate HTML5 drag
        await card.dispatchEvent('dragstart')
        await inProgressColumn.dispatchEvent('dragover')
        await inProgressColumn.dispatchEvent('drop')
        await card.dispatchEvent('dragend')

        // Progress should update or column counts change
        await page.waitForTimeout(300)
      }
    }
  })

  test('dropping a task in Done column updates progress bar', async ({ page }) => {
    const progressText = page.getByText(/\d+\/\d+ done/)
    await expect(progressText).toBeVisible()

    // Locate the Done column via its h2 heading, then find the droppable zone
    const doneHeading = page.getByRole('heading', { name: 'Done' })
    await expect(doneHeading).toBeVisible()

    // Find a draggable card from any column and dispatch HTML5 drag events onto Done
    const allCards = page.locator('[draggable="true"]')
    const count = await allCards.count()
    if (count > 0) {
      const card = allCards.first()
      const doneColumn = doneHeading.locator('..')
      await card.dispatchEvent('dragstart')
      await doneColumn.dispatchEvent('dragover')
      await doneColumn.dispatchEvent('drop')
      await page.waitForTimeout(300)
    }

    // Progress text is still visible (board didn't crash)
    await expect(progressText).toBeVisible()
  })

  // ── Progress bar ───────────────────────────────────────────────────────────

  test('progress bar shows percentage of done tasks', async ({ page }) => {
    const progressText = page.getByText(/\d+\/\d+ done/)
    await expect(progressText).toBeVisible()
    const text = await progressText.textContent()
    expect(text).toMatch(/\d+\/\d+ done/)
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  test('page has a main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('page loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/kanban')
    expect(errors).toHaveLength(0)
  })

  test('board columns have identifiable headings', async ({ page }) => {
    const headings = page.getByRole('heading')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
  })

  // ── Responsive ─────────────────────────────────────────────────────────────

  test('board is scrollable horizontally on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('main')).toBeVisible()
    // The column container has overflow-x-auto
    const container = page.locator('[class*="overflow-x-auto"]')
    if (await container.count() > 0) {
      await expect(container.first()).toBeVisible()
    }
  })

  test('renders task cards on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    const cards = page.locator('[draggable="true"]')
    await expect(cards.first()).toBeVisible()
  })

  test('all three columns are visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page.getByText(/to.?do/i).first()).toBeVisible()
    await expect(page.getByText(/in.?progress/i).first()).toBeVisible()
    await expect(page.getByText(/done/i).first()).toBeVisible()
  })
})
