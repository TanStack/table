import { describe, expect, it, vi } from 'vitest'
import {
  constructTable,
  createPaginatedRowModel,
  rowPaginationFeature,
} from '../../../../src'
import {
  getDefaultPaginationState,
  table_autoResetPageIndex,
  table_firstPage,
  table_getCanNextPage,
  table_getCanPreviousPage,
  table_getPageCount,
  table_getPageOptions,
  table_getRowCount,
  table_nextPage,
  table_previousPage,
  table_resetPageIndex,
  table_resetPageSize,
  table_resetPagination,
  table_setPageIndex,
  table_setPageSize,
  table_setPagination,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

// 25 rows at the default page size of 10 -> 3 pages
const DEFAULT_ROW_COUNT = 25

function makeTable(
  rowCount = DEFAULT_ROW_COUNT,
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Person> {
  const data = generateTestData(rowCount)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
    ...options,
  })
}

describe('getDefaultPaginationState', () => {
  it('should return the first page with a page size of 10', () => {
    expect(getDefaultPaginationState()).toEqual({ pageIndex: 0, pageSize: 10 })
  })

  it('should return a new object instance each time', () => {
    expect(getDefaultPaginationState()).not.toBe(getDefaultPaginationState())
  })
})

describe('table_setPagination', () => {
  it('should route the updater through onPaginationChange', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, { onPaginationChange })

    table_setPagination(table, { pageIndex: 2, pageSize: 5 })

    expect(onPaginationChange).toHaveBeenCalledTimes(1)
    expect(
      getUpdaterResult(onPaginationChange, getDefaultPaginationState()),
    ).toEqual({ pageIndex: 2, pageSize: 5 })
  })

  it('should resolve functional updaters against the previous state', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, { onPaginationChange })

    table_setPagination(table, (old) => ({
      ...old,
      pageIndex: old.pageIndex + 1,
    }))

    expect(
      getUpdaterResult(onPaginationChange, { pageIndex: 1, pageSize: 10 }),
    ).toEqual({ pageIndex: 2, pageSize: 10 })
  })
})

describe('table_resetPagination', () => {
  it('should reset to the feature default when defaultState is true', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, {
      onPaginationChange,
      initialState: { pagination: { pageIndex: 2, pageSize: 5 } },
    })

    table_resetPagination(table, true)

    expect(
      getUpdaterResult(onPaginationChange, { pageIndex: 2, pageSize: 5 }),
    ).toEqual(getDefaultPaginationState())
  })

  it('should reset to the initial state by default', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, {
      onPaginationChange,
      initialState: { pagination: { pageIndex: 2, pageSize: 5 } },
    })

    table_resetPagination(table)

    expect(
      getUpdaterResult(onPaginationChange, getDefaultPaginationState()),
    ).toEqual({ pageIndex: 2, pageSize: 5 })
  })
})

describe('table_setPageIndex', () => {
  it('should update the page index', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, { onPaginationChange })

    table_setPageIndex(table, 2)

    expect(
      getUpdaterResult(onPaginationChange, getDefaultPaginationState()),
    ).toEqual({ pageIndex: 2, pageSize: 10 })
  })

  it('should clamp negative page indexes to 0', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, { onPaginationChange })

    table_setPageIndex(table, -5)

    expect(
      getUpdaterResult(onPaginationChange, { pageIndex: 2, pageSize: 10 }),
    ).toEqual({ pageIndex: 0, pageSize: 10 })
  })

  it('should clamp to pageCount - 1 when a manual pageCount is known', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, {
      onPaginationChange,
      manualPagination: true,
      pageCount: 3,
    })

    table_setPageIndex(table, 99)

    expect(
      getUpdaterResult(onPaginationChange, getDefaultPaginationState()),
    ).toEqual({ pageIndex: 2, pageSize: 10 })
  })

  it('should not clamp when pageCount is -1 (unknown)', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, {
      onPaginationChange,
      manualPagination: true,
      pageCount: -1,
    })

    table_setPageIndex(table, 99)

    expect(
      getUpdaterResult(onPaginationChange, getDefaultPaginationState()),
    ).toEqual({ pageIndex: 99, pageSize: 10 })
  })
})

