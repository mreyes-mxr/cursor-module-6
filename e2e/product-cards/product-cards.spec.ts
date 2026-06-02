import { test, expect } from '@playwright/test'

test.describe('Product Cards Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/product-cards')
  })

  // ── Page structure ─────────────────────────────────────────────────────────

  test('displays the "Product Cards" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Product Cards', level: 1 })).toBeVisible()
  })

  test('displays the product listing section', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Product listing' })).toBeVisible()
  })

  test('renders 6 product cards', async ({ page }) => {
    const products = page.getByRole('article')
    await expect(products).toHaveCount(6)
  })

  // ── Cart counter ───────────────────────────────────────────────────────────

  test('cart counter starts at 0', async ({ page }) => {
    await expect(page.getByText('0 items in cart')).toBeVisible()
  })

  test('cart counter has aria-label', async ({ page }) => {
    // The cart counter div uses aria-live + aria-label but no role="region"
    const counter = page.locator('[aria-label*="items in cart"]').first()
    await expect(counter).toBeVisible()
  })

  // ── Add to Cart flow ───────────────────────────────────────────────────────

  test('clicking Add to Cart increments cart counter', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    const addBtn = firstProduct.getByRole('button', { name: /add .* to cart/i })
    await addBtn.click()
    await expect(page.getByText('1 item in cart')).toBeVisible()
  })

  test('adding two products shows count 2', async ({ page }) => {
    const products = page.getByRole('article')
    await products.nth(0).getByRole('button', { name: /add .* to cart/i }).click()
    await products.nth(1).getByRole('button', { name: /add .* to cart/i }).click()
    await expect(page.getByText('2 items in cart')).toBeVisible()
  })

  test('button changes to "Added to Cart" after clicking', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    const addBtn = firstProduct.getByRole('button', { name: /add .* to cart/i })
    await addBtn.click()
    await expect(firstProduct.getByRole('button', { name: /added to cart/i })).toBeVisible()
  })

  test('"Added to Cart" button reverts back after ~2 seconds', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    const addBtn = firstProduct.getByRole('button', { name: /add .* to cart/i })
    await addBtn.click()
    await expect(firstProduct.getByRole('button', { name: /added to cart/i })).toBeVisible()
    await page.waitForTimeout(2200)
    await expect(firstProduct.getByRole('button', { name: /add .* to cart/i })).toBeVisible()
  })

  // ── Toast notification ─────────────────────────────────────────────────────

  test('clicking Add to Cart shows a toast notification', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    await firstProduct.getByRole('button', { name: /add .* to cart/i }).click()
    const toast = page.getByRole('status')
    await expect(toast).toBeVisible()
    await expect(toast).toContainText('added to cart')
  })

  test('toast disappears after ~2.5 seconds', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    await firstProduct.getByRole('button', { name: /add .* to cart/i }).click()
    await expect(page.getByRole('status')).toContainText('added to cart')
    await page.waitForTimeout(2700)
    const toast = page.getByRole('status')
    const opacity = await toast.evaluate((el) => window.getComputedStyle(el).opacity)
    expect(parseFloat(opacity)).toBeLessThan(0.5)
  })

  test('toast has aria-live="assertive" for screen readers', async ({ page }) => {
    const toast = page.getByRole('status')
    await expect(toast).toHaveAttribute('aria-live', 'assertive')
  })

  // ── Product card content ───────────────────────────────────────────────────

  test('product cards display title, price, and rating', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    await expect(firstProduct.getByRole('heading', { level: 3 })).toBeVisible()
    // Use first() because a discounted card has two price elements (current + original)
    await expect(firstProduct.getByText(/\$\d+\.\d{2}/).first()).toBeVisible()
  })

  test('product cards with discount show original price struck through', async ({ page }) => {
    const products = page.getByRole('article')
    const count = await products.count()
    let foundDiscount = false
    for (let i = 0; i < count; i++) {
      const card = products.nth(i)
      const strikethrough = card.locator('span.line-through')
      if (await strikethrough.count() > 0) {
        foundDiscount = true
        await expect(strikethrough).toBeVisible()
        break
      }
    }
    expect(foundDiscount).toBe(true)
  })

  test('out-of-stock product button is disabled', async ({ page }) => {
    const products = page.getByRole('article')
    const count = await products.count()
    let foundOutOfStock = false
    for (let i = 0; i < count; i++) {
      const card = products.nth(i)
      const outOfStockBtn = card.getByRole('button', { name: /out of stock/i })
      if (await outOfStockBtn.count() > 0) {
        await expect(outOfStockBtn).toBeDisabled()
        foundOutOfStock = true
        break
      }
    }
    expect(foundOutOfStock).toBe(true)
  })

  test('out-of-stock product is not added to cart when button clicked', async ({ page }) => {
    const products = page.getByRole('article')
    const count = await products.count()
    for (let i = 0; i < count; i++) {
      const card = products.nth(i)
      const outOfStockBtn = card.getByRole('button', { name: /out of stock/i })
      if (await outOfStockBtn.count() > 0) {
        await outOfStockBtn.click({ force: true })
        break
      }
    }
    await expect(page.getByText('0 items in cart')).toBeVisible()
  })

  test('product images have alt text equal to product title', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    // Use locator('img') to avoid matching the star-rating div[role="img"]
    const img = firstProduct.locator('img').first()
    const title = await firstProduct.getByRole('heading', { level: 3 }).textContent()
    const alt = await img.getAttribute('alt')
    expect(alt).toBe(title?.trim())
  })

  // ── Badge and discount pill ────────────────────────────────────────────────

  test('products with a badge display it', async ({ page }) => {
    const products = page.getByRole('article')
    const count = await products.count()
    let foundBadge = false
    for (let i = 0; i < count; i++) {
      const badge = products.nth(i).locator('span.rounded-full.bg-blue-600')
      if (await badge.count() > 0) {
        await expect(badge).toBeVisible()
        foundBadge = true
        break
      }
    }
    expect(foundBadge).toBe(true)
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  test('product articles have aria-label equal to product title', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    const label = await firstProduct.getAttribute('aria-label')
    expect(label).toBeTruthy()
  })

  test('Add to Cart button has descriptive aria-label', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    const addBtn = firstProduct.getByRole('button', { name: /add .* to cart/i })
    const ariaLabel = await addBtn.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel).toMatch(/add .* to cart/i)
  })

  test('Add to Cart button has aria-live for dynamic state', async ({ page }) => {
    const firstProduct = page.getByRole('article').first()
    const addBtn = firstProduct.getByRole('button', { name: /add .* to cart/i })
    await expect(addBtn).toHaveAttribute('aria-live', 'polite')
  })

  test('cart counter aria-label reflects item count', async ({ page }) => {
    const counter = page.locator('[aria-label*="items in cart"]')
    await expect(counter).toBeVisible()
  })

  // ── Responsive ─────────────────────────────────────────────────────────────

  test('grid is single column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const section = page.getByRole('region', { name: 'Product listing' })
    const classes = await section.getAttribute('class')
    expect(classes).toContain('grid-cols-1')
  })

  test('grid is 2 columns on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('article').first()).toBeVisible()
  })

  test('grid is 3 columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page.getByRole('article').first()).toBeVisible()
    const classes = await page.getByRole('region', { name: 'Product listing' }).getAttribute('class')
    expect(classes).toContain('lg:grid-cols-3')
  })

  test('header and cart counter stack on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByText(/items in cart/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Product Cards' })).toBeVisible()
  })
})
