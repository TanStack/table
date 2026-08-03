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
  // The unit of parallelism is the spec file, not the test. Each example's spec
  // starts one dev server in `beforeAll` and shares it across its tests; with
  // `fullyParallel` every test becomes its own job, so CI's two workers would
  // split a single file and start that server twice.
  fullyParallel: false,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'off',
  },
  projects: [
    {
      name: getProjectName(),
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
