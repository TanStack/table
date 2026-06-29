import { afterEach, describe, expect, it, vi } from 'vitest'
import { constructTable, coreFeatures } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import {
  getTableDevtoolsTargets,
  removeTableDevtoolsTarget,
  upsertTableDevtoolsTarget,
} from '../src/tableTarget'

function createTable(key?: string) {
  return constructTable({
    features: {
      ...coreFeatures,
      coreReactivityFeature: storeReactivityBindings(),
    },
    columns: [],
    data: [],
    ...(key === undefined ? {} : { key }),
  })
}

afterEach(() => {
  for (const target of getTableDevtoolsTargets()) {
    removeTableDevtoolsTarget(target.id)
  }
  vi.restoreAllMocks()
})

describe('tableTarget', () => {
  it('registers a keyed table', () => {
    const table = createTable('users-table')

    upsertTableDevtoolsTarget({ table })

    expect(getTableDevtoolsTargets()).toEqual([
      {
        id: 'users-table',
        table,
      },
    ])
  })

  it('uses the key as the update identity', () => {
    const firstTable = createTable('users-table')
    const nextTable = createTable('users-table')

    upsertTableDevtoolsTarget({ table: firstTable })
    upsertTableDevtoolsTarget({ table: nextTable })

    expect(getTableDevtoolsTargets()).toEqual([
      {
        id: 'users-table',
        table: nextTable,
      },
    ])
  })

  it('returns a cleanup function that removes the captured key', () => {
    const table = createTable('users-table')

    const cleanup = upsertTableDevtoolsTarget({ table })
    cleanup?.()

    expect(getTableDevtoolsTargets()).toEqual([])
  })

  it('logs and skips registration when the key is missing', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const table = createTable()

    const cleanup = upsertTableDevtoolsTarget({ table })

    expect(cleanup).toBeUndefined()
    expect(getTableDevtoolsTargets()).toEqual([])
    expect(consoleError).toHaveBeenCalledWith(
      '[TanStack Table Devtools] Missing table key. Add a `key` option to your table to use devtools.',
    )
  })

  it('logs and skips registration when the key is empty', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const table = createTable('   ')

    const cleanup = upsertTableDevtoolsTarget({ table })

    expect(cleanup).toBeUndefined()
    expect(getTableDevtoolsTargets()).toEqual([])
    expect(consoleError).toHaveBeenCalledWith(
      '[TanStack Table Devtools] Missing table key. Add a `key` option to your table to use devtools.',
    )
  })

  it('removes keyed registrations directly', () => {
    const table = createTable('users-table')

    upsertTableDevtoolsTarget({ table })
    removeTableDevtoolsTarget('users-table')

    expect(getTableDevtoolsTargets()).toEqual([])
  })
})