describe('table_resetPageIndex', () => {
  it('should reset to 0 when defaultState is true', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, {
      onPaginationChange,
      initialState: { pagination: { pageIndex: 2, pageSize: 10 } },
    })

    table_resetPageIndex(table, true)

    expect(
      getUpdaterResult(onPaginationChange, { pageIndex: 2, pageSize: 10 }),
    ).toEqual({ pageIndex: 0, pageSize: 10 })
  })

  it('should be a no-op when the page index is already at the target', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, { onPaginationChange })

    table_resetPageIndex(table, true)

    expect(onPaginationChange).not.toHaveBeenCalled()
  })

  it('should reset to the initial page index by default', () => {
    const table = makeTable(DEFAULT_ROW_COUNT, {
      initialState: { pagination: { pageIndex: 2, pageSize: 10 } },
    })

    table.setPageIndex(1)
    expect(table.atoms.pagination.get().pageIndex).toBe(1)

    table_resetPageIndex(table)

    expect(table.atoms.pagination.get().pageIndex).toBe(2)
  })
})

describe('table_resetPageSize', () => {
  it('should reset to 10 when defaultState is true', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, {
      onPaginationChange,
      initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
    })

    table_resetPageSize(table, true)

    expect(
      getUpdaterResult(onPaginationChange, { pageIndex: 0, pageSize: 5 }),
    ).toEqual({ pageIndex: 0, pageSize: 10 })
  })

  it('should be a no-op when the page size is already at the target', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, { onPaginationChange })

    table_resetPageSize(table, true)

    expect(onPaginationChange).not.toHaveBeenCalled()
  })

  it('should reset to the initial page size by default', () => {
    const table = makeTable(DEFAULT_ROW_COUNT, {
      initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
    })

    table.setPageSize(20)
    expect(table.atoms.pagination.get().pageSize).toBe(20)

    table_resetPageSize(table)

    expect(table.atoms.pagination.get().pageSize).toBe(5)
  })
})

describe('table_setPageSize', () => {
  it('should clamp the page size to at least 1', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, { onPaginationChange })

    table_setPageSize(table, 0)

    expect(
      getUpdaterResult(onPaginationChange, getDefaultPaginationState()),
    ).toEqual({ pageIndex: 0, pageSize: 1 })
  })

  it('should keep the previous top row in view when the page size changes', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(DEFAULT_ROW_COUNT, { onPaginationChange })

    table_setPageSize(table, 5)

    // top row was 10 * 2 = 20; with pageSize 5 that row lives on page 4
    expect(
      getUpdaterResult(onPaginationChange, { pageIndex: 2, pageSize: 10 }),
    ).toEqual({ pageIndex: 4, pageSize: 5 })
  })
})

describe('table_getPageOptions', () => {
  it('should list every page index', () => {
    const table = makeTable(25)

    expect(table_getPageOptions(table)).toEqual([0, 1, 2])
  })

  it('should return an empty array when there are no rows', () => {
    const table = makeTable(0)

    expect(table_getPageOptions(table)).toEqual([])
  })
})

describe('table_getCanPreviousPage', () => {
  it('should return false on the first page', () => {
    const table = makeTable(25)

    expect(table_getCanPreviousPage(table)).toBe(false)
  })

  it('should return true past the first page', () => {
    const table = makeTable(25, {
      initialState: { pagination: { pageIndex: 1, pageSize: 10 } },
    })

    expect(table_getCanPreviousPage(table)).toBe(true)
  })
})

describe('table_getCanNextPage', () => {
  it('should return true when more pages exist', () => {
    const table = makeTable(25)

    expect(table_getCanNextPage(table)).toBe(true)
  })

  it('should return false on the last page', () => {
    const table = makeTable(25, {
      initialState: { pagination: { pageIndex: 2, pageSize: 10 } },
    })

    expect(table_getCanNextPage(table)).toBe(false)
  })

  it('should return true when the page count is unknown (-1)', () => {
    const table = makeTable(25, {
      manualPagination: true,
      pageCount: -1,
      initialState: { pagination: { pageIndex: 99, pageSize: 10 } },
    })

    expect(table_getCanNextPage(table)).toBe(true)
  })

  it('should return false when the page count is 0', () => {
    const table = makeTable(0)

    expect(table_getCanNextPage(table)).toBe(false)
  })
})

