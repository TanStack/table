import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TableDevtools from '../src/TableDevtools'
import {
  getTableDevtoolsTargets,
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '../src/tableTarget'
import type { TableDevtoolsTable } from '../src/tableTarget'

function createDevtoolsTable() {
  const unsubscribe = vi.fn()
  const subscribe = vi.fn(() => ({ unsubscribe }))
  const table = {
    _features: {},
    _rowModelFns: {},
    baseAtoms: {},
    initialState: {},
    options: {
      features: {},
      key: 'users-table',
    },
    reset: vi.fn(),
    store: {
      get: () => ({}),
      state: {},
      subscribe,
    },
  } satisfies TableDevtoolsTable

  return { subscribe, table, unsubscribe }
}

afterEach(() => {
  for (const target of getTableDevtoolsTargets()) {
    removeTableDevtoolsTarget(target.id)
  }
})

describe('TableDevtools panel lifecycle', () => {
  it('treats a standalone panel without devtools props as open', async () => {
    const { subscribe, table } = createDevtoolsTable()
    const cleanupTarget = upsertTableDevtoolsTarget({
      table: table as never,
    })
    const element = document.createElement('div')
    const dispose = render(() => <TableDevtools theme="dark" />, element)

    await Promise.resolve()
    expect(subscribe).toHaveBeenCalledTimes(1)

    dispose()
    cleanupTarget?.()
  })

  it('accepts the nested theme object vue-devtools currently injects', async () => {
    const { subscribe, table } = createDevtoolsTable()
    const cleanupTarget = upsertTableDevtoolsTarget({
      table: table as never,
    })
    const element = document.createElement('div')
    const dispose = render(
      () => <TableDevtools theme={{ theme: 'dark', devtoolsOpen: true }} />,
      element,
    )

    await Promise.resolve()
    expect(subscribe).toHaveBeenCalledTimes(1)

    dispose()
    cleanupTarget?.()
  })

  it('subscribes only while the devtools panel is open', async () => {
    const { subscribe, table, unsubscribe } = createDevtoolsTable()
    const cleanupTarget = upsertTableDevtoolsTarget({
      table: table as never,
    })
    const [open, setOpen] = createSignal(false)
    const element = document.createElement('div')
    const dispose = render(
      () => <TableDevtools devtoolsOpen={open()} theme="dark" />,
      element,
    )

    await Promise.resolve()
    expect(subscribe).not.toHaveBeenCalled()

    setOpen(true)
    await Promise.resolve()
    expect(subscribe).toHaveBeenCalledTimes(1)

    setOpen(false)
    await Promise.resolve()
    expect(unsubscribe).toHaveBeenCalledTimes(1)

    dispose()
    cleanupTarget?.()
  })
})
