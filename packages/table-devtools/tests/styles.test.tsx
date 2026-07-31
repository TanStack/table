import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { ThemeContextProvider } from '@tanstack/devtools-ui'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { css } = vi.hoisted(() => ({
  css: vi.fn(() => 'generated-class'),
}))

vi.mock('goober', () => ({
  css,
}))

beforeEach(() => {
  css.mockClear()
})

describe('useStyles', () => {
  it('generates each theme once across consumers', async () => {
    const { useStyles } = await import('../src/styles/use-styles')
    const [theme, setTheme] = createSignal<'light' | 'dark'>('dark')

    function Consumer() {
      useStyles()
      useStyles()
      return null
    }

    const element = document.createElement('div')
    const dispose = render(
      () => (
        <ThemeContextProvider theme={theme()}>
          <Consumer />
        </ThemeContextProvider>
      ),
      element,
    )

    expect(css).toHaveBeenCalledTimes(51)

    setTheme('light')
    await Promise.resolve()
    expect(css).toHaveBeenCalledTimes(102)

    setTheme('dark')
    await Promise.resolve()
    expect(css).toHaveBeenCalledTimes(102)

    dispose()
  })
})
