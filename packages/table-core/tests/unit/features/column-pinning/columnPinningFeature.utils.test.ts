import { describe, expect, it, vi } from 'vitest'
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  constructTable,
} from '../../../../src'
import {
  column_getCanPin,
  column_getIsPinned,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  row_getEndVisibleCells,
  row_getStartVisibleCells,
  table_getCenterFlatHeaders,
  table_getCenterFooterGroups,
  table_getCenterHeaderGroups,
  table_getCenterLeafColumns,
  table_getCenterLeafHeaders,
  table_getCenterVisibleLeafColumns,
  table_getEndFlatHeaders,
  table_getEndFooterGroups,
  table_getEndHeaderGroups,
  table_getEndLeafColumns,
  table_getEndLeafHeaders,
  table_getEndVisibleLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getPinnedLeafColumns,
  table_getPinnedVisibleLeafColumns,
  table_getStartFlatHeaders,
  table_getStartFooterGroups,
  table_getStartHeaderGroups,
  table_getStartLeafColumns,
  table_getStartLeafHeaders,
  table_getStartVisibleLeafColumns,
  table_getVisibleLeafColumns,
  table_resetColumnPinning,
  table_setColumnPinning,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { ColumnDef, Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

function makeTable(
  rowCount: number,
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

describe('getDefaultColumnPinningState', () => {
  it('should return default column pinning state', () => {
    const result = getDefaultColumnPinningState()
    expect(result).toEqual({
      start: [],
      end: [],
    })
  })
})

describe('column_pin', () => {
  it('should pin column to the start', () => {
    const onColumnPinningChange = vi.fn()
    const table = makeTable(1, {
      onColumnPinningChange,
      initialState: {
        columnPinning: {
          start: [],
          end: [],
        },
      },
    })
    const column = table.getAllColumns()[0]!

    column_pin(column, 'start')

    const result = getUpdaterResult(onColumnPinningChange, {
      start: [],
      end: [],
    })

    expect(result).toEqual({
      start: [column.id],
      end: [],
    })
  })

  it('should pin column to the end', () => {
    const onColumnPinningChange = vi.fn()
    const table = makeTable(1, {
      onColumnPinningChange,
      initialState: {
        columnPinning: {
          start: [],
          end: [],
        },
      },
    })
    const column = table.getAllColumns()[0]!

    column_pin(column, 'end')

    const result = getUpdaterResult(onColumnPinningChange, {
      start: [],
      end: [],
    })

    expect(result).toEqual({
      start: [],
      end: [column.id],
    })
  })

  it('should unpin column when false is passed', () => {
    const onColumnPinningChange = vi.fn()
    const table = makeTable(1, {
      onColumnPinningChange,
      initialState: {
        columnPinning: {
          start: ['id'],
          end: [],
        },
      },
    })
    const column = table.getColumn('id')!

    column_pin(column, false)

    const result = getUpdaterResult(onColumnPinningChange, {
      start: ['id'],
      end: [],
    })

    expect(result).toEqual({
      start: [],
      end: [],
    })
  })
})

describe('column_getCanPin', () => {
  it('should return true when column pinning is enabled', () => {
    const table = makeTable(1)
    const column = table.getAllColumns()[0]!

    const result = column_getCanPin(column)

    expect(result).toBe(true)
  })

  it('should return false when column pinning is disabled globally', () => {
    const table = makeTable(1, {
      enableColumnPinning: false,
    })
    const column = table.getAllColumns()[0]!

    const result = column_getCanPin(column)

    expect(result).toBe(false)
  })

  it('should return false when column pinning is disabled for specific column', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', enablePinning: false },
    ]
    const table = constructTable({
      features,
      data: generateTestData(1),
      columns,
    })
    const column = table.getAllColumns()[0]!

    const result = column_getCanPin(column)

    expect(result).toBe(false)
  })
})

describe('column_getIsPinned', () => {
  it('should return start when column is pinned start', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })
    const column = table.getColumn('firstName')!

    const result = column_getIsPinned(column)

    expect(result).toBe('start')
  })

  it('should return end when column is pinned end', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: [],
          end: ['firstName'],
        },
      },
    })
    const column = table.getColumn('firstName')!

    const result = column_getIsPinned(column)

    expect(result).toBe('end')
  })

  it('should return false when column is not pinned', () => {
    const table = makeTable(1)
    const column = table.getColumn('firstName')!

    const result = column_getIsPinned(column)

    expect(result).toBe(false)
  })

  it('should prefer start when column is pinned in both regions', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['firstName'],
        },
      },
    })
    const column = table.getColumn('firstName')!

    expect(column_getIsPinned(column)).toBe('start')
  })

  it('should report the pinned region of a group column from its leaf columns', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      {
        id: 'name',
        header: 'Name',
        columns: [
          { accessorKey: 'firstName', id: 'firstName' },
          { accessorKey: 'lastName', id: 'lastName' },
        ],
      },
    ]
    const table = constructTable({
      features,
      columns,
      data: [],
      initialState: {
        columnPinning: {
          start: [],
          end: ['lastName'],
        },
      },
    })
    const groupColumn = table.getAllColumns()[0]!

    expect(column_getIsPinned(groupColumn)).toBe('end')
  })
})

