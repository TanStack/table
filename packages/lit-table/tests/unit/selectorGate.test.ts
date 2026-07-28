import { describe, expect, test } from 'vitest'
import { columnSizingFeature, rowSortingFeature } from '@tanstack/table-core'
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

  test('options passed to a new render pass are readable in that same pass', () => {
    const host = createHost()
    const controller = new TableController<any, any>(host)

    const baseOptions = {
      features: { columnSizingFeature },
      columns: [],
      data: [] as Array<{ id: number }>,
    }
    controller.table(baseOptions, () => ({}))

    const before = host.updateCount
    // Options changes flow through host renders (lit reactive properties), so
    // the render pass that hands in new options reads them immediately — no
    // store-driven host update is needed or scheduled.
    const table = controller.table(
      { ...baseOptions, data: [{ id: 1 }] },
      () => ({}),
    )
    expect(table.options.data).toEqual([{ id: 1 }])
    expect(host.updateCount).toBe(before)
  })

  test('hostUpdated publishes captured controlled state to store subscribers', () => {
    const host = createHost()
    const controller = new TableController<any, any>(host)

    const initialSorting = [{ id: 'a', desc: false }]
    const baseOptions = {
      features: { rowSortingFeature },
      columns: [],
      data: [],
    }
    const table = controller.table(
      { ...baseOptions, state: { sorting: initialSorting } },
      () => ({}),
    )

    const nextSorting = [{ id: 'b', desc: true }]
    const notifications: Array<unknown> = []
    const subscription = table.store.subscribe((state: any) => {
      notifications.push(state.sorting)
    })

    controller.table(
      { ...baseOptions, state: { sorting: nextSorting } },
      () => ({}),
    )

    // The render pass reads the new controlled value through the atoms, but
    // nothing is published (and no subscriber notified) until the host
    // commits.
    expect(table.atoms.sorting.get()).toBe(nextSorting)
    expect(table.baseAtoms.sorting.get()).toEqual(initialSorting)
    expect(notifications).toEqual([])

    controller.hostUpdated()

    expect(table.baseAtoms.sorting.get()).toBe(nextSorting)
    expect(notifications).toEqual([nextSorting])

    subscription.unsubscribe()
  })
})
