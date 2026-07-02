import { describe, expect, test } from 'vitest'
import { columnSizingFeature } from '@tanstack/table-core'
import { TableController } from '../../src/TableController'

function createHost() {
  const host = {
    updateCount: 0,
    addController: () => {},
    requestUpdate: () => {
      host.updateCount++
    },
  }
  return host
}

describe('TableController selector gate', () => {
  test('without a selector, any state change updates the host', () => {
    const host = createHost()
    const controller = new TableController<any, any>(host)

    const table = controller.table({
      features: { columnSizingFeature },
      columns: [],
      data: [],
    })

    const before = host.updateCount
    table.setColumnSizing({ a: 100 })
    expect(host.updateCount).toBe(before + 1)
  })

  test('a () => ({}) selector suppresses host updates on state changes', () => {
    const host = createHost()
    const controller = new TableController<any, any>(host)

    const table = controller.table(
      {
        features: { columnSizingFeature },
        columns: [],
        data: [],
      },
      () => ({}),
    )

    const before = host.updateCount
    table.setColumnSizing({ a: 100 })
    table.setColumnSizing({ a: 200 })
    expect(host.updateCount).toBe(before)
  })

  test('a slice selector updates the host only when the slice changes', () => {
    const host = createHost()
    const controller = new TableController<any, any>(host)

    const table = controller.table(
      {
        features: { columnSizingFeature },
        columns: [],
        data: [],
      },
      (state: any) => ({ columnSizing: state.columnSizing }),
    )

    const before = host.updateCount
    table.setColumnSizing({ a: 100 })
    expect(host.updateCount).toBe(before + 1)

    // same value again: new object identity but shallow-equal slice contents
    // still count as a change because the slice reference changed
    table.setColumnSizing({ a: 150 })
    expect(host.updateCount).toBe(before + 2)
  })

  test('options changes always update the host, even with an empty selector', () => {
    const host = createHost()
    const controller = new TableController<any, any>(host)

    const table = controller.table(
      {
        features: { columnSizingFeature },
        columns: [],
        data: [],
      },
      () => ({}),
    )

    const before = host.updateCount
    table.setOptions((prev) => ({ ...prev, data: [{ id: 1 }] }))
    expect(host.updateCount).toBe(before + 1)
  })
})
