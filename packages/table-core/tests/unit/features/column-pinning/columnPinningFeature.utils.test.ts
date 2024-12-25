import { describe, expect, it, vi } from 'vitest'
import {
  column_getCanPin,
  column_getIsPinned,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  row_getLeftVisibleCells,
  row_getRightVisibleCells,
  table_getCenterFlatHeaders,
  table_getCenterFooterGroups,
  table_getCenterHeaderGroups,
  table_getCenterLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getLeftFlatHeaders,
  table_getLeftFooterGroups,
  table_getLeftHeaderGroups,
  table_getLeftLeafColumns,
  table_getPinnedLeafColumns,
  table_getPinnedVisibleLeafColumns,
  table_getRightFlatHeaders,
  table_getRightFooterGroups,
  table_getRightHeaderGroups,
  table_getRightLeafColumns,
  table_getVisibleLeafColumns,
  table_resetColumnPinning,
  table_setColumnPinning,
} from '../../../../src'
import { generateTestTableWithData } from '../../../helpers/generateTestTable'
import { getUpdaterResult } from '../../../helpers/testUtils'

describe('getDefaultColumnPinningState', () => {
  it('should return default column pinning state', () => {
    const result = getDefaultColumnPinningState()
    expect(result).toEqual({
      left: [],
      right: [],
    })
  })
})

describe('column_pin', () => {
  it('should pin column to the left', () => {
    const onColumnPinningChange = vi.fn()
    const table = generateTestTableWithData(1, {
      onColumnPinningChange,
      state: {
        columnPinning: {
          left: [],
          right: [],
        },
      },
    })
    const column = table.getAllColumns()[0]!

    column_pin(column, 'left')

    const result = getUpdaterResult(onColumnPinningChange, {
      left: [],
      right: [],
    })

    expect(result).toEqual({
      left: [column.id],
      right: [],
    })
  })

  it('should pin column to the right', () => {
    const onColumnPinningChange = vi.fn()
    const table = generateTestTableWithData(1, {
      onColumnPinningChange,
      state: {
        columnPinning: {
          left: [],
          right: [],
        },
      },
    })
    const column = table.getAllColumns()[0]!

    column_pin(column, 'right')

    const result = getUpdaterResult(onColumnPinningChange, {
      left: [],
      right: [],
    })

    expect(result).toEqual({
      left: [],
      right: [column.id],
    })
  })

  it('should unpin column when false is passed', () => {
    const onColumnPinningChange = vi.fn()
    const table = generateTestTableWithData(1, {
      onColumnPinningChange,
      state: {
        columnPinning: {
          left: ['id'],
          right: [],
        },
      },
    })
    const column = table.getColumn('id')!

    column_pin(column, false)

    const result = getUpdaterResult(onColumnPinningChange, {
      left: ['id'],
      right: [],
    })

    expect(result).toEqual({
      left: [],
      right: [],
    })
  })
})

describe('column_getCanPin', () => {
  it('should return true when column pinning is enabled', () => {
    const table = generateTestTableWithData(1)
    const column = table.getAllColumns()[0]

    const result = column_getCanPin(column as any)

    expect(result).toBe(true)
  })

  it('should return false when column pinning is disabled globally', () => {
    const table = generateTestTableWithData(1, {
      enableColumnPinning: false,
    })
    const column = table.getAllColumns()[0]

    const result = column_getCanPin(column as any)

    expect(result).toBe(false)
  })

  it('should return false when column pinning is disabled for specific column', () => {
    const table = generateTestTableWithData(1)
    const column = {
      ...table.getAllColumns()[0],
      columnDef: { enablePinning: false },
      table: table,
      getLeafColumns: () => [
        {
          ...table.getAllColumns()[0],
          columnDef: { enablePinning: false },
        },
      ],
    }

    const result = column_getCanPin(column as any)

    expect(result).toBe(false)
  })
})

describe('column_getIsPinned', () => {
  it('should return left when column is pinned left', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: [],
        },
      },
    })
    const column = table.getColumn('firstName')!

    const result = column_getIsPinned(column)

    expect(result).toBe('left')
  })

  it('should return right when column is pinned right', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: [],
          right: ['firstName'],
        },
      },
    })
    const column = table.getColumn('firstName')!

    const result = column_getIsPinned(column)

    expect(result).toBe('right')
  })

  it('should return false when column is not pinned', () => {
    const table = generateTestTableWithData(1)
    const column = table.getColumn('firstName')!

    const result = column_getIsPinned(column)

    expect(result).toBe(false)
  })
})

describe('table_setColumnPinning', () => {
  it('should call onColumnPinningChange with updater', () => {
    const onColumnPinningChange = vi.fn()
    const table = generateTestTableWithData(1, {
      onColumnPinningChange,
    })

    table_setColumnPinning(table as any, {
      left: ['firstName'],
      right: [],
    })

    expect(onColumnPinningChange).toHaveBeenCalledWith({
      left: ['firstName'],
      right: [],
    })
  })
})

