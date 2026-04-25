import { describe, expect, it } from 'vitest'
import { TableDevtoolsPanel } from '../src'

describe('TableDevtoolsPanel props', () => {
  it('allows standalone usage without TanStack Devtools props', () => {
    expect(<TableDevtoolsPanel />).toBeTruthy()
    expect(<TableDevtoolsPanel theme="dark" />).toBeTruthy()
    expect(<TableDevtoolsPanel devtoolsOpen={false} />).toBeTruthy()
  })
})
