import { describe, expect, it, vi } from 'vitest'
import {
  column_getCanHide,
  column_getIsVisible,
  column_getToggleVisibilityHandler,
  column_toggleVisibility,
  getDefaultColumnVisibilityState,
  row_getAllVisibleCells,
  row_getVisibleCells,
  table_getIsAllColumnsVisible,
  table_getIsSomeColumnsVisible,
  table_getToggleAllColumnsVisibilityHandler,
  table_getVisibleFlatColumns,
  table_getVisibleLeafColumns,
  table_resetColumnVisibility,
  table_setColumnVisibility,
  table_toggleAllColumnsVisible,
} from '../../../../src'
import { generateTestTableWithData } from '../../../helpers/generateTestTable'
import { getUpdaterResult } from '../../../helpers/testUtils'

type TestFeatures = {
  columnVisibilityFeature: {}
}

describe('getDefaultColumnVisibilityState', () => {
  it('should return empty object', () => {
    const result = getDefaultColumnVisibilityState()
    expect(result).toEqual({})
  })
})

describe('column_getIsVisible', () => {
  it('should return true by default', () => {
    const table = generateTestTableWithData<TestFeatures>(1)
    const column = table.getAllColumns()[0]!

    const result = column_getIsVisible(column)

    expect(result).toBe(true)
  })

  it('should return false when column is hidden', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      state: {
        columnVisibility: {
          firstName: false,
        },
      },
    })
    const column = {
      ...table.getAllColumns()[0]!,
      id: 'firstName',
      table,
    }

    const result = column_getIsVisible(column as any)

    expect(result).toBe(false)
  })

  it('should return true if any child column is visible', () => {
    const table = generateTestTableWithData<TestFeatures>(1)
    const parentColumn = {
      ...table.getAllColumns()[0]!,
      columns: [
        { ...table.getAllColumns()[0]!, id: 'child1' },
        { ...table.getAllColumns()[1]!, id: 'child2' },
      ],
    }

    const result = column_getIsVisible(parentColumn as any)

    expect(result).toBe(true)
  })
})

describe('column_getCanHide', () => {
  it('should return true by default', () => {
    const table = generateTestTableWithData<TestFeatures>(1)
    const column = table.getAllColumns()[0]!

    const result = column_getCanHide(column)

    expect(result).toBe(true)
  })

  it('should return false when hiding is disabled globally', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      enableHiding: false,
    })
    const column = table.getAllColumns()[0]!

    const result = column_getCanHide(column)

    expect(result).toBe(false)
  })

  it('should return false when hiding is disabled for column', () => {
    const table = generateTestTableWithData<TestFeatures>(1)
    const column = {
      ...table.getAllColumns()[0]!,
      columnDef: { enableHiding: false },
    }

    const result = column_getCanHide(column as any)

    expect(result).toBe(false)
  })
})

describe('column_toggleVisibility', () => {
  it('should toggle column visibility', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      onColumnVisibilityChange,
    })
    const column = {
      ...table.getAllColumns()[0]!,
      id: 'firstName',
      table,
    }

    column_toggleVisibility(column as any)

    const result = getUpdaterResult(onColumnVisibilityChange, {})
    expect(result).toEqual({ firstName: false })
  })

  it('should set specific visibility when provided', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      onColumnVisibilityChange,
    })
    const column = {
      ...table.getAllColumns()[0]!,
      id: 'firstName',
      table,
    }

    column_toggleVisibility(column as any, true)

    const result = getUpdaterResult(onColumnVisibilityChange, {})
    expect(result).toEqual({ firstName: true })
  })

  it('should not toggle when column cannot be hidden', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      enableHiding: false,
      onColumnVisibilityChange,
    })
    const column = {
      ...table.getAllColumns()[0]!,
      id: 'firstName',
      table,
    }

    column_toggleVisibility(column as any)

    expect(onColumnVisibilityChange).not.toHaveBeenCalled()
  })
})

describe('column_getToggleVisibilityHandler', () => {
  it('should return handler that toggles visibility based on checkbox state', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      onColumnVisibilityChange,
    })
    const column = {
      ...table.getAllColumns()[0]!,
      id: 'firstName',
      table,
    }
    const handler = column_getToggleVisibilityHandler(column as any)

    handler({ target: { checked: true } } as any)

    const result = getUpdaterResult(onColumnVisibilityChange, {})
    expect(result).toEqual({ firstName: true })
  })
})

describe('row_getAllVisibleCells', () => {
  it('should return only visible cells', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      state: {
        columnVisibility: {
          firstName: false,
        },
      },
    })
    const row = table.getRowModel().rows[0]!

    const visibleCells = row_getAllVisibleCells(row)
    const visibleColumnIds = visibleCells.map((cell) => cell.column.id)

    expect(visibleColumnIds).not.toContain('firstName')
    expect(visibleCells.length).toBe(row.getAllCells().length - 1)
  })
})

describe('row_getVisibleCells', () => {
  it('should combine left, center and right cells', () => {
    const leftCells = [{ id: 'left' }]
    const centerCells = [{ id: 'center' }]
    const rightCells = [{ id: 'right' }]

    const result = row_getVisibleCells(
      leftCells as any,
      centerCells as any,
      rightCells as any,
    )

    expect(result).toEqual([...leftCells, ...centerCells, ...rightCells])
  })
})

