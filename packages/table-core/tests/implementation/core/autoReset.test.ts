import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
} from '../../../src'
import { testFeatures } from '../../fixtures/features'
import type { ColumnDef, ExpandedState, TableOptions } from '../../../src'

/**
 * End-to-end tests for the autoReset wiring.
 *
 * autoReset callbacks are `onAfterUpdate` hooks on the row model stage memos.
 * They are dispatched via `table._reactivity.schedule(() => untrack(...))`,
 * i.e. deferred to a microtask/timeout AFTER a stage memo recomputes. Memo
 * recomputation is pull-based: it only happens when someone reads the row
 * model getter. These tests exercise the whole chain rather than calling the
 * `table_autoReset*` statics directly.
 */

interface Person {
  name: string
  age: number
  group: string
  subRows?: Array<Person>
}

const features = testFeatures({
  columnFilteringFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  sortFns,
})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { accessorKey: 'name', id: 'name' },
  { accessorKey: 'age', id: 'age' },
  { accessorKey: 'group', id: 'group' },
]

function makeData(): Array<Person> {
  return Array.from({ length: 6 }, (_, i) => ({
    name: `person-${i}`,
    age: 20 + i,
    group: i % 2 === 0 ? 'even' : 'odd',
    subRows: [{ name: `child-${i}`, age: 1, group: 'child' }],
  }))
}

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0))

function makeTable(
  options?: Partial<TableOptions<typeof features, Person>> & {
    initialExpanded?: ExpandedState
    initialPageIndex?: number
  },
) {
  const { initialExpanded, initialPageIndex, ...rest } = options ?? {}
  return constructTable<typeof features, Person>({
    features,
    columns,
    data: makeData(),
    getSubRows: (row) => row.subRows,
    initialState: {
      pagination: { pageIndex: initialPageIndex ?? 0, pageSize: 2 },
      ...(initialExpanded ? { expanded: initialExpanded } : {}),
    },
    ...rest,
  })
}

// Pull the row model once and flush so the initial memo runs (which itself
// schedules autoReset callbacks) do not interfere with the test assertions.
async function primeTable(table: ReturnType<typeof makeTable>) {
  table.getRowModel()
  await flushMicrotasks()
  await flushMicrotasks()
}

describe('autoResetPageIndex end-to-end wiring', () => {
  it('should reset pageIndex when data changes via setOptions', async () => {
    const table = makeTable()
    await primeTable(table)

    table.setPageIndex(2)
    expect(table.atoms.pagination.get().pageIndex).toBe(2)

    table.setOptions((old) => ({ ...old, data: makeData() }))
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })

  it('should reset pageIndex when column filters change', async () => {
    const table = makeTable()
    await primeTable(table)

    table.setPageIndex(2)
    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })

  it('should reset pageIndex when sorting changes', async () => {
    const table = makeTable()
    await primeTable(table)

    table.setPageIndex(2)
    table.setSorting([{ id: 'age', desc: true }])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })

  it('should reset pageIndex when grouping changes', async () => {
    const table = makeTable()
    await primeTable(table)

    table.setPageIndex(2)
    table.setGrouping(['group'])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })

  it('should reset pageIndex to 0, not to initialState.pageIndex', async () => {
    const table = makeTable({ initialPageIndex: 1 })
    await primeTable(table)

    table.setPageIndex(2)
    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()

    // table_autoResetPageIndex calls table_resetPageIndex(table, true), which
    // resets to the feature default page 0, not the seeded initial page 1.
    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })

  it('should not reset pageIndex until a row model is actually pulled', async () => {
    const table = makeTable()
    await primeTable(table)

    table.setPageIndex(2)
    table.setColumnFilters([{ id: 'group', value: 'even' }])

    // No row model read: the stage memos are lazy (pull-based), so nothing
    // has recomputed and no autoReset callback has been scheduled. This is
    // by design of lazy memos; pinned here on purpose.
    await flushMicrotasks()
    expect(table.atoms.pagination.get().pageIndex).toBe(2)

    // Pulling the row model recomputes the filtered stage, which schedules
    // the reset for the next microtask flush.
    table.getRowModel()
    await flushMicrotasks()
    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })

  it('should not reset pageIndex for state changes that do not recompute row model stages', async () => {
    const table = makeTable()
    await primeTable(table)

    table.setPageIndex(2)
    table.setRowSelection({ '0': true })
    table.getRowModel()
    await flushMicrotasks()

    // Row selection is not a dependency of the core, filtered, sorted, or
    // grouped stage memos, so no onAfterUpdate hook fires.
    expect(table.atoms.pagination.get().pageIndex).toBe(2)
  })

  describe('option precedence', () => {
    async function triggerReset(table: ReturnType<typeof makeTable>) {
      await primeTable(table)
      table.setPageIndex(2)
      table.setColumnFilters([{ id: 'group', value: 'even' }])
      table.getRowModel()
      await flushMicrotasks()
    }

    it('should skip the reset when autoResetAll is false', async () => {
      const table = makeTable({ autoResetAll: false })
      await triggerReset(table)
      expect(table.atoms.pagination.get().pageIndex).toBe(2)
    })

    it('should force the reset when autoResetAll is true even with manualPagination', async () => {
      const table = makeTable({ autoResetAll: true, manualPagination: true })
      await triggerReset(table)
      expect(table.atoms.pagination.get().pageIndex).toBe(0)
    })

    it('should skip the reset when autoResetPageIndex is false', async () => {
      const table = makeTable({ autoResetPageIndex: false })
      await triggerReset(table)
      expect(table.atoms.pagination.get().pageIndex).toBe(2)
    })

    it('should opt back in with autoResetPageIndex true despite manualPagination', async () => {
      const table = makeTable({
        autoResetPageIndex: true,
        manualPagination: true,
      })
      await triggerReset(table)
      expect(table.atoms.pagination.get().pageIndex).toBe(0)
    })

    it('should skip the reset by default when manualPagination is true', async () => {
      const table = makeTable({ manualPagination: true })
      await triggerReset(table)
      expect(table.atoms.pagination.get().pageIndex).toBe(2)
    })
  })
})

