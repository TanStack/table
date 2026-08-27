import type { Locator, Page } from '@playwright/test'

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
