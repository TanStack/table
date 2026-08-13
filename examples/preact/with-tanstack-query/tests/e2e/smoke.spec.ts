import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import path from 'node:path'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'

const exampleDir = path.resolve()

function collectPageErrors(page: Page) {
  const errors: Array<string> = []

  page.on('pageerror', (error) => {
    errors.push(error.message)
  })

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })

  return errors
}

async function openExample(page: Page) {
  const server = await startExampleServer(exampleDir)
  const errors = collectPageErrors(page)

  await page.route(
    'https://unpkg.com/react-scan/dist/auto.global.js',
    (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: '',
      }),
  )

  await page.goto(server.url)

  return { errors, server }
}

test('renders both query examples without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const useQueryExample = page.getByTestId('use-query-example')
    const useInfiniteQueryExample = page.getByTestId(
      'use-infinite-query-example',
    )

    await expect(useQueryExample.getByRole('heading')).toBeVisible()
    await expect(useInfiniteQueryExample.getByRole('heading')).toBeVisible()
    await expect(useQueryExample.locator('tbody tr').first()).toBeVisible()
    await expect(
      useInfiniteQueryExample.locator('tbody tr').first(),
    ).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('navigates finite pages with useQuery', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const example = page.getByTestId('use-query-example')
    const rows = example.locator('tbody tr')
    const nextPage = example.getByRole('button', { name: '>', exact: true })
    const lastPage = example.getByRole('button', { name: '>>', exact: true })

    await expect(rows).toHaveCount(10)
    await expect(rows.first().locator('td').first()).toHaveText('1')
    await expect(lastPage).toBeEnabled()

    await nextPage.click()

    await expect(page.getByTestId('offset-page-number')).toHaveText(
      '2 of 1,000',
    )
    await expect(rows.first().locator('td').first()).toHaveText('11')

    await lastPage.click()

    await expect(page.getByTestId('offset-page-number')).toHaveText(
      '1,000 of 1,000',
    )
    await expect(rows.first().locator('td').first()).toHaveText('9991')
    await expect(lastPage).toBeDisabled()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('navigates cursor pages and reuses cached previous pages', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const example = page.getByTestId('use-infinite-query-example')
    const rows = example.locator('tbody tr')
    const previousPage = example.getByRole('button', {
      name: '<',
      exact: true,
    })
    const nextPage = example.getByRole('button', { name: '>', exact: true })
    const lastPage = example.getByRole('button', { name: '>>', exact: true })

    await expect(rows).toHaveCount(10)
    await expect(rows.first().locator('td').first()).toHaveText('1')
    await expect(page.getByTestId('cursor-status')).toContainText(
      'Next cursor: 10',
    )
    await expect(previousPage).toBeDisabled()
    await expect(lastPage).toBeDisabled()

    await nextPage.click()

    await expect(page.getByTestId('cursor-page-number')).toHaveText('2')
    await expect(rows.first().locator('td').first()).toHaveText('11')
    await expect(page.getByTestId('cursor-status')).toContainText(
      'Next cursor: 20',
    )

    await previousPage.click()

    await expect(page.getByTestId('cursor-page-number')).toHaveText('1')
    await expect(rows.first().locator('td').first()).toHaveText('1')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