describe('table_setColumnPinning', () => {
  it('should call onColumnPinningChange with updater', () => {
    const onColumnPinningChange = vi.fn()
    const table = makeTable(1, {
      onColumnPinningChange,
    })

    table_setColumnPinning(table, {
      start: ['firstName'],
      end: [],
    })

    expect(onColumnPinningChange).toHaveBeenCalledWith({
      start: ['firstName'],
      end: [],
    })
  })
})

describe('table_resetColumnPinning', () => {
  it('should reset to default state when defaultState is true', () => {
    const onColumnPinningChange = vi.fn()
    const table = makeTable(1, {
      onColumnPinningChange,
    })

    table_resetColumnPinning(table, true)

    expect(onColumnPinningChange).toHaveBeenCalledWith({
      start: [],
      end: [],
    })
  })

  it('should reset to initial state when defaultState is false', () => {
    const onColumnPinningChange = vi.fn()
    const initialState = {
      columnPinning: {
        start: ['firstName'],
        end: [],
      },
    }
    const table = makeTable(1, {
      onColumnPinningChange,
      initialState,
    })

    table_resetColumnPinning(table, false)

    expect(onColumnPinningChange).toHaveBeenCalledWith({
      start: ['firstName'],
      end: [],
    })
  })
})

describe('table_getIsSomeColumnsPinned', () => {
  it('should return true when columns are pinned start', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })

    const result = table_getIsSomeColumnsPinned(table)

    expect(result).toBe(true)
  })

  it('should return true when columns are pinned end', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: [],
          end: ['firstName'],
        },
      },
    })

    const result = table_getIsSomeColumnsPinned(table)

    expect(result).toBe(true)
  })

  it('should return false when no columns are pinned', () => {
    const table = makeTable(1)

    const result = table_getIsSomeColumnsPinned(table)

    expect(result).toBe(false)
  })

  it('should check specific position when position parameter is provided', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })

    expect(table_getIsSomeColumnsPinned(table, 'start')).toBe(true)
    expect(table_getIsSomeColumnsPinned(table, 'end')).toBe(false)
  })
})

describe('column_getPinnedIndex', () => {
  it('should return index of pinned column', () => {
    const table = makeTable(2, {
      initialState: {
        columnPinning: {
          start: ['firstName', 'lastName'],
          end: [],
        },
      },
    })
    const column = table.getColumn('lastName')!

    const result = column_getPinnedIndex(column)

    expect(result).toBe(1)
  })

  it('should return 0 when column is not pinned', () => {
    const table = makeTable(1)
    const column = table.getColumn('firstName')!

    const result = column_getPinnedIndex(column)

    expect(result).toBe(0)
  })
})

describe('row_getCenterVisibleCells', () => {
  it('should return only unpinned visible cells', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })
    const row = table.getRowModel().rows[0]!

    const centerCells = row_getCenterVisibleCells(row)

    expect(centerCells.map((cell) => cell.column.id)).not.toContain('firstName')
    expect(centerCells.map((cell) => cell.column.id)).not.toContain('lastName')
    expect(centerCells.length).toBeGreaterThan(0)
  })

  it('should return the shared visible cells array when nothing is pinned', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    expect(row.getCenterVisibleCells()).toBe(row.getVisibleCells())
  })
})

describe('row_getStartVisibleCells', () => {
  it('should return only start pinned cells', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })
    const row = table.getRowModel().rows[0]!

    const leftCells = row_getStartVisibleCells(row)

    expect(leftCells).toHaveLength(1)
    expect(leftCells[0]?.column.id).toBe('firstName')
  })

  it('should return empty array when no columns are pinned start', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const leftCells = row_getStartVisibleCells(row)

    expect(leftCells).toHaveLength(0)
  })
})

