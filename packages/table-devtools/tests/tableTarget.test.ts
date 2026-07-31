import { afterEach, describe, expect, it, vi } from 'vitest'
import { constructTable, coreFeatures } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import {
  createTableDevtoolsRegistrationManager,
  getTableDevtoolsTargets,
  removeTableDevtoolsTarget,
  subscribeTableDevtoolsTargets,
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

  it('does not let stale cleanup remove a replacement table', () => {
    const firstTable = createTable('users-table')
    const nextTable = createTable('users-table')

    const cleanupFirst = upsertTableDevtoolsTarget({ table: firstTable })
    const cleanupNext = upsertTableDevtoolsTarget({ table: nextTable })

    cleanupFirst?.()

    expect(getTableDevtoolsTargets()).toEqual([
      {
        id: 'users-table',
        table: nextTable,
      },
    ])

    cleanupNext?.()
    expect(getTableDevtoolsTargets()).toEqual([])
  })

  it('keeps a shared table registered until its final lease is released', () => {
    const table = createTable('users-table')

    const cleanupFirst = upsertTableDevtoolsTarget({ table })
    const cleanupSecond = upsertTableDevtoolsTarget({ table })

    cleanupFirst?.()
    expect(getTableDevtoolsTargets()).toHaveLength(1)

    cleanupSecond?.()
    expect(getTableDevtoolsTargets()).toEqual([])
  })

  it('replaces a managed registration without publishing an empty registry', () => {
    const manager = createTableDevtoolsRegistrationManager()
    const firstTable = createTable('users-table')
    const nextTable = createTable('users-table')

    manager.update(firstTable)

    const targetCounts: Array<number> = []
    const unsubscribe = subscribeTableDevtoolsTargets((targets) => {
      targetCounts.push(targets.length)
    })

    manager.update(nextTable)

    expect(targetCounts).toEqual([1, 1])
    expect(getTableDevtoolsTargets()).toEqual([
      {
        id: 'users-table',
        table: nextTable,
      },
    ])

    manager.dispose()

    expect(targetCounts).toEqual([1, 1, 0])
    unsubscribe()
  })

  it('updates transient wrappers without publishing a new target', () => {
    const manager = createTableDevtoolsRegistrationManager()
    const table = createTable('users-table')
    const firstWrapper = {
      ...table,
      options: {
        ...table.options,
        debugAll: false,
      },
    }
    const nextWrapper = {
      ...table,
      options: {
        ...table.options,
        debugAll: true,
      },
    }

    manager.update(firstWrapper)

    const listener = vi.fn()
    const unsubscribe = subscribeTableDevtoolsTargets(listener)

    manager.update(nextWrapper)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(getTableDevtoolsTargets()[0]?.table).toBe(firstWrapper)
    expect(getTableDevtoolsTargets()[0]?.table.options.debugAll).toBe(true)

    unsubscribe()
    manager.dispose()
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

  it('exposes a reactive resolved-options version to devtools', () => {
    const table = createTable('users-table')
    upsertTableDevtoolsTarget({ table })

    const target = getTableDevtoolsTargets()[0]!.table
    const snapshotVersion = target.optionAtoms.snapshotVersion
    expect(snapshotVersion.get()).toBe(0)

    const versions: Array<number> = []
    const subscription = snapshotVersion.subscribe((version) => {
      versions.push(version)
    })

    table.setOptions((previous) => ({
      ...previous,
      debugAll: true,
    }))

    expect(snapshotVersion.get()).toBe(1)
    expect(versions).toEqual([1])
    expect(target.options.debugAll).toBe(true)

    subscription.unsubscribe()
  })

  it('removes keyed registrations directly', () => {
    const table = createTable('users-table')

    upsertTableDevtoolsTarget({ table })
    removeTableDevtoolsTarget('users-table')

    expect(getTableDevtoolsTargets()).toEqual([])
  })
})