describe('table_resetColumnPinning', () => {
  it('should reset to default state when defaultState is true', () => {
    const onColumnPinningChange = vi.fn()
    const table = generateTestTableWithData(1, {
      onColumnPinningChange,
    })

    table_resetColumnPinning(table as any, true)

    expect(onColumnPinningChange).toHaveBeenCalledWith({
      left: [],
      right: [],
    })
  })

  it('should reset to initial state when defaultState is false', () => {
    const onColumnPinningChange = vi.fn()
    const initialState = {
      columnPinning: {
        left: ['firstName'],
        right: [],
      },
    }
    const table = generateTestTableWithData(1, {
      onColumnPinningChange,
      initialState,
    })

    table_resetColumnPinning(table as any, false)

    expect(onColumnPinningChange).toHaveBeenCalledWith({
      left: ['firstName'],
      right: [],
    })
  })
})

describe('table_getIsSomeColumnsPinned', () => {
  it('should return true when columns are pinned left', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: [],
        },
      },
    })

    const result = table_getIsSomeColumnsPinned(table as any)

    expect(result).toBe(true)
  })

  it('should return true when columns are pinned right', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: [],
          right: ['firstName'],
        },
      },
    })

    const result = table_getIsSomeColumnsPinned(table as any)

    expect(result).toBe(true)
  })

  it('should return false when no columns are pinned', () => {
    const table = generateTestTableWithData(1)

    const result = table_getIsSomeColumnsPinned(table as any)

    expect(result).toBe(false)
  })

  it('should check specific position when position parameter is provided', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: [],
        },
      },
    })

    expect(table_getIsSomeColumnsPinned(table as any, 'left')).toBe(true)
    expect(table_getIsSomeColumnsPinned(table as any, 'right')).toBe(false)
  })
})

describe('column_getPinnedIndex', () => {
  it('should return index of pinned column', () => {
    const table = generateTestTableWithData(2, {
      state: {
        columnPinning: {
          left: ['firstName', 'lastName'],
          right: [],
        },
      },
    })
    const column = table.getColumn('lastName')!

    const result = column_getPinnedIndex(column)

    expect(result).toBe(1)
  })

  it('should return 0 when column is not pinned', () => {
    const table = generateTestTableWithData(1)
    const column = table.getColumn('firstName')!

    const result = column_getPinnedIndex(column)

    expect(result).toBe(0)
  })
})

describe('row_getCenterVisibleCells', () => {
  it('should return only unpinned visible cells', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
      },
    })
    const row = table.getRowModel().rows[0]!

    const centerCells = row_getCenterVisibleCells(row)

    expect(centerCells.map((cell) => cell.column.id)).not.toContain('firstName')
    expect(centerCells.map((cell) => cell.column.id)).not.toContain('lastName')
    expect(centerCells.length).toBeGreaterThan(0)
  })
})

describe('row_getLeftVisibleCells', () => {
  it('should return only left pinned cells', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
      },
    })
    const row = table.getRowModel().rows[0]!

    const leftCells = row_getLeftVisibleCells(row)

    expect(leftCells).toHaveLength(1)
    expect(leftCells[0]?.column.id).toBe('firstName')
  })

  it('should return empty array when no columns are pinned left', () => {
    const table = generateTestTableWithData(1)
    const row = table.getRowModel().rows[0]!

    const leftCells = row_getLeftVisibleCells(row)

    expect(leftCells).toHaveLength(0)
  })
})

describe('row_getRightVisibleCells', () => {
  it('should return only right pinned cells', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
      },
    })
    const row = table.getRowModel().rows[0]!

    const rightCells = row_getRightVisibleCells(row)

    expect(rightCells).toHaveLength(1)
    expect(rightCells[0]?.column.id).toBe('lastName')
  })

  it('should return empty array when no columns are pinned right', () => {
    const table = generateTestTableWithData(1)
    const row = table.getRowModel().rows[0]!

    const rightCells = row_getRightVisibleCells(row)

    expect(rightCells).toHaveLength(0)
  })
})

describe('table_getLeftHeaderGroups', () => {
  it('should return header groups for left pinned columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: [],
        },
      },
    })

    const headerGroups = table_getLeftHeaderGroups(table as any)

    expect(headerGroups[0]?.headers[0]?.column.id).toBe('firstName')
  })
})

describe('table_getRightHeaderGroups', () => {
  it('should return header groups for right pinned columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: [],
          right: ['lastName'],
        },
      },
    })

    const headerGroups = table_getRightHeaderGroups(table as any)

    expect(headerGroups[0]?.headers[0]?.column.id).toBe('lastName')
  })
})

describe('table_getCenterHeaderGroups', () => {
  it('should return header groups for unpinned columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
      },
    })

    const headerGroups = table_getCenterHeaderGroups(table as any)
    const centerColumnIds = headerGroups[0]?.headers.map(
      (header) => header.column.id,
    )

    expect(centerColumnIds).not.toContain('firstName')
    expect(centerColumnIds).not.toContain('lastName')
    expect(headerGroups[0]?.headers.length).toBeGreaterThan(0)
  })
})

