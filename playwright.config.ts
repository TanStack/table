import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'

const testDir = process.env.PLAYWRIGHT_TEST_DIR ?? './tests/e2e'

// Every example runs its own Playwright process with PLAYWRIGHT_TEST_DIR set to
// `<example>/tests/e2e`, so name the project after the example. Without this,
// each reporter line reads `[chromium] > smoke.spec.ts` and a failure in the
// release audit job does not say which of the ~343 examples broke.
function getProjectName() {
  if (!process.env.PLAYWRIGHT_TEST_DIR) return 'chromium'

  const exampleDir = path.resolve(testDir, '..', '..')

  return `${path.basename(path.dirname(exampleDir))}/${path.basename(exampleDir)}`
}

export default defineConfig({
  testDir,
  // Separate Playwright processes must never clean each other's traces/results.
  outputDir: path.join(import.meta.dirname, 'test-results', getProjectName()),
  // Keep each spec serial: examples may share a dev server across its tests.
  // Nx schedules separate example processes.
  fullyParallel: false,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 1 : 0,
  // Nx owns concurrency; each example gets one browser worker.
  workers: 1,
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: getProjectName(),
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
