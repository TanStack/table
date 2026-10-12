import { describe, expect, it, vi } from 'vitest'
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
  functionalUpdate,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
} from '../../../src'
import { testFeatures } from '../../fixtures/features'
import type {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
  TableOptions,
} from '../../../src'

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
    initialSorting?: SortingState
  },
) {
  const { initialExpanded, initialPageIndex, initialSorting, ...rest } =
    options ?? {}
  return constructTable<typeof features, Person>({
    features,
    columns,
    data: makeData(),
    getSubRows: (row) => row.subRows,
    initialState: {
      pagination: { pageIndex: initialPageIndex ?? 0, pageSize: 2 },
      ...(initialExpanded ? { expanded: initialExpanded } : {}),
      ...(initialSorting ? { sorting: initialSorting } : {}),
    },
    ...rest,
  })
}

// Pull the row model once and flush so each stage memo records its initial
// inputs. Auto-resets skip the first computation (it is not a change), so a
// table must be primed before a change can trigger a reset.
async function primeTable(table: { getRowModel: () => unknown }) {
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

  it('should not reset pageIndex when only the column definitions reference changes', async () => {
    const table = makeTable()
    await primeTable(table)

    table.setPageIndex(2)
    table.setOptions((old) => ({
      ...old,
      columns: [...old.columns],
    }))
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(2)
  })

  describe('option precedence', () => {
    // Page 1 stays valid after the `even` filter (3 rows / pageSize 2 = 2
    // pages), so "skipped" (stays 1) is distinguishable from "reset" (0)
    // without landing on a page that no longer exists.
    async function triggerReset(table: ReturnType<typeof makeTable>) {
      await primeTable(table)
      table.setPageIndex(1)
      table.setColumnFilters([{ id: 'group', value: 'even' }])
      table.getRowModel()
      await flushMicrotasks()
    }

    it('should skip the reset when autoResetAll is false', async () => {
      const table = makeTable({ autoResetAll: false })
      await triggerReset(table)
      expect(table.atoms.pagination.get().pageIndex).toBe(1)
    })

    it('should force the reset when autoResetAll is true even with manualPagination', async () => {
      const table = makeTable({ autoResetAll: true, manualPagination: true })
      await triggerReset(table)
      expect(table.atoms.pagination.get().pageIndex).toBe(0)
    })

    it('should skip the reset when autoResetPageIndex is false', async () => {
      const table = makeTable({ autoResetPageIndex: false })
      await triggerReset(table)
      expect(table.atoms.pagination.get().pageIndex).toBe(1)
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
      expect(table.atoms.pagination.get().pageIndex).toBe(1)
    })
  })
})

