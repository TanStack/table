import { expect, type Locator, type Page } from '@playwright/test'

export async function setRangeValue(locator: Locator, value: string) {
  await locator.evaluate((element, nextValue) => {
    const input = element as HTMLInputElement
    const descriptor = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )
    descriptor?.set?.call(input, nextValue)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
}

export async function scrollTradingTable(page: Page, top: number) {
  await page.locator('[data-trading-table]').evaluate((element, nextTop) => {
    const scroller = element as HTMLElement
    scroller.scrollTop = nextTop
    scroller.dispatchEvent(new Event('scroll'))
  }, top)
}

export async function pauseTradingFeed(page: Page) {
  const toggle = page.getByTestId('feed-toggle')
  await expect(toggle).toBeVisible()
  if ((await toggle.textContent())?.includes('PAUSE')) {
    await toggle.click()
  }
  await expect(page.getByTestId('feed-status')).toHaveText('FEED PAUSED')
}

export async function resumeTradingFeed(page: Page) {
  const toggle = page.getByTestId('feed-toggle')
  await expect(toggle).toBeVisible()
  if ((await toggle.textContent())?.includes('START')) {
    await toggle.click()
  }
  await expect(page.getByTestId('feed-status')).toHaveText('FEED LIVE')
}

export function pausedFeedUrl(url: string) {
  const next = new URL(url)
  next.searchParams.set('paused', '1')
  return next.href
}

export async function selectOptionValue(locator: Locator, value: string) {
  await locator.evaluate((element, nextValue) => {
    const select = element as HTMLSelectElement
    const descriptor = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      'value',
    )
    descriptor?.set?.call(select, nextValue)
    select.dispatchEvent(new Event('input', { bubbles: true }))
    select.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
}