describe('page navigation', () => {
  it('table_nextPage should advance the page index', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(25, { onPaginationChange })

    table_nextPage(table)

    expect(
      getUpdaterResult(onPaginationChange, getDefaultPaginationState()),
    ).toEqual({ pageIndex: 1, pageSize: 10 })
  })

  it('table_previousPage should decrement the page index and clamp at 0', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(25, { onPaginationChange })

    table_previousPage(table)

    expect(
      getUpdaterResult(onPaginationChange, { pageIndex: 2, pageSize: 10 }),
    ).toEqual({ pageIndex: 1, pageSize: 10 })
    expect(
      getUpdaterResult(onPaginationChange, getDefaultPaginationState()),
    ).toEqual({ pageIndex: 0, pageSize: 10 })
  })

  it('table_firstPage should go to page 0', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(25, { onPaginationChange })

    table_firstPage(table)

    expect(
      getUpdaterResult(onPaginationChange, { pageIndex: 2, pageSize: 10 }),
    ).toEqual({ pageIndex: 0, pageSize: 10 })
  })

  it('table_lastPage should go to the last computed page', () => {
    const table = makeTable(25)

    table.lastPage()

    expect(table.atoms.pagination.get().pageIndex).toBe(2)
  })
})

describe('table_getPageCount', () => {
  it('should compute the page count from the row count and page size', () => {
    expect(table_getPageCount(makeTable(25))).toBe(3)
    expect(table_getPageCount(makeTable(30))).toBe(3)
    expect(table_getPageCount(makeTable(31))).toBe(4)
  })

  it('should prefer options.pageCount for manual pagination', () => {
    const table = makeTable(25, { manualPagination: true, pageCount: 7 })

    expect(table_getPageCount(table)).toBe(7)
  })
})

describe('table_getRowCount', () => {
  it('should count the pre-paginated rows', () => {
    expect(table_getRowCount(makeTable(25))).toBe(25)
  })

  it('should prefer options.rowCount for manual pagination', () => {
    const table = makeTable(25, { manualPagination: true, rowCount: 1000 })

    expect(table_getRowCount(table)).toBe(1000)
  })
})

describe('paginated row model', () => {
  it('should slice rows to the current page', () => {
    const table = makeTable(25)

    expect(table.getPaginatedRowModel().rows).toHaveLength(10)
    expect(table.getPaginatedRowModel().rows[0]!.id).toBe('0')

    table.setPageIndex(2)

    expect(table.getPaginatedRowModel().rows).toHaveLength(5)
    expect(table.getPaginatedRowModel().rows[0]!.id).toBe('20')
  })
})

describe('table_autoResetPageIndex', () => {
  it('should reset the page index for client-side pagination', () => {
    const table = makeTable(25, {
      initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    })

    table.setPageIndex(2)
    expect(table.atoms.pagination.get().pageIndex).toBe(2)

    table_autoResetPageIndex(table)

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })

  it('should not reset when manualPagination is set', () => {
    const onPaginationChange = vi.fn()
    const table = makeTable(25, {
      onPaginationChange,
      manualPagination: true,
    })

    table_autoResetPageIndex(table)

    expect(onPaginationChange).not.toHaveBeenCalled()
  })

  it('should reset even for manual pagination when autoResetPageIndex opts back in', () => {
    const table = makeTable(25, {
      manualPagination: true,
      autoResetPageIndex: true,
    })

    table.setPageIndex(2)
    expect(table.atoms.pagination.get().pageIndex).toBe(2)

    table_autoResetPageIndex(table)

    expect(table.atoms.pagination.get().pageIndex).toBe(0)
  })
})