describe('pageIndex clamp when the page-index auto-reset is disabled (#4994)', () => {
  // makeTable(): 6 rows, pageSize 2 -> 3 pages (0, 1, 2).
  async function onLastPage(table: ReturnType<typeof makeTable>) {
    await primeTable(table)
    table.setPageIndex(2)
    expect(table.atoms.pagination.get().pageIndex).toBe(2)
  }

  it('clamps to the last page when data shrinks', async () => {
    const table = makeTable({ autoResetPageIndex: false })
    await onLastPage(table)

    // 3 rows -> 2 pages (0, 1)
    table.setOptions((old) => ({ ...old, data: makeData().slice(0, 3) }))
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(1)
    expect(table.getRowModel().rows.length).toBeGreaterThan(0)
  })

  it('clamps to the last page when a filter shrinks the rows', async () => {
    const table = makeTable({ autoResetPageIndex: false })
    await onLastPage(table)

    // `even` keeps 3 rows -> 2 pages (0, 1)
    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(1)
    expect(table.getRowModel().rows.length).toBeGreaterThan(0)
  })

  it('clamps when autoResetAll is false', async () => {
    const table = makeTable({ autoResetAll: false })
    await onLastPage(table)

    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(1)
  })

  it('clamps to page 0 when every row is removed', async () => {
    const table = makeTable({ autoResetPageIndex: false })
    await onLastPage(table)

    table.setOptions((old) => ({ ...old, data: [] }))
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })

  it('does not touch an in-range pageIndex', async () => {
    const table = makeTable({ autoResetPageIndex: false })
    await primeTable(table)
    table.setPageIndex(1)

    // `even` keeps 2 pages, so page 1 still exists
    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(1)
  })

  it('does not call onPaginationChange for an in-range pageIndex', async () => {
    const onPaginationChange = vi.fn()
    const table = makeTable({
      autoResetPageIndex: false,
      state: { pagination: { pageIndex: 2, pageSize: 2 } },
      onPaginationChange,
    })
    await primeTable(table)

    // New data reference, same 6 rows -> still 3 pages, page 2 is valid
    table.setOptions((old) => ({ ...old, data: makeData() }))
    table.getRowModel()
    await flushMicrotasks()

    expect(onPaginationChange).not.toHaveBeenCalled()
  })

  it('pushes the clamp through onPaginationChange for controlled state', async () => {
    const onPaginationChange = vi.fn()
    const table = makeTable({
      autoResetPageIndex: false,
      state: { pagination: { pageIndex: 2, pageSize: 2 } },
      onPaginationChange,
    })
    await primeTable(table)

    table.setOptions((old) => ({ ...old, data: makeData().slice(0, 3) }))
    table.getRowModel()
    await flushMicrotasks()

    // Each row-model stage that recomputes schedules the hook; with
    // non-echoing controlled state every call carries the same clamp.
    expect(onPaginationChange).toHaveBeenCalled()
    for (const [updater] of onPaginationChange.mock.calls) {
      expect(
        functionalUpdate<PaginationState>(updater, {
          pageIndex: 2,
          pageSize: 2,
        }),
      ).toEqual({ pageIndex: 1, pageSize: 2 })
    }
  })

  it('does not clamp with manualPagination (server owns the page range)', async () => {
    const table = makeTable({ manualPagination: true })
    await onLastPage(table)

    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(2)
  })

  it('does not clamp with manualPagination and autoResetPageIndex false', async () => {
    const table = makeTable({
      manualPagination: true,
      autoResetPageIndex: false,
    })
    await onLastPage(table)

    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(2)
  })

  it('does not clamp when the page count is unknown', async () => {
    const table = makeTable({ autoResetPageIndex: false, pageCount: -1 })
    await onLastPage(table)

    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(2)
  })

  it('does not compute downstream row models on page 0', async () => {
    const filterSpy = vi.fn(() => true)
    const table = constructTable<typeof features, Person>({
      features,
      columns: [
        { accessorKey: 'name', id: 'name' },
        { accessorKey: 'age', id: 'age' },
        { accessorKey: 'group', id: 'group', filterFn: filterSpy },
      ],
      data: makeData(),
      getSubRows: (row) => row.subRows,
      initialState: {
        pagination: { pageIndex: 0, pageSize: 2 },
        columnFilters: [{ id: 'group', value: 'even' }],
      },
      autoResetPageIndex: false,
    })

    table.getCoreRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    filterSpy.mockClear()

    table.setOptions((old) => ({ ...old, data: makeData() }))
    table.getCoreRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
    expect(filterSpy).not.toHaveBeenCalled()
  })
})

