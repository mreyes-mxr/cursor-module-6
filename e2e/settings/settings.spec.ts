import { test, expect } from '@playwright/test'

test.describe('Settings Panel Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  // ── Page structure ─────────────────────────────────────────────────────────

  test('renders the "Settings" heading', async ({ page }) => {
    // SettingsPanelPage renders an h1 "Settings panel"; the panel itself renders h2 "Settings"
    await expect(page.getByRole('heading', { name: 'Settings panel' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible()
  })

  test('renders the settings description', async ({ page }) => {
    await expect(page.getByText('Manage your account preferences and configuration.')).toBeVisible()
  })

  test('renders all four tab buttons', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Notifications' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Privacy' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Appearance' })).toBeVisible()
  })

  test('Profile tab is active by default', async ({ page }) => {
    const profileTab = page.getByRole('tab', { name: 'Profile' })
    await expect(profileTab).toHaveAttribute('aria-selected', 'true')
  })

  // ── Tab switching ──────────────────────────────────────────────────────────

  test('clicking Notifications tab shows notifications panel', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    await expect(page.getByRole('tab', { name: 'Notifications' })).toHaveAttribute('aria-selected', 'true')
    // The label element (visible) and the sr-only span both contain this text; scope to the label
    await expect(page.locator('label').filter({ hasText: 'Email notifications' }).first()).toBeVisible()
  })

  test('clicking Privacy tab shows privacy panel', async ({ page }) => {
    await page.getByRole('tab', { name: 'Privacy' }).click()
    // Scope to label element to avoid the sr-only span inside the switch
    await expect(page.locator('label').filter({ hasText: 'Private account' }).first()).toBeVisible()
    await expect(page.getByText('Danger zone')).toBeVisible()
  })

  test('clicking Appearance tab shows appearance panel', async ({ page }) => {
    await page.getByRole('tab', { name: 'Appearance' }).click()
    await expect(page.getByRole('group', { name: /theme/i })).toBeVisible()
  })

  test('switching tabs hides previously active panel content', async ({ page }) => {
    await expect(page.getByLabel('Full name')).toBeVisible()
    await page.getByRole('tab', { name: 'Notifications' }).click()
    await expect(page.getByLabel('Full name')).not.toBeVisible()
  })

  // ── Profile tab ────────────────────────────────────────────────────────────

  test('Profile tab shows full name, username, email fields', async ({ page }) => {
    await expect(page.getByLabel('Full name')).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Email address')).toBeVisible()
  })

  test('Profile tab fields are pre-filled with default values', async ({ page }) => {
    await expect(page.getByLabel('Full name')).toHaveValue('Alex Rivera')
    await expect(page.getByLabel('Email address')).toHaveValue('alex@example.com')
  })

  test('updating name field changes its value', async ({ page }) => {
    const nameInput = page.getByLabel('Full name')
    await nameInput.clear()
    await nameInput.fill('Jane Doe')
    await expect(nameInput).toHaveValue('Jane Doe')
  })

  test('bio field has a 160 character limit', async ({ page }) => {
    const bioField = page.getByLabel(/bio/i)
    await expect(bioField).toHaveAttribute('maxlength', '160')
  })

  test('bio character counter updates as user types', async ({ page }) => {
    const bioField = page.getByLabel(/bio/i)
    await bioField.clear()
    await bioField.fill('Hello')
    await expect(page.getByText('5/160 characters')).toBeVisible()
  })

  test('Save changes button triggers saving state', async ({ page }) => {
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByRole('button', { name: /saving/i })).toBeVisible()
  })

  test('Save changes shows "Saved" confirmation after delay', async ({ page }) => {
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Saved')).toBeVisible({ timeout: 3000 })
  })

  test('Reset button restores default values', async ({ page }) => {
    const nameInput = page.getByLabel('Full name')
    await nameInput.clear()
    await nameInput.fill('Changed Name')
    await page.getByRole('button', { name: 'Reset' }).click()
    await expect(nameInput).toHaveValue('Alex Rivera')
  })

  test('Upload photo button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /upload photo/i })).toBeVisible()
  })

  test('Remove photo button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /remove/i })).toBeVisible()
  })

  // ── Notifications tab ──────────────────────────────────────────────────────

  test('Notifications tab shows all toggle switches', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    const switches = page.getByRole('switch')
    const count = await switches.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  test('email notifications toggle starts enabled', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    const emailToggle = page.getByRole('switch', { name: /email notifications/i })
    await expect(emailToggle).toHaveAttribute('aria-checked', 'true')
  })

  test('push notifications toggle starts disabled', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    const pushToggle = page.getByRole('switch', { name: /push notifications/i })
    await expect(pushToggle).toHaveAttribute('aria-checked', 'false')
  })

  test('clicking a toggle changes its checked state', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    const pushToggle = page.getByRole('switch', { name: /push notifications/i })
    await pushToggle.click()
    await expect(pushToggle).toHaveAttribute('aria-checked', 'true')
  })

  test('Notifications reset restores default toggle states', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    const pushToggle = page.getByRole('switch', { name: /push notifications/i })
    await pushToggle.click()
    await expect(pushToggle).toHaveAttribute('aria-checked', 'true')
    await page.getByRole('button', { name: 'Reset' }).click()
    await expect(pushToggle).toHaveAttribute('aria-checked', 'false')
  })

  // ── Privacy tab ────────────────────────────────────────────────────────────

  test('Privacy tab shows account visibility toggles', async ({ page }) => {
    await page.getByRole('tab', { name: 'Privacy' }).click()
    await expect(page.getByRole('switch', { name: /private account/i })).toBeVisible()
    await expect(page.getByRole('switch', { name: /show activity status/i })).toBeVisible()
  })

  test('Privacy tab shows audience control selects', async ({ page }) => {
    await page.getByRole('tab', { name: 'Privacy' }).click()
    await expect(page.getByRole('combobox', { name: /who can see my email/i })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /who can comment/i })).toBeVisible()
  })

  test('email visibility select can be changed', async ({ page }) => {
    await page.getByRole('tab', { name: 'Privacy' }).click()
    const select = page.getByRole('combobox', { name: /who can see my email/i })
    await select.selectOption('everyone')
    await expect(select).toHaveValue('everyone')
  })

  test('Danger zone contains "Download my data" and "Delete account" buttons', async ({ page }) => {
    await page.getByRole('tab', { name: 'Privacy' }).click()
    await expect(page.getByRole('button', { name: /download my data/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /delete account/i })).toBeVisible()
  })

  // ── Appearance tab ─────────────────────────────────────────────────────────

  test('Appearance tab shows Light, Dark, System theme options', async ({ page }) => {
    await page.getByRole('tab', { name: 'Appearance' }).click()
    // Use exact match: each label "Light"/"Dark"/"System" has a sibling description that also
    // contains the word. Scoping to exact text avoids strict-mode violations.
    await expect(page.getByText('Light', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Dark', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('System', { exact: true }).first()).toBeVisible()
  })

  test('selecting Dark theme applies dark class to html', async ({ page }) => {
    await page.getByRole('tab', { name: 'Appearance' }).click()
    // Click the radio label for "Dark" theme (exact text to avoid the description text)
    await page.getByText('Dark', { exact: true }).first().click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('Appearance tab shows font size options (Small, Medium, Large)', async ({ page }) => {
    await page.getByRole('tab', { name: 'Appearance' }).click()
    await expect(page.getByText('Small')).toBeVisible()
    await expect(page.getByText('Medium')).toBeVisible()
    await expect(page.getByText('Large')).toBeVisible()
  })

  test('language selector has multiple options', async ({ page }) => {
    await page.getByRole('tab', { name: 'Appearance' }).click()
    const langSelect = page.getByRole('combobox', { name: /language/i })
    await langSelect.selectOption('es')
    await expect(langSelect).toHaveValue('es')
  })

  test('Accessibility section shows Reduce motion and High contrast toggles', async ({ page }) => {
    await page.getByRole('tab', { name: 'Appearance' }).click()
    await expect(page.getByRole('switch', { name: /reduce motion/i })).toBeVisible()
    await expect(page.getByRole('switch', { name: /high contrast/i })).toBeVisible()
  })

  // ── Keyboard navigation ────────────────────────────────────────────────────

  test('ArrowRight moves tab focus to next tab', async ({ page }) => {
    const profileTab = page.getByRole('tab', { name: 'Profile' })
    await profileTab.focus()
    await page.keyboard.press('ArrowRight')
    const notifTab = page.getByRole('tab', { name: 'Notifications' })
    await expect(notifTab).toHaveAttribute('aria-selected', 'true')
  })

  test('ArrowLeft moves tab focus to previous tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    await page.getByRole('tab', { name: 'Notifications' }).focus()
    await page.keyboard.press('ArrowLeft')
    await expect(page.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
  })

  test('Home key moves to first tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Appearance' }).click()
    await page.getByRole('tab', { name: 'Appearance' }).focus()
    await page.keyboard.press('Home')
    await expect(page.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
  })

  test('End key moves to last tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Profile' }).focus()
    await page.keyboard.press('End')
    await expect(page.getByRole('tab', { name: 'Appearance' })).toHaveAttribute('aria-selected', 'true')
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  test('tablist has aria-label and aria-orientation', async ({ page }) => {
    const tablist = page.getByRole('tablist')
    await expect(tablist).toHaveAttribute('aria-label', 'Settings sections')
    await expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
  })

  test('each tab has aria-controls pointing to its panel', async ({ page }) => {
    const profileTab = page.getByRole('tab', { name: 'Profile' })
    const controls = await profileTab.getAttribute('aria-controls')
    expect(controls).toBe('settings-panel-profile')
    await expect(page.locator(`#${controls}`)).toBeVisible()
  })

  test('toggle switches have role="switch" and aria-checked', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click()
    const switches = page.getByRole('switch')
    const firstSwitch = switches.first()
    await expect(firstSwitch).toHaveAttribute('aria-checked')
  })

  test('form fields in Profile tab have associated labels', async ({ page }) => {
    const nameInput = page.getByLabel('Full name')
    await expect(nameInput).toBeVisible()
    const emailInput = page.getByLabel('Email address')
    await expect(emailInput).toBeVisible()
  })

  test('Save changes button is disabled while saving', async ({ page }) => {
    await page.getByRole('button', { name: 'Save changes' }).click()
    const savingBtn = page.getByRole('button', { name: /saving/i })
    await expect(savingBtn).toBeDisabled()
  })

  // ── Responsive ─────────────────────────────────────────────────────────────

  test('tabs display horizontally on mobile (overflow-x)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Notifications' })).toBeVisible()
  })

  test('settings panel is full width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('heading', { name: 'Settings panel' })).toBeVisible()
    await expect(page.getByLabel('Full name')).toBeVisible()
  })

  test('settings panel renders correctly on wide desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(page.getByRole('tablist')).toBeVisible()
    await expect(page.getByLabel('Full name')).toBeVisible()
  })
})