describe('row_getEndVisibleCells', () => {
  it('should return only end pinned cells', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })
    const row = table.getRowModel().rows[0]!

    const rightCells = row_getEndVisibleCells(row)

    expect(rightCells).toHaveLength(1)
    expect(rightCells[0]?.column.id).toBe('lastName')
  })

  it('should return empty array when no columns are pinned end', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const rightCells = row_getEndVisibleCells(row)

    expect(rightCells).toHaveLength(0)
  })
})

describe('column pinning selector boundaries', () => {
  it('keeps start results cached when only end pinning changes', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })
    const row = table.getRowModel().rows[0]!
    const startCells = row.getStartVisibleCells()
    const startHeaderGroups = table.getStartHeaderGroups()
    const current = table.atoms.columnPinning.get()

    table.setColumnPinning({
      start: current.start,
      end: ['age'],
    })

    expect(row.getStartVisibleCells()).toBe(startCells)
    expect(table.getStartHeaderGroups()).toBe(startHeaderGroups)
  })

  it('keeps end results cached when only start pinning changes', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })
    const row = table.getRowModel().rows[0]!
    const endCells = row.getEndVisibleCells()
    const endHeaderGroups = table.getEndHeaderGroups()
    const current = table.atoms.columnPinning.get()

    table.setColumnPinning({
      start: ['age'],
      end: current.end,
    })

    expect(row.getEndVisibleCells()).toBe(endCells)
    expect(table.getEndHeaderGroups()).toBe(endHeaderGroups)
  })
})

describe('table_getStartHeaderGroups', () => {
  it('should return header groups for start pinned columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })

    const headerGroups = table_getStartHeaderGroups(table)

    expect(headerGroups[0]?.headers[0]?.column.id).toBe('firstName')
  })
})

describe('table_getEndHeaderGroups', () => {
  it('should return header groups for end pinned columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: [],
          end: ['lastName'],
        },
      },
    })

    const headerGroups = table_getEndHeaderGroups(table)

    expect(headerGroups[0]?.headers[0]?.column.id).toBe('lastName')
  })
})

describe('table_getCenterHeaderGroups', () => {
  it('should return header groups for unpinned columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })

    const headerGroups = table_getCenterHeaderGroups(table)
    const centerColumnIds = headerGroups[0]?.headers.map(
      (header) => header.column.id,
    )

    expect(centerColumnIds).not.toContain('firstName')
    expect(centerColumnIds).not.toContain('lastName')
    expect(headerGroups[0]?.headers.length).toBeGreaterThan(0)
  })

  it('should include all visible columns when nothing is pinned', () => {
    const table = makeTable(1)

    const headerGroups = table_getCenterHeaderGroups(table)

    expect(headerGroups[0]?.headers.map((header) => header.column.id)).toEqual(
      table_getVisibleLeafColumns(table).map((col) => col.id),
    )
  })
})

describe('header group ids', () => {
  it('should preserve depth and family prefixes for grouped columns', () => {
    const data = generateTestData(1)
    const groupedColumns: Array<ColumnDef<typeof features, Person, any>> = [
      {
        id: 'identity',
        columns: [
          { accessorKey: 'firstName', id: 'firstName' },
          { accessorKey: 'age', id: 'age' },
          { accessorKey: 'lastName', id: 'lastName' },
        ],
      },
    ]
    const table = constructTable<typeof features, Person>({
      features,
      data,
      columns: groupedColumns,
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })

    const start = table_getStartHeaderGroups(table)
    const center = table_getCenterHeaderGroups(table)
    const end = table_getEndHeaderGroups(table)

    expect(start.map((group) => group.id)).toEqual(['start_0', 'start_1'])
    expect(center.map((group) => group.id)).toEqual(['center_0', 'center_1'])
    expect(end.map((group) => group.id)).toEqual(['end_0', 'end_1'])
    expect(start[0]!.headers[0]!.id).toBe('start_1_identity_firstName')
    expect(center[0]!.headers[0]!.id).toBe('center_1_identity_age')
    expect(end[0]!.headers[0]!.id).toBe('end_1_identity_lastName')
    expect(start[1]!.headers[0]!.id).toBe('firstName')
    expect(center[1]!.headers[0]!.id).toBe('age')
    expect(end[1]!.headers[0]!.id).toBe('lastName')
  })
})