describe('autoResetSorting end-to-end wiring', () => {
  const ageSorting: SortingState = [{ id: 'age', desc: true }]
  const nameSorting: SortingState = [{ id: 'name', desc: false }]

  async function replaceData(table: ReturnType<typeof makeTable>) {
    table.setOptions((old) => ({ ...old, data: makeData() }))
    table.getRowModel()
    await flushMicrotasks()
  }

  it('should preserve sorting by default when data changes', async () => {
    const table = makeTable()
    await primeTable(table)

    expect(table.options.autoResetSorting).toBe(false)

    table.setSorting(ageSorting)
    await replaceData(table)

    expect(table.atoms.sorting.get()).toEqual(ageSorting)
  })

  it('should reset sorting when data changes and autoResetSorting is true', async () => {
    const table = makeTable({ autoResetSorting: true })
    await primeTable(table)

    table.setSorting(ageSorting)
    await replaceData(table)

    expect(table.atoms.sorting.get()).toEqual([])
  })

  it('should reset sorting to initialState.sorting', async () => {
    const table = makeTable({
      autoResetSorting: true,
      initialSorting: ageSorting,
    })
    await primeTable(table)

    expect(table.atoms.sorting.get()).toEqual(ageSorting)

    table.setSorting(nameSorting)
    await replaceData(table)

    expect(table.atoms.sorting.get()).toEqual(ageSorting)
  })

  it('should not reset sorting when the sorting state itself changes', async () => {
    const table = makeTable({ autoResetSorting: true })
    await primeTable(table)

    table.setSorting(ageSorting)
    table.getRowModel()
    await flushMicrotasks()

    expect(table.atoms.sorting.get()).toEqual(ageSorting)
  })

  it('should not reset sorting when filters or grouping change', async () => {
    const table = makeTable({ autoResetSorting: true })
    await primeTable(table)

    table.setSorting(ageSorting)
    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()
    expect(table.atoms.sorting.get()).toEqual(ageSorting)

    table.setGrouping(['group'])
    table.getRowModel()
    await flushMicrotasks()
    expect(table.atoms.sorting.get()).toEqual(ageSorting)
  })

  it('should allow autoResetAll to enable the reset', async () => {
    const table = makeTable({ autoResetAll: true })
    await primeTable(table)

    table.setSorting(ageSorting)
    await replaceData(table)

    expect(table.atoms.sorting.get()).toEqual([])
  })

  it('should allow autoResetAll to disable an explicit sorting reset', async () => {
    const table = makeTable({
      autoResetAll: false,
      autoResetSorting: true,
    })
    await primeTable(table)

    table.setSorting(ageSorting)
    await replaceData(table)

    expect(table.atoms.sorting.get()).toEqual(ageSorting)
  })

  it('should honor an explicit reset with manual sorting', async () => {
    const table = makeTable({
      autoResetSorting: true,
      manualSorting: true,
    })
    await primeTable(table)

    table.setSorting(ageSorting)
    await replaceData(table)

    expect(table.atoms.sorting.get()).toEqual([])
  })
})

describe('autoResetExpanded end-to-end wiring', () => {
  it('should reset expanded when data changes without the grouping feature', async () => {
    const expandingOnlyFeatures = testFeatures({ rowExpandingFeature })
    const table = constructTable<typeof expandingOnlyFeatures, Person>({
      features: expandingOnlyFeatures,
      columns: [{ accessorKey: 'name', id: 'name' }],
      data: makeData(),
      getSubRows: (row) => row.subRows,
    })
    await primeTable(table)

    table.getRow('1').toggleExpanded(true)
    expect(table.atoms.expanded.get()).toEqual({ '1': true })

    table.setOptions((old) => ({ ...old, data: makeData() }))
    table.getRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    expect(table.atoms.expanded.get()).toEqual({})
  })

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

    // table_autoResetExpanded is wired from createCoreRowModel (data changes)
    // and createGroupedRowModel. The pipeline order is core -> filtered ->
    // grouped -> sorted -> expanded -> paginated. Sorting is downstream of
    // grouping and does not touch data, so a sorting change never recomputes
    // either wiring stage and expanded state is preserved.
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

    // Pinned CURRENT behavior: the grouped memo depends on
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

describe('first-run guard', () => {
  it('should not reset initialState.pageIndex on the first row model read', async () => {
    const table = makeTable({ initialPageIndex: 1 })
    expect(table.atoms.pagination.get().pageIndex).toBe(1)

    table.getRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(1)
  })

  it('should not push controlled-state resets to the consumer on mount', async () => {
    const onExpandedChange = vi.fn()
    const onPaginationChange = vi.fn()
    const table = makeTable({
      state: {
        expanded: { '0': true },
        pagination: { pageIndex: 2, pageSize: 2 },
      },
      onExpandedChange,
      onPaginationChange,
    })

    table.getRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    expect(onExpandedChange).not.toHaveBeenCalled()
    expect(onPaginationChange).not.toHaveBeenCalled()
  })

  it('should still auto-reset on the first change after mount', async () => {
    const table = makeTable({ initialPageIndex: 1 })
    await primeTable(table)

    table.setPageIndex(2)
    table.setColumnFilters([{ id: 'group', value: 'even' }])
    table.getRowModel()
    await flushMicrotasks()
    await flushMicrotasks()

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })
})
