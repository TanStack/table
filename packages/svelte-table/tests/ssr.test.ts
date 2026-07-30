// @vitest-environment node

import { describe, expect, test } from 'vitest'
import { render } from 'svelte/server'
import SsrHarness from './fixtures/SsrHarness.svelte'

describe('Svelte adapter SSR', () => {
  test('renders table state and each FlexRender cell mode without a DOM', () => {
    const { body } = render(SsrHarness)

    expect(body).toContain('{"1":true}')
    expect(body).toContain('cell:Ada')
    expect(body).toContain('aggregate:Ada')
    expect(body).not.toContain('should-not-render')
  })
})
