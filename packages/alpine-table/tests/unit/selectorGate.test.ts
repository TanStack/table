// @vitest-environment jsdom
import Alpine from 'alpinejs'
import { describe, expect, test } from 'vitest'
import { columnSizingFeature } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'

// Alpine batches effect re-runs; flush before asserting
function flushEffects() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

function trackTableReads(table: any) {
  const counter = { runs: 0 }
  Alpine.effect(() => {
    // any proxied read registers the version counter as a dependency
    void table.getAllColumns()
    counter.runs++
  })
  return counter
}

describe('createTable selector gate', () => {
  test('without a selector, any state change re-evaluates table effects', async () => {
    const table = createTable<any, any>({
      features: { columnSizingFeature },
      columns: [],
      data: [],
    })

    const counter = trackTableReads(table)
    const before = counter.runs
    table.setColumnSizing({ a: 100 })
    await flushEffects()
    expect(counter.runs).toBe(before + 1)
  })

  test('a () => ({}) selector suppresses effect re-evaluation on state changes', async () => {
    const table = createTable<any, any>(
      {
        features: { columnSizingFeature },
        columns: [],
        data: [],
      },
      () => ({}),
    )

    const counter = trackTableReads(table)
    const before = counter.runs
    table.setColumnSizing({ a: 100 })
    table.setColumnSizing({ a: 200 })
    await flushEffects()
    expect(counter.runs).toBe(before)
  })

  test('a slice selector re-evaluates only when the slice changes', async () => {
    const table = createTable<any, any>(
      {
        features: { columnSizingFeature },
        columns: [],
        data: [],
      },
      (state: any) => ({ columnSizing: state.columnSizing }),
    )

    const counter = trackTableReads(table)
    const before = counter.runs
    table.setColumnSizing({ a: 100 })
    await flushEffects()
    expect(counter.runs).toBe(before + 1)
  })

  test('atom subscriptions still fire per state change with an empty selector', () => {
    const table = createTable<any, any>(
      {
        features: { columnSizingFeature },
        columns: [],
        data: [],
      },
      () => ({}),
    )

    let notifications = 0
    table.atoms.columnSizing.subscribe(() => {
      notifications++
    })
    table.setColumnSizing({ a: 100 })
    table.setColumnSizing({ a: 200 })
    expect(notifications).toBe(2)
  })
})

describe('proxy method wrapper caching', () => {
  test('repeated reads of the same function property return the same wrapper', () => {
    const table = createTable<any, any>({
      features: { columnSizingFeature },
      columns: [],
      data: [],
    })

    expect(table.getAllColumns).toBe(table.getAllColumns)
    expect(table.setColumnSizing).toBe(table.setColumnSizing)
  })
})
