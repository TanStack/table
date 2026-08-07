import { describe, expect, it } from 'vitest'
import { resolvePanelProps } from '../src/TableDevtools'

describe('TableDevtoolsPanel props', () => {
  it('treats a standalone panel without devtools props as open', () => {
    expect(resolvePanelProps()).toEqual({
      theme: 'dark',
      devtoolsOpen: true,
    })
  })

  it('preserves an explicit closed state from the devtools plugin', () => {
    expect(resolvePanelProps({ devtoolsOpen: false })).toEqual({
      theme: 'dark',
      devtoolsOpen: false,
    })
  })
})
