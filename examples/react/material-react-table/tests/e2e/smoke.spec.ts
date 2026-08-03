import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

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

async function getFirstEmailText(page: Page) {
  const text = await page.getByText(/@/).first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    await expect(
      page.getByRole('heading', { name: /Material React Table/i }),
    ).toBeVisible()
    await expect(page.getByText('First Name').first()).toBeVisible()
    await expect(page.getByText('Last Name').first()).toBeVisible()
    await expect(page.getByText('Email').first()).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('regenerates table data', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const regenerateButton = page.getByRole('button', {
      name: /^Regenerate Data$/i,
    })

    await expect(regenerateButton).toBeVisible()

    const firstEmailBefore = await getFirstEmailText(page)

    await regenerateButton.click()

    await expect.poll(() => getFirstEmailText(page)).not.toBe(firstEmailBefore)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('paginates without resetting to the first page', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const firstEmailBefore = await getFirstEmailText(page)

    await page.getByRole('button', { name: /go to next page/i }).click()

    await expect(page.getByText('11-20 of 50')).toBeVisible()
    await expect.poll(() => getFirstEmailText(page)).not.toBe(firstEmailBefore)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('updates the sort direction indicator', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const firstNameHeader = page
      .locator('thead th')
      .filter({ hasText: 'First Name' })
    const sortTarget = firstNameHeader.locator(
      '.Mui-TableHeadCell-Content-Labels',
    )
    const sortLabel = firstNameHeader.locator('.MuiTableSortLabel-root')

    await sortTarget.click()
    await expect(firstNameHeader).toHaveAttribute('aria-sort', 'ascending')
    await expect(firstNameHeader).toHaveAttribute('data-sort', 'asc')
    await expect(sortLabel).toHaveClass(/MuiTableSortLabel-directionAsc/)
    await expect(sortLabel).toHaveAttribute(
      'aria-label',
      'Sorted by First Name ascending',
    )

    await sortTarget.click()
    await expect(firstNameHeader).toHaveAttribute('aria-sort', 'descending')
    await expect(firstNameHeader).toHaveAttribute('data-sort', 'desc')
    await expect(sortLabel).toHaveClass(/MuiTableSortLabel-directionDesc/)
    await expect(sortLabel).toHaveAttribute(
      'aria-label',
      'Sorted by First Name descending',
    )
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('shows column filters without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    await page.getByRole('button', { name: 'Show/Hide filters' }).click()

    await expect(
      page.getByRole('textbox', { name: 'Filter by First Name' }),
    ).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('opens the edit row modal without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    await page.getByRole('button', { name: 'Row Actions' }).first().click()
    await page.getByRole('menuitem', { name: 'Edit', exact: true }).click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: 'First Name' }),
    ).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('groups and ungroups a column without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const openFirstNameColumnMenu = async () => {
      await page
        .locator('thead th')
        .filter({ hasText: 'First Name' })
        .getByRole('button', { name: 'Column Actions' })
        .click()
    }

    await openFirstNameColumnMenu()
    await page.getByRole('menuitem', { name: 'Group by First Name' }).click()
    await expect(page.getByRole('button', { name: 'Expand all' })).toBeVisible()

    await openFirstNameColumnMenu()
    await page.getByRole('menuitem', { name: 'Ungroup by First Name' }).click()
    await expect(page.getByRole('button', { name: 'Expand all' })).toHaveCount(
      0,
    )
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