describe('table_getLeftLeafColumns', () => {
  it('should return left pinned leaf columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: [],
        },
      },
    })

    const leafColumns = table_getLeftLeafColumns(table as any)

    expect(leafColumns).toHaveLength(1)
    expect(leafColumns[0]?.id).toBe('firstName')
  })
})

describe('table_getRightLeafColumns', () => {
  it('should return right pinned leaf columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: [],
          right: ['lastName'],
        },
      },
    })

    const leafColumns = table_getRightLeafColumns(table as any)

    expect(leafColumns).toHaveLength(1)
    expect(leafColumns[0]?.id).toBe('lastName')
  })
})

describe('table_getCenterLeafColumns', () => {
  it('should return unpinned leaf columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
      },
    })

    const leafColumns = table_getCenterLeafColumns(table as any)
    const centerColumnIds = leafColumns.map((col) => col.id)

    expect(centerColumnIds).not.toContain('firstName')
    expect(centerColumnIds).not.toContain('lastName')
    expect(leafColumns.length).toBeGreaterThan(0)
  })
})

describe('table_getPinnedLeafColumns', () => {
  it('should return left pinned leaf columns when position is left', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: [],
        },
      },
    })

    const leafColumns = table_getPinnedLeafColumns(table as any, 'left')

    expect(leafColumns).toHaveLength(1)
    expect(leafColumns[0]?.id).toBe('firstName')
  })

  it('should return right pinned leaf columns when position is right', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: [],
          right: ['lastName'],
        },
      },
    })

    const leafColumns = table_getPinnedLeafColumns(table as any, 'right')

    expect(leafColumns).toHaveLength(1)
    expect(leafColumns[0]?.id).toBe('lastName')
  })

  it('should return center leaf columns when position is center', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
      },
    })

    const leafColumns = table_getPinnedLeafColumns(table as any, 'center')

    expect(leafColumns.length).toBeGreaterThan(0)
    expect(leafColumns.map((col) => col.id)).not.toContain('firstName')
    expect(leafColumns.map((col) => col.id)).not.toContain('lastName')
  })
})

describe('table_getPinnedVisibleLeafColumns', () => {
  it('should return visible leaf columns for specified position', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
        columnVisibility: {
          age: false,
        },
      },
    })

    const leftColumns = table_getPinnedVisibleLeafColumns(table as any, 'left')
    const rightColumns = table_getPinnedVisibleLeafColumns(table, 'right')
    const centerColumns = table_getPinnedVisibleLeafColumns(table, 'center')

    expect(leftColumns[0]?.id).toBe('firstName')
    expect(rightColumns[0]?.id).toBe('lastName')
    expect(centerColumns.map((col) => col.id)).not.toContain('age')
  })

  it('should return all visible leaf columns when no position specified', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnVisibility: {
          age: false,
        },
      },
    })

    const leafColumns = table_getPinnedVisibleLeafColumns(table as any)

    expect(leafColumns.map((col) => col.id)).not.toContain('age')
    expect(leafColumns.length).toBe(
      table_getVisibleLeafColumns(table as any).length,
    )
  })
})

describe('table_getFooterGroups', () => {
  it('should return footer groups for left pinned columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: [],
        },
      },
    })

    const footerGroups = table_getLeftFooterGroups(table as any)

    expect(footerGroups[0]?.headers[0]?.column.id).toBe('firstName')
  })

  it('should return footer groups for right pinned columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: [],
          right: ['lastName'],
        },
      },
    })

    const footerGroups = table_getRightFooterGroups(table as any)

    expect(footerGroups[0]?.headers[0]?.column.id).toBe('lastName')
  })

  it('should return footer groups for center columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
      },
    })

    const footerGroups = table_getCenterFooterGroups(table as any)
    const centerColumnIds = footerGroups[0]?.headers.map(
      (header) => header.column.id,
    )

    expect(centerColumnIds).not.toContain('firstName')
    expect(centerColumnIds).not.toContain('lastName')
    expect(footerGroups[0]?.headers.length).toBeGreaterThan(0)
  })
})

describe('table_getFlatHeaders', () => {
  it('should return flat headers for left pinned columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: [],
        },
      },
    })

    const flatHeaders = table_getLeftFlatHeaders(table as any)

    expect(flatHeaders).toHaveLength(1)
    expect(flatHeaders[0]?.column.id).toBe('firstName')
  })

  it('should return flat headers for right pinned columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: [],
          right: ['lastName'],
        },
      },
    })

    const flatHeaders = table_getRightFlatHeaders(table as any)

    expect(flatHeaders).toHaveLength(1)
    expect(flatHeaders[0]?.column.id).toBe('lastName')
  })

  it('should return flat headers for center columns', () => {
    const table = generateTestTableWithData(1, {
      state: {
        columnPinning: {
          left: ['firstName'],
          right: ['lastName'],
        },
      },
    })

    const flatHeaders = table_getCenterFlatHeaders(table as any)
    const centerColumnIds = flatHeaders.map((header) => header.column.id)

    expect(centerColumnIds).not.toContain('firstName')
    expect(centerColumnIds).not.toContain('lastName')
    expect(flatHeaders.length).toBeGreaterThan(0)
  })
})