describe('table_getVisibleFlatColumns', () => {
  it('should return only visible flat columns', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      state: {
        columnVisibility: {
          firstName: false,
        },
      },
    })

    const visibleColumns = table_getVisibleFlatColumns(table)
    const visibleColumnIds = visibleColumns.map((col) => col.id)

    expect(visibleColumnIds).not.toContain('firstName')
    expect(visibleColumns.length).toBe(table.getAllFlatColumns().length - 1)
  })
})

describe('table_getVisibleLeafColumns', () => {
  it('should return only visible leaf columns', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      state: {
        columnVisibility: {
          firstName: false,
        },
      },
    })

    const visibleColumns = table_getVisibleLeafColumns(table)
    const visibleColumnIds = visibleColumns.map((col) => col.id)

    expect(visibleColumnIds).not.toContain('firstName')
    expect(visibleColumns.length).toBe(table.getAllLeafColumns().length - 1)
  })
})

describe('table_setColumnVisibility', () => {
  it('should call onColumnVisibilityChange with updater', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      onColumnVisibilityChange,
    })

    table_setColumnVisibility(table, { firstName: false })

    expect(onColumnVisibilityChange).toHaveBeenCalledWith({ firstName: false })
  })
})

describe('table_resetColumnVisibility', () => {
  it('should reset to empty state when defaultState is true', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      onColumnVisibilityChange,
    })

    table_resetColumnVisibility(table, true)

    expect(onColumnVisibilityChange).toHaveBeenCalledWith({})
  })

  it('should reset to initial state when defaultState is false', () => {
    const initialState = { columnVisibility: { firstName: false } }
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      initialState,
      onColumnVisibilityChange,
    })

    table_resetColumnVisibility(table, false)

    expect(onColumnVisibilityChange).toHaveBeenCalledWith({ firstName: false })
  })
})

describe('table_toggleAllColumnsVisible', () => {
  it('should show all columns when value is true', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      onColumnVisibilityChange,
    })

    table_toggleAllColumnsVisible(table, true)

    expect(onColumnVisibilityChange).toHaveBeenCalled()
    const result = onColumnVisibilityChange.mock.calls[0]?.[0]
    const allColumnIds = table.getAllLeafColumns().map((col) => col.id)
    expect(Object.entries(result)).toEqual(allColumnIds.map((id) => [id, true]))
  })

  it('should hide all columns that can be hidden when value is false', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      onColumnVisibilityChange,
    })

    table_toggleAllColumnsVisible(table, false)

    expect(onColumnVisibilityChange).toHaveBeenCalled()
    const result = onColumnVisibilityChange.mock.calls[0]?.[0]
    const allColumnIds = table.getAllLeafColumns().map((col) => col.id)
    expect(Object.entries(result)).toEqual(
      allColumnIds.map((id) => [id, false]),
    )
  })
})

describe('table_getIsAllColumnsVisible', () => {
  it('should return true when all columns are visible', () => {
    const table = generateTestTableWithData<TestFeatures>(1)

    const result = table_getIsAllColumnsVisible(table)

    expect(result).toBe(true)
  })

  it('should return false when some columns are hidden', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      state: {
        columnVisibility: {
          firstName: false,
        },
      },
    })

    const result = table_getIsAllColumnsVisible(table)

    expect(result).toBe(false)
  })
})

describe('table_getIsSomeColumnsVisible', () => {
  it('should return true when some columns are visible', () => {
    const table = generateTestTableWithData<TestFeatures>(1, {
      state: {
        columnVisibility: {
          firstName: false,
        },
      },
    })

    const result = table_getIsSomeColumnsVisible(table)

    expect(result).toBe(true)
  })

  it('should return false when no columns are visible', () => {
    const table = generateTestTableWithData<TestFeatures>(1)
    const allColumnIds = table.getAllLeafColumns().map((col) => col.id)
    const hideAllColumns = Object.fromEntries(
      allColumnIds.map((id) => [id, false]),
    )

    const tableWithHiddenColumns = generateTestTableWithData<TestFeatures>(1, {
      state: {
        columnVisibility: hideAllColumns,
      },
    })

    const result = table_getIsSomeColumnsVisible(tableWithHiddenColumns)

    expect(result).toBe(false)
  })
})

describe('table_getToggleAllColumnsVisibilityHandler', () => {
  it('should return handler that toggles all columns visibility based on checkbox state', () => {
    const onColumnVisibilityChange = vi.fn()
    const table = generateTestTableWithData<TestFeatures>(1, {
      onColumnVisibilityChange,
    })
    const handler = table_getToggleAllColumnsVisibilityHandler(table)

    handler({ target: { checked: true } } as any)

    expect(onColumnVisibilityChange).toHaveBeenCalled()
    const result = onColumnVisibilityChange.mock.calls[0]?.[0]
    const allColumnIds = table.getAllLeafColumns().map((col) => col.id)
    expect(Object.entries(result)).toEqual(allColumnIds.map((id) => [id, true]))
  })
})
