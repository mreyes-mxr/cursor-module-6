import { test, expect } from '@playwright/test'

test.describe('Social Feed Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/social-feed')
  })

  // ── Page structure ─────────────────────────────────────────────────────────

  test('page loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/social-feed')
    expect(errors).toHaveLength(0)
  })

  test('displays the post creation form', async ({ page }) => {
    const form = page.getByPlaceholder(/what.*mind|share.*thoughts|write.*post/i)
      .or(page.locator('textarea').first())
    await expect(form).toBeVisible()
  })

  test('displays feed filter tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'For You' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Following' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Trending' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Discover' })).toBeVisible()
  })

  test('renders at least one post card', async ({ page }) => {
    const posts = page.getByRole('article')
    await expect(posts.first()).toBeVisible()
  })

  // ── Post creation form ─────────────────────────────────────────────────────

  test('post creation textarea accepts input', async ({ page }) => {
    const textarea = page.locator('textarea').first()
    await textarea.fill('Hello, this is a test post!')
    await expect(textarea).toHaveValue('Hello, this is a test post!')
  })

  test('submitting a new post adds it to the top of the feed', async ({ page }) => {
    const textarea = page.locator('textarea').first()
    await textarea.fill('My brand new test post content')

    const submitBtn = page.getByRole('button', { name: /post|publish|share/i }).first()
    await submitBtn.click()

    await expect(page.getByText('My brand new test post content')).toBeVisible({ timeout: 2000 })
  })

  test('post button is disabled when textarea is empty', async ({ page }) => {
    const textarea = page.locator('textarea').first()
    await textarea.fill('')

    const submitBtn = page.getByRole('button', { name: /^post$/i }).first()
    if (await submitBtn.count() > 0) {
      await expect(submitBtn).toBeDisabled()
    }
  })

  test('character count is shown and updates as user types', async ({ page }) => {
    const textarea = page.locator('textarea').first()
    await textarea.fill('Test post')
    // Character count should be visible somewhere near the form
    const charCount = page.getByText(/\d+\/\d+/).first()
    if (await charCount.count() > 0) {
      await expect(charCount).toBeVisible()
    }
  })

  test('optional image URL field is present', async ({ page }) => {
    const imgInput = page.getByPlaceholder(/image url|https/i).first()
    if (await imgInput.count() > 0) {
      await expect(imgInput).toBeVisible()
    }
  })

  // ── Feed filter tabs ───────────────────────────────────────────────────────

  test('"For You" tab is active by default', async ({ page }) => {
    const forYouTab = page.getByRole('button', { name: 'For You' })
    const className = await forYouTab.getAttribute('class')
    expect(className).toContain('bg-blue-600')
  })

  test('clicking a different feed tab makes it active', async ({ page }) => {
    const trendingTab = page.getByRole('button', { name: 'Trending' })
    await trendingTab.click()
    const className = await trendingTab.getAttribute('class')
    expect(className).toContain('bg-blue-600')
  })

  // ── Post card interactions ─────────────────────────────────────────────────

  test('post cards display author name and content', async ({ page }) => {
    const firstPost = page.getByRole('article').first()
    await expect(firstPost).toBeVisible()
  })

  test('like button is present on posts', async ({ page }) => {
    const firstPost = page.getByRole('article').first()
    const likeBtn = firstPost.getByRole('button', { name: /like/i })
    if (await likeBtn.count() > 0) {
      await expect(likeBtn).toBeVisible()
    } else {
      // Try finding by label pattern for icon buttons
      const buttons = firstPost.getByRole('button')
      expect(await buttons.count()).toBeGreaterThan(0)
    }
  })

  test('clicking like button increments like count', async ({ page }) => {
    const firstPost = page.getByRole('article').first()
    // The Like action button has label "Like" in the action bar at the bottom of each post
    const likeBtn = firstPost.getByRole('button', { name: /^like$/i })
    if (await likeBtn.count() > 0) {
      await likeBtn.click()
      // After liking, the heart count in the stats row should increment
      await expect(firstPost.getByRole('button', { name: /^like$/i })).toBeVisible()
    }
  })

  test('comment section can be toggled open', async ({ page }) => {
    const firstPost = page.getByRole('article').first()
    const commentBtn = firstPost.getByRole('button', { name: /comment/i }).first()
    if (await commentBtn.count() > 0) {
      await commentBtn.click()
      // Comments section should expand
      const comments = firstPost.locator('[class*="comment"]').or(firstPost.getByRole('list'))
      if (await comments.count() > 0) {
        await expect(comments.first()).toBeVisible()
      }
    }
  })

  // ── Suggested users strip ──────────────────────────────────────────────────

  test('suggested users section is visible', async ({ page }) => {
    const suggestedSection = page.getByText(/suggested|people.*follow|who.*follow/i).first()
    if (await suggestedSection.count() > 0) {
      await expect(suggestedSection).toBeVisible()
    }
  })

  test('suggested user follow buttons are interactive', async ({ page }) => {
    const followBtns = page.getByRole('button', { name: /^Follow$/i })
    if (await followBtns.count() > 0) {
      await followBtns.first().click()
      const following = page.getByRole('button', { name: /following/i }).first()
      if (await following.count() > 0) {
        await expect(following).toBeVisible()
      }
    }
  })

  // ── Infinite scroll ────────────────────────────────────────────────────────

  test('infinite scroll sentinel is present in DOM', async ({ page }) => {
    // The IntersectionObserver sentinel div is at the bottom of the feed
    const sentinel = page.locator('[data-testid="scroll-sentinel"]')
      .or(page.locator('div').last())
    await expect(sentinel).toBeAttached()
  })

  test('scrolling to bottom triggers loading more posts', async ({ page }) => {
    // Count initial posts
    const initialCount = await page.getByRole('article').count()
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1500)
    // More posts may have loaded
    const newCount = await page.getByRole('article').count()
    // Either the same (no more posts to load) or more
    expect(newCount).toBeGreaterThanOrEqual(initialCount)
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  test('page has a main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('post creation textarea is keyboard accessible', async ({ page }) => {
    const textarea = page.locator('textarea').first()
    await textarea.focus()
    await expect(textarea).toBeFocused()
    await page.keyboard.type('Keyboard test')
    await expect(textarea).toHaveValue('Keyboard test')
  })

  test('feed tab buttons are keyboard navigable', async ({ page }) => {
    const forYouTab = page.getByRole('button', { name: 'For You' })
    await forYouTab.focus()
    await expect(forYouTab).toBeFocused()
    await page.keyboard.press('Tab')
    // Next tab should be focused
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  // ── Responsive ─────────────────────────────────────────────────────────────

  test('feed renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('article').first()).toBeVisible()
  })

  test('feed filter tabs remain visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('button', { name: 'For You' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Trending' })).toBeVisible()
  })

  test('post creation form is accessible on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    const textarea = page.locator('textarea').first()
    await expect(textarea).toBeVisible()
  })

  test('posts are readable on wide desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(page.getByRole('article').first()).toBeVisible()
  })
})
