import { test, expect } from '@playwright/test'

test.describe('User Profiles Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/user-profiles')
  })

  // ── Page structure ─────────────────────────────────────────────────────────

  test('displays the page heading "User Profiles"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'User Profiles', level: 1 })).toBeVisible()
  })

  test('displays the legend cards (Own profile, Following, Minimal data)', async ({ page }) => {
    // The legend is a <dl> with <dt> terms. Scope to the term role to avoid the
    // "Following" stat labels that also appear inside the profile cards.
    await expect(page.getByRole('term').filter({ hasText: 'Own profile' })).toBeVisible()
    await expect(page.getByRole('term').filter({ hasText: 'Following' })).toBeVisible()
    await expect(page.getByRole('term').filter({ hasText: 'Minimal data' })).toBeVisible()
  })

  test('displays the "Your Profile" section label', async ({ page }) => {
    await expect(page.getByText(/Your Profile/i)).toBeVisible()
  })

  test('displays the "Other Users" section label', async ({ page }) => {
    await expect(page.getByText(/Other Users/i)).toBeVisible()
  })

  // ── Own profile card ───────────────────────────────────────────────────────

  test('own profile shows "Edit Profile" button', async ({ page }) => {
    const ownProfile = page.getByRole('article').first()
    await expect(ownProfile.getByRole('button', { name: /edit.*profile/i })).toBeVisible()
  })

  test('own profile does NOT show Follow/Message buttons', async ({ page }) => {
    const ownProfile = page.getByRole('article').first()
    await expect(ownProfile.getByRole('button', { name: /^Follow$/i })).not.toBeVisible()
    await expect(ownProfile.getByRole('button', { name: /message/i })).not.toBeVisible()
  })

  test('clicking Edit Profile triggers an alert', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('edit profile')
      await dialog.dismiss()
    })
    const ownProfile = page.getByRole('article').first()
    await ownProfile.getByRole('button', { name: /edit.*profile/i }).click()
  })

  // ── Other user profile cards ───────────────────────────────────────────────

  test('other user profiles show Follow and Message buttons', async ({ page }) => {
    const otherProfiles = page.getByRole('article').filter({ hasNot: page.getByRole('button', { name: /edit.*profile/i }) })
    const count = await otherProfiles.count()
    expect(count).toBeGreaterThan(0)

    const firstOther = page.getByRole('article').nth(1)
    await expect(firstOther.getByRole('button', { name: /follow/i })).toBeVisible()
    await expect(firstOther.getByRole('button', { name: /message/i })).toBeVisible()
  })

  test('clicking Follow toggles to Following state', async ({ page }) => {
    const firstOther = page.getByRole('article').nth(1)
    // aria-label is "Follow user" (not just "Follow") per the component's aria-label prop
    const followBtn = firstOther.getByRole('button', { name: /follow user/i })
    await followBtn.click()
    await expect(firstOther.getByRole('button', { name: /unfollow user/i })).toBeVisible()
  })

  test('clicking Following unfollows (toggles back to Follow)', async ({ page }) => {
    const firstOther = page.getByRole('article').nth(1)
    await firstOther.getByRole('button', { name: /follow user/i }).click()
    await expect(firstOther.getByRole('button', { name: /unfollow user/i })).toBeVisible()
    await firstOther.getByRole('button', { name: /unfollow user/i }).click()
    await expect(firstOther.getByRole('button', { name: /follow user/i })).toBeVisible()
  })

  test('clicking Message triggers an alert with user ID', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toMatch(/open dm|user/i)
      await dialog.dismiss()
    })
    const firstOther = page.getByRole('article').nth(1)
    await firstOther.getByRole('button', { name: /message/i }).click()
  })

  // ── Profile card content ───────────────────────────────────────────────────

  test('profile cards display user names', async ({ page }) => {
    const profiles = page.getByRole('article')
    await expect(profiles.first().getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('profile cards display usernames with @ prefix', async ({ page }) => {
    const profiles = page.getByRole('article')
    const firstCard = profiles.first()
    await expect(firstCard.getByText(/^@/)).toBeVisible()
  })

  test('profile cards display stats (Posts, Followers, Following)', async ({ page }) => {
    const firstProfile = page.getByRole('article').first()
    await expect(firstProfile.getByText('Posts')).toBeVisible()
    await expect(firstProfile.getByText('Followers')).toBeVisible()
    await expect(firstProfile.getByText('Following')).toBeVisible()
  })

  test('displays a "Joined" date on profiles', async ({ page }) => {
    const firstProfile = page.getByRole('article').first()
    await expect(firstProfile.getByText(/joined/i)).toBeVisible()
  })

  // ── Multiple profiles ──────────────────────────────────────────────────────

  test('renders at least 5 profile cards total', async ({ page }) => {
    const profiles = page.getByRole('article')
    const count = await profiles.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('follow states are independent per profile', async ({ page }) => {
    const profiles = page.getByRole('article')
    const second = profiles.nth(1)
    const third = profiles.nth(2)

    await second.getByRole('button', { name: /follow user/i }).click()
    await expect(second.getByRole('button', { name: /unfollow user/i })).toBeVisible()
    await expect(third.getByRole('button', { name: /follow user/i })).toBeVisible()
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  test('profile articles have accessible aria-labels', async ({ page }) => {
    const profiles = page.getByRole('article')
    const first = profiles.first()
    const label = await first.getAttribute('aria-label')
    expect(label).toMatch(/profile/i)
  })

  test('profile statistics group has aria-label', async ({ page }) => {
    const statsGroup = page.getByRole('group', { name: /profile statistics/i }).first()
    await expect(statsGroup).toBeVisible()
  })

  test('Follow button has aria-pressed attribute', async ({ page }) => {
    const firstOther = page.getByRole('article').nth(1)
    const followBtn = firstOther.getByRole('button', { name: /follow user/i })
    await expect(followBtn).toHaveAttribute('aria-pressed', 'false')
    await followBtn.click()
    await expect(firstOther.getByRole('button', { name: /unfollow user/i })).toHaveAttribute('aria-pressed', 'true')
  })

  test('profile details list has aria-label', async ({ page }) => {
    const detailsList = page.getByRole('list', { name: /profile details/i }).first()
    await expect(detailsList).toBeVisible()
  })

  // ── Responsive ─────────────────────────────────────────────────────────────

  test('legend grid collapses to single column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByText('Own profile')).toBeVisible()
  })

  test('page renders correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: 'User Profiles', level: 1 })).toBeVisible()
    const profiles = page.getByRole('article')
    expect(await profiles.count()).toBeGreaterThanOrEqual(5)
  })

  test('profile cards are full-width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const firstProfile = page.getByRole('article').first()
    await expect(firstProfile).toBeVisible()
    const box = await firstProfile.boundingBox()
    expect(box?.width).toBeLessThanOrEqual(375)
  })
})
