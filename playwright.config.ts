import { defineConfig, devices } from '@playwright/test'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: 'packages/balance-api/.env', override: false })

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: [
    {
      command: 'npm run start:frontend',
      url: 'http://localhost:4173',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      cwd: process.cwd(),
      stdout: 'pipe',
      stderr: 'pipe'
    },
    {
      command: 'node packages/balance-api/dist/main.js',
      url: 'http://localhost:3000/health',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      env: { INFURA_URL: process.env.INFURA_URL },
      cwd: process.cwd(),
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
})
