import { test, expect } from '@playwright/test'

/**
 * Happy path E2E test for the Ethereum Balance Checker
 */
test('can check Ethereum address balance successfully', async ({ page }) => {
  // Vitalik Buterin's Ethereum address
  const validEthAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

  // Step 1: Load the application
  await page.goto('/')
  await expect(page).toHaveTitle(/Ethereum Balance/)
  await expect(page.locator('a[href="/"]')).toBeVisible()

  // Step 2: Enter a valid Ethereum address and submit
  const addressInput = page.getByRole('textbox')
  await addressInput.fill(validEthAddress)
  await page.getByRole('button', { name: /check/i }).click()

  // Step 3: Verify results appear after loading completes
  await expect(page.getByText(/loading/i)).not.toBeVisible({ timeout: 10000 })

  // Verify token cards are displayed
  const tokenCards = page.locator('.overflow-hidden')
  await expect(tokenCards.first()).toBeVisible()
  expect(await tokenCards.count()).toBeGreaterThan(0)

  // Step 4: Test theme toggle functionality
  const themeToggle = page.getByRole('button', { name: /toggle theme/i })
  
  // Toggle to dark mode
  await expect(page.locator('html')).toHaveAttribute('class', /light/)
  await themeToggle.click()
  await expect(page.locator('html')).toHaveAttribute('class', /dark/)
  
  // Toggle back to light mode
  await themeToggle.click()
  await expect(page.locator('html')).toHaveAttribute('class', /light/)
})