describe('autoResetExpanded end-to-end wiring', () => {
  it('should reset expanded to an empty map when grouping changes', async () => {
    const table = makeTable()
    await primeTable(table)

    table.getRow('1').toggleExpanded(true)
    expect(table.atoms.expanded.get()).toEqual({ '1': true })

    table.setGrouping(['group'])
    table.getRowModel()
    // table_autoResetExpanded itself schedules another callback, so the reset
    // is double-deferred: flush twice to be safe.
    await flushMicrotasks()
    await flushMicrotasks()

    expect(table.atoms.expanded.get()).toEqual({})
  })

  it('should reset expanded to a seeded initialState.expanded when grouping changes', async () => {
    const table = makeTable({ initialExpanded: { '0': true } })
    await primeTable(table)

    table.getRow('1').toggleExpanded(true)
    expect(table.atoms.expanded.get()).toEqual({
      '0': true,
      '1': true,
    })

    table.setGrouping(['group'])
    table.getRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    // Unlike pageIndex (which resets to the feature default 0), expanded
    // resets back to initialState.expanded.
    expect(table.atoms.expanded.get()).toEqual({ '0': true })
  })

  it('should not reset expanded when only sorting changes', async () => {
    const table = makeTable()
    await primeTable(table)

    table.getRow('1').toggleExpanded(true)
    table.setSorting([{ id: 'age', desc: true }])
    table.getRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    // Only createGroupedRowModel wires table_autoResetExpanded, and the
    // pipeline order is core -> filtered -> grouped -> sorted -> expanded ->
    // paginated. Sorting is downstream of grouping, so a sorting change never
    // recomputes the grouped memo and expanded state is preserved.
    expect(table.atoms.expanded.get()).toEqual({ '1': true })
  })

  it('should reset expanded when column filters change (grouped stage is downstream of filtering)', async () => {
    const table = makeTable()
    await primeTable(table)

    table.getRow('1').toggleExpanded(true)
    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    // Pinned CURRENT behavior: even though table_autoResetExpanded is wired
    // only from createGroupedRowModel, the grouped memo depends on
    // getPreGroupedRowModel() (the filtered model). Any upstream change
    // (data or filters) recomputes the grouped memo even when no grouping is
    // active, so filter changes also reset expanded state.
    expect(table.atoms.expanded.get()).toEqual({})
  })

  describe('option precedence', () => {
    async function triggerReset(table: ReturnType<typeof makeTable>) {
      await primeTable(table)
      table.getRow('1').toggleExpanded(true)
      table.setGrouping(['group'])
      table.getRowModel()
      await flushMicrotasks()
      await flushMicrotasks()
    }

    it('should skip the reset when autoResetAll is false', async () => {
      const table = makeTable({ autoResetAll: false })
      await triggerReset(table)
      expect(table.atoms.expanded.get()).toEqual({ '1': true })
    })

    it('should force the reset when autoResetAll is true even with manualExpanding', async () => {
      const table = makeTable({ autoResetAll: true, manualExpanding: true })
      await triggerReset(table)
      expect(table.atoms.expanded.get()).toEqual({})
    })

    it('should skip the reset when autoResetExpanded is false', async () => {
      const table = makeTable({ autoResetExpanded: false })
      await triggerReset(table)
      expect(table.atoms.expanded.get()).toEqual({ '1': true })
    })

    it('should opt back in with autoResetExpanded true despite manualExpanding', async () => {
      const table = makeTable({
        autoResetExpanded: true,
        manualExpanding: true,
      })
      await triggerReset(table)
      expect(table.atoms.expanded.get()).toEqual({})
    })

    it('should skip the reset by default when manualExpanding is true', async () => {
      const table = makeTable({ manualExpanding: true })
      await triggerReset(table)
      expect(table.atoms.expanded.get()).toEqual({ '1': true })
    })
  })
})
