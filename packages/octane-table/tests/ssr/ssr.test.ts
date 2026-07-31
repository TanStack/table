import { renderToString } from 'octane/server'
import { describe, expect, it } from 'vitest'
import { SsrTable } from '../_fixtures/ssr-table.tsrx'

describe('Octane table SSR', () => {
  it('renders selected table state and FlexRender content without a DOM', () => {
    expect(globalThis.document).toBeUndefined()

    const { html } = renderToString(SsrTable, {})
    const visibleHtml = html.replace(/<!--.*?-->/g, '')

    expect(visibleHtml).toContain('id="ssr-state">2</output>')
    expect(visibleHtml).toContain(
      'id="ssr-direct"><strong>Person</strong></div>',
    )
    expect(visibleHtml).toContain('<em>Ada</em>')
    expect(visibleHtml).toContain('<td>37</td>')
  })
})