describe('table_getStartLeafColumns', () => {
  it('should return start pinned leaf columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })

    const leafColumns = table_getStartLeafColumns(table)

    expect(leafColumns).toHaveLength(1)
    expect(leafColumns[0]?.id).toBe('firstName')
  })
})

describe('table_getEndLeafColumns', () => {
  it('should return end pinned leaf columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: [],
          end: ['lastName'],
        },
      },
    })

    const leafColumns = table_getEndLeafColumns(table)

    expect(leafColumns).toHaveLength(1)
    expect(leafColumns[0]?.id).toBe('lastName')
  })
})

describe('table_getCenterLeafColumns', () => {
  it('should return unpinned leaf columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })

    const leafColumns = table_getCenterLeafColumns(table)
    const centerColumnIds = leafColumns.map((col) => col.id)

    expect(centerColumnIds).not.toContain('firstName')
    expect(centerColumnIds).not.toContain('lastName')
    expect(leafColumns.length).toBeGreaterThan(0)
  })

  it('should return the shared leaf columns array when nothing is pinned', () => {
    const table = makeTable(1)

    expect(table_getCenterLeafColumns(table)).toBe(table.getAllLeafColumns())
  })
})

describe('table_getPinnedLeafColumns', () => {
  it('should return start pinned leaf columns when position is start', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })

    const leafColumns = table_getPinnedLeafColumns(table, 'start')

    expect(leafColumns).toHaveLength(1)
    expect(leafColumns[0]?.id).toBe('firstName')
  })

  it('should return end pinned leaf columns when position is end', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: [],
          end: ['lastName'],
        },
      },
    })

    const leafColumns = table_getPinnedLeafColumns(table, 'end')

    expect(leafColumns).toHaveLength(1)
    expect(leafColumns[0]?.id).toBe('lastName')
  })

  it('should return center leaf columns when position is center', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })

    const leafColumns = table_getPinnedLeafColumns(table, 'center')

    expect(leafColumns.length).toBeGreaterThan(0)
    expect(leafColumns.map((col) => col.id)).not.toContain('firstName')
    expect(leafColumns.map((col) => col.id)).not.toContain('lastName')
  })
})

describe('table_getPinnedVisibleLeafColumns', () => {
  it('should return visible leaf columns for specified position', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
        columnVisibility: {
          age: false,
        },
      },
    })

    const leftColumns = table_getPinnedVisibleLeafColumns(table, 'start')
    const rightColumns = table_getPinnedVisibleLeafColumns(table, 'end')
    const centerColumns = table_getPinnedVisibleLeafColumns(table, 'center')

    expect(leftColumns[0]?.id).toBe('firstName')
    expect(rightColumns[0]?.id).toBe('lastName')
    expect(centerColumns.map((col) => col.id)).not.toContain('age')
  })

  it('should return all visible leaf columns when no position specified', () => {
    const table = makeTable(1, {
      initialState: {
        columnVisibility: {
          age: false,
        },
      },
    })

    const leafColumns = table_getPinnedVisibleLeafColumns(table)

    expect(leafColumns.map((col) => col.id)).not.toContain('age')
    expect(leafColumns.length).toBe(table_getVisibleLeafColumns(table).length)
  })
})

describe('column pinning table instance APIs', () => {
  it('should expose pinned leaf column APIs on the table instance', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
        columnVisibility: {
          age: false,
        },
      },
    })

    expect(table.getPinnedLeafColumns('start').map((col) => col.id)).toEqual([
      'firstName',
    ])
    expect(
      table.getPinnedVisibleLeafColumns('center').map((col) => col.id),
    ).not.toContain('age')
  })

  it('should pass method arguments into memoized prototype API dependencies', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })

    expect(table.getColumn('firstName')!.getStart('start')).toBe(0)
  })

  it('should update center visible columns when column order changes', () => {
    const table = makeTable(1)

    expect(table.getCenterVisibleLeafColumns().map((col) => col.id)).toEqual([
      'id',
      'firstName',
      'lastName',
      'age',
      'visits',
      'progress',
      'status',
      'subRows',
    ])
    expect(table.getColumn('lastName')!.getStart('center')).toBe(300)

    table.setColumnOrder([
      'lastName',
      'firstName',
      'id',
      'age',
      'visits',
      'progress',
      'status',
      'subRows',
    ])

    expect(table.getCenterVisibleLeafColumns().map((col) => col.id)).toEqual([
      'lastName',
      'firstName',
      'id',
      'age',
      'visits',
      'progress',
      'status',
      'subRows',
    ])
    expect(table.getColumn('lastName')!.getStart('center')).toBe(0)
  })
})

