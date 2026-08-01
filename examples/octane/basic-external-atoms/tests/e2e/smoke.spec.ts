import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

function collectPageErrors(page: Page) {
  const errors: Array<string> = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

async function openExample(page: Page) {
  const server = await startExampleServer(exampleDir)
  const errors = collectPageErrors(page)
  await page.goto(server.url)
  return { errors, server }
}

test('updates pagination atom and row model without errors', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)
  try {
    const status = page.getByText(/^Page$/).locator('..')
    const first = await page.locator('tbody tr').first().innerText()
    await expect(status).toContainText('1 of 100')
    const timing = await page
      .getByRole('button', { name: '>', exact: true })
      .evaluate((button) => {
        const started = performance.now()
        ;(button as HTMLButtonElement).click()
        return {
          elapsed: performance.now() - started,
          status: document.querySelector('.controls strong')?.textContent,
        }
      })
    expect(timing.status).toContain('2 of 100')
    expect(timing.elapsed).toBeLessThan(250)
    await expect
      .poll(() => page.locator('tbody tr').first().innerText())
      .not.toBe(first)

    const sortTiming = await page
      .locator('.sortable-header')
      .first()
      .evaluate((header) => {
        const started = performance.now()
        ;(header as HTMLElement).click()
        return {
          elapsed: performance.now() - started,
          text: header.textContent,
        }
      })
    expect(sortTiming.text).toContain('🔼')
    expect(sortTiming.elapsed).toBeLessThan(250)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
