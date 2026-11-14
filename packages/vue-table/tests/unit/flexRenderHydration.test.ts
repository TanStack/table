// @vitest-environment jsdom

import { afterEach, describe, expect, test, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { FlexRender, flexRender } from '../../src/FlexRender'

afterEach(() => {
  vi.restoreAllMocks()
})

function makeApp(cellValue: string) {
  return defineComponent({
    setup() {
      return () =>
        h('table', [
          h('tbody', [
            h('tr', [h('td', [h(FlexRender, { render: cellValue })])]),
          ]),
        ])
    },
  })
}

describe('FlexRender hydration', () => {
  test('renders nothing for an empty string', () => {
    expect(flexRender('', {})).toBeNull()
    expect(flexRender(() => '', {})).toBeNull()
  })

  test('hydrates an empty string cell without a mismatch', async () => {
    const App = makeApp('')
    const html = await renderToString(createSSRApp(App))
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const container = document.createElement('div')

    container.innerHTML = html
    createSSRApp(App).mount(container, true)

    const messages = [...warn.mock.calls, ...error.mock.calls].map((args) =>
      String(args[0]),
    )

    expect(messages.filter((message) => message.includes('Hydration'))).toEqual(
      [],
    )
  })
})