describe('table_getFooterGroups', () => {
  it('should return footer groups for start pinned columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })

    const footerGroups = table_getStartFooterGroups(table)

    expect(footerGroups[0]?.headers[0]?.column.id).toBe('firstName')
  })

  it('should return footer groups for end pinned columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: [],
          end: ['lastName'],
        },
      },
    })

    const footerGroups = table_getEndFooterGroups(table)

    expect(footerGroups[0]?.headers[0]?.column.id).toBe('lastName')
  })

  it('should return footer groups for center columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })

    const footerGroups = table_getCenterFooterGroups(table)
    const centerColumnIds = footerGroups[0]?.headers.map(
      (header) => header.column.id,
    )

    expect(centerColumnIds).not.toContain('firstName')
    expect(centerColumnIds).not.toContain('lastName')
    expect(footerGroups[0]?.headers.length).toBeGreaterThan(0)
  })
})

describe('table_getFlatHeaders', () => {
  it('should return flat headers for start pinned columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: [],
        },
      },
    })

    const flatHeaders = table_getStartFlatHeaders(table)

    expect(flatHeaders).toHaveLength(1)
    expect(flatHeaders[0]?.column.id).toBe('firstName')
  })

  it('should return flat headers for end pinned columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: [],
          end: ['lastName'],
        },
      },
    })

    const flatHeaders = table_getEndFlatHeaders(table)

    expect(flatHeaders).toHaveLength(1)
    expect(flatHeaders[0]?.column.id).toBe('lastName')
  })

  it('should return flat headers for center columns', () => {
    const table = makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
      },
    })

    const flatHeaders = table_getCenterFlatHeaders(table)
    const centerColumnIds = flatHeaders.map((header) => header.column.id)

    expect(centerColumnIds).not.toContain('firstName')
    expect(centerColumnIds).not.toContain('lastName')
    expect(flatHeaders.length).toBeGreaterThan(0)
  })
})

describe('pinned leaf headers and visible leaf columns', () => {
  function makePinnedTable() {
    return makeTable(1, {
      initialState: {
        columnPinning: {
          start: ['firstName'],
          end: ['lastName'],
        },
        columnVisibility: {
          age: false,
        },
      },
    })
  }

  it('table_getStartLeafHeaders should return headers for start pinned columns', () => {
    const table = makePinnedTable()

    expect(
      table_getStartLeafHeaders(table).map((header) => header.column.id),
    ).toEqual(['firstName'])
  })

  it('table_getEndLeafHeaders should return headers for end pinned columns', () => {
    const table = makePinnedTable()

    expect(
      table_getEndLeafHeaders(table).map((header) => header.column.id),
    ).toEqual(['lastName'])
  })

  it('table_getCenterLeafHeaders should return headers for unpinned columns', () => {
    const table = makePinnedTable()
    const centerIds = table_getCenterLeafHeaders(table).map(
      (header) => header.column.id,
    )

    expect(centerIds).not.toContain('firstName')
    expect(centerIds).not.toContain('lastName')
    expect(centerIds.length).toBeGreaterThan(0)
  })

  it('table_getStartVisibleLeafColumns should return visible start pinned columns', () => {
    const table = makePinnedTable()

    expect(
      table_getStartVisibleLeafColumns(table).map((col) => col.id),
    ).toEqual(['firstName'])
  })

  it('table_getEndVisibleLeafColumns should return visible end pinned columns', () => {
    const table = makePinnedTable()

    expect(table_getEndVisibleLeafColumns(table).map((col) => col.id)).toEqual([
      'lastName',
    ])
  })

  it('table_getCenterVisibleLeafColumns should exclude pinned and hidden columns', () => {
    const table = makePinnedTable()
    const centerIds = table_getCenterVisibleLeafColumns(table).map(
      (col) => col.id,
    )

    expect(centerIds).not.toContain('firstName')
    expect(centerIds).not.toContain('lastName')
    expect(centerIds).not.toContain('age')
    expect(centerIds.length).toBeGreaterThan(0)
  })
})
