// @vitest-environment jsdom
import { describe, expect, test, vi } from 'vitest'
import { createVanillaTable, fuzzyFilterFn, Virtualizer } from '../../src/index'

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('createVanillaTable adapter', () => {
  const data = [
    { id: 1, name: 'Alice Smith', role: 'Developer' },
    { id: 2, name: 'Bob Jones', role: 'Designer' },
  ]
  const columns = [
    { accessorKey: 'name', id: 'name', header: 'Name' },
    { accessorKey: 'role', id: 'role', header: 'Role' },
  ]

  test('creates a valid table instance and runs initial subscriber tick', () => {
    const table = createVanillaTable({
      data,
      columns,
      getCoreRowModel: (t) => {
        const rows = data.map((item, index) => ({
          id: String(index),
          original: item,
          getValue: (colId: string) => item[colId as keyof typeof item],
        }))
        return {
          rows,
          flatRows: rows,
          rowsById: rows.reduce((acc, row) => ({ ...acc, [row.id]: row }), {}),
        } as any
      },
      state: {},
    })

    let stateCallCount = 0
    let lastState: any = null

    const unsubscribe = table.subscribe((state) => {
      stateCallCount++
      lastState = state
    })

    expect(stateCallCount).toBe(1)
    expect(lastState).toBeDefined()

    unsubscribe()
  })

  test('notifies subscribers on state changes', () => {
    const table = createVanillaTable({
      data,
      columns,
      getCoreRowModel: (t) => ({ rows: [], flatRows: [], rowsById: {} }) as any,
      state: {
        pagination: { pageIndex: 0, pageSize: 10 },
      },
    })

    let stateCallCount = 0
    let pageIndexVal = 0

    const unsubscribe = table.subscribe((state) => {
      stateCallCount++
      pageIndexVal = state.pagination?.pageIndex ?? 0
    })

    expect(stateCallCount).toBe(1)
    expect(pageIndexVal).toBe(0)

    table.setPageIndex(2)

    expect(stateCallCount).toBe(2)
    expect(pageIndexVal).toBe(2)

    unsubscribe()
  })
})

describe('fuzzyFilterFn utility', () => {
  test('correctly evaluates and ranks matches using match-sorter-utils', () => {
    const row = {
      getValue: (colId: string) => 'Olivia Smith',
    } as any

    const addMeta = vi.fn()

    const isMatch = fuzzyFilterFn(row, 'name', 'os', addMeta)

    expect(isMatch).toBe(true)
    expect(addMeta).toHaveBeenCalled()
  })

  test('rejects non-matching search queries', () => {
    const row = {
      getValue: (colId: string) => 'Olivia Smith',
    } as any

    const addMeta = vi.fn()

    const isMatch = fuzzyFilterFn(row, 'name', 'xyz', addMeta)

    expect(isMatch).toBe(false)
  })
})

describe('Virtualizer utility', () => {
  test('computes total scroll heights and retrieves items', () => {
    const virtualizer = new Virtualizer({
      count: 100,
      getScrollElement: () => {
        const dummy = document.createElement('div')
        Object.defineProperty(dummy, 'scrollTop', {
          value: 200,
          writable: true,
        })
        Object.defineProperty(dummy, 'clientHeight', {
          value: 400,
          writable: true,
        })
        return dummy
      },
      estimateSize: (index) => 50,
      overscan: 2,
    })

    expect(virtualizer.getTotalSize()).toBe(5000)

    const items = virtualizer.getVirtualItems()
    expect(items.length).toBeGreaterThan(0)
    expect(items[0].start).toBe(50 * items[0].index)

    virtualizer.destroy()
  })
})
