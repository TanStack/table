import { describe, expect, it, vi } from 'vitest'
import { columnVisibilityFeature, constructTable } from '../../../../src'
import {
  column_getCanHide,
  column_getIsVisible,
  column_getToggleVisibilityHandler,
  column_toggleVisibility,
  getDefaultColumnVisibilityState,
  row_getVisibleCells,
  row_getVisibleCellsByColumnId,
  table_getIsAllColumnsVisible,
  table_getIsSomeColumnsVisible,
  table_getToggleAllColumnsVisibilityHandler,
  table_getVisibleFlatColumns,
  table_getVisibleLeafColumns,
  table_resetColumnVisibility,
  table_setColumnVisibility,
  table_toggleAllColumnsVisible,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import { getUpdaterResult } from '../../../helpers/testUtils'
import type { ColumnDef, Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
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

describe('columnVisibilityFeature.utils', () => {
  describe('getDefaultColumnVisibilityState', () => {
    it('should return empty object', () => {
      const result = getDefaultColumnVisibilityState()
      expect(result).toEqual({})
    })
  })

  describe('column_getIsVisible', () => {
    it('should return true by default', () => {
      const table = makeTable(1)
      const column = table.getAllColumns()[0]!

      const result = column_getIsVisible(column)

      expect(result).toBe(true)
    })

    it('should return false when column is hidden', () => {
      const table = makeTable(1, {
        initialState: {
          columnVisibility: {
            firstName: false,
          },
        },
      })
      const column = table.getColumn('firstName')!

      const result = column_getIsVisible(column)

      expect(result).toBe(false)
    })

    it('should return true if any child column is visible', () => {
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
        data: generateTestData(1),
        columns,
        initialState: {
          columnVisibility: {
            firstName: false,
          },
        },
      })
      const parentColumn = table.getAllColumns()[0]!

      const result = column_getIsVisible(parentColumn)

      expect(result).toBe(true)
    })
  })

  describe('column_getCanHide', () => {
    it('should return true by default', () => {
      const table = makeTable(1)
      const column = table.getAllColumns()[0]!

      const result = column_getCanHide(column)

      expect(result).toBe(true)
    })

    it('should return false when hiding is disabled globally', () => {
      const table = makeTable(1, {
        enableHiding: false,
      })
      const column = table.getAllColumns()[0]!

      const result = column_getCanHide(column)

      expect(result).toBe(false)
    })

    it('should return false when hiding is disabled for column', () => {
      const columns: Array<ColumnDef<typeof features, Person, any>> = [
        { accessorKey: 'firstName', id: 'firstName', enableHiding: false },
      ]
      const table = constructTable({
        features,
        data: generateTestData(1),
        columns,
      })
      const column = table.getAllColumns()[0]!

      const result = column_getCanHide(column)

      expect(result).toBe(false)
    })
  })

  describe('column_toggleVisibility', () => {
    it('should toggle column visibility', () => {
      const onColumnVisibilityChange = vi.fn()
      const table = makeTable(1, {
        onColumnVisibilityChange,
      })
      const column = table.getColumn('firstName')!

      column_toggleVisibility(column)

      const result = getUpdaterResult(onColumnVisibilityChange, {})
      expect(result).toEqual({ firstName: false })
    })

    it('should set specific visibility when provided', () => {
      const onColumnVisibilityChange = vi.fn()
      const table = makeTable(1, {
        onColumnVisibilityChange,
      })
      const column = table.getColumn('firstName')!

      column_toggleVisibility(column, true)

      const result = getUpdaterResult(onColumnVisibilityChange, {})
      expect(result).toEqual({ firstName: true })
    })

    it('should toggle hideable leaf columns for a group column', () => {
      const onColumnVisibilityChange = vi.fn()
      const columns: Array<ColumnDef<typeof features, Person, any>> = [
        {
          id: 'name',
          columns: [
            { accessorKey: 'firstName', id: 'firstName' },
            {
              accessorKey: 'lastName',
              id: 'lastName',
              enableHiding: false,
            },
          ],
        },
      ]
      const table = constructTable({
        features,
        data: generateTestData(1),
        columns,
        onColumnVisibilityChange,
      })
      const groupColumn = table.getColumn('name')!

      column_toggleVisibility(groupColumn, false)

      const result = getUpdaterResult(onColumnVisibilityChange, {})
      expect(result).toEqual({ firstName: false })
      expect(result).not.toHaveProperty('name')
    })

    it('should infer group visibility toggles from its leaf columns', () => {
      const onColumnVisibilityChange = vi.fn()
      const columns: Array<ColumnDef<typeof features, Person, any>> = [
        {
          id: 'name',
          columns: [
            { accessorKey: 'firstName', id: 'firstName' },
            { accessorKey: 'lastName', id: 'lastName' },
          ],
        },
      ]
      const table = constructTable({
        features,
        data: generateTestData(1),
        columns,
        onColumnVisibilityChange,
      })
      const groupColumn = table.getColumn('name')!

      column_toggleVisibility(groupColumn)

      const result = getUpdaterResult(onColumnVisibilityChange, {})
      expect(result).toEqual({ firstName: false, lastName: false })
    })

    it('should not toggle when column cannot be hidden', () => {
      const onColumnVisibilityChange = vi.fn()
      const table = makeTable(1, {
        enableHiding: false,
        onColumnVisibilityChange,
      })
      const column = table.getColumn('firstName')!

      column_toggleVisibility(column)

      expect(onColumnVisibilityChange).not.toHaveBeenCalled()
    })
  })

  describe('column_getToggleVisibilityHandler', () => {
    it('should return handler that toggles visibility based on checkbox state', () => {
      const onColumnVisibilityChange = vi.fn()
      const table = makeTable(1, {
        onColumnVisibilityChange,
      })
      const column = table.getColumn('firstName')!
      const handler = column_getToggleVisibilityHandler(column)

      handler({ target: { checked: true } })

      const result = getUpdaterResult(onColumnVisibilityChange, {})
      expect(result).toEqual({ firstName: true })
    })
  })

  describe('row_getVisibleCells', () => {
    it('should return only visible cells', () => {
      const table = makeTable(1, {
        initialState: {
          columnVisibility: {
            firstName: false,
          },
        },
      })
      const row = table.getRowModel().rows[0]!

      const visibleCells = row_getVisibleCells(row)
      const visibleColumnIds = visibleCells.map((cell) => cell.column.id)

      expect(visibleColumnIds).not.toContain('firstName')
      expect(visibleCells.length).toBe(row.getAllCells().length - 1)
    })
  })

  describe('table_getVisibleFlatColumns', () => {
    it('should return only visible flat columns', () => {
      const table = makeTable(1, {
        initialState: {
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
      const table = makeTable(1, {
        initialState: {
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
      const table = makeTable(1, {
        onColumnVisibilityChange,
      })

      table_setColumnVisibility(table, { firstName: false })

      expect(onColumnVisibilityChange).toHaveBeenCalledWith({
        firstName: false,
      })
    })
  })

  describe('table_resetColumnVisibility', () => {
    it('should reset to empty state when defaultState is true', () => {
      const onColumnVisibilityChange = vi.fn()
      const table = makeTable(1, {
        onColumnVisibilityChange,
      })

      table_resetColumnVisibility(table, true)

      expect(onColumnVisibilityChange).toHaveBeenCalledWith({})
    })

    it('should reset to initial state when defaultState is false', () => {
      const initialState = { columnVisibility: { firstName: false } }
      const onColumnVisibilityChange = vi.fn()
      const table = makeTable(1, {
        initialState,
        onColumnVisibilityChange,
      })

      table_resetColumnVisibility(table, false)

      expect(onColumnVisibilityChange).toHaveBeenCalledWith({
        firstName: false,
      })
    })
  })

  describe('table_toggleAllColumnsVisible', () => {
    it('should show all columns when value is true', () => {
      const onColumnVisibilityChange = vi.fn()
      const table = makeTable(1, {
        onColumnVisibilityChange,
      })

      table_toggleAllColumnsVisible(table, true)

      expect(onColumnVisibilityChange).toHaveBeenCalled()
      const result = onColumnVisibilityChange.mock.calls[0]?.[0]
      const allColumnIds = table.getAllLeafColumns().map((col) => col.id)
      expect(Object.entries(result)).toEqual(
        allColumnIds.map((id) => [id, true]),
      )
    })

    it('should hide all columns that can be hidden when value is false', () => {
      const onColumnVisibilityChange = vi.fn()
      const table = makeTable(1, {
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
      const table = makeTable(1)

      const result = table_getIsAllColumnsVisible(table)

      expect(result).toBe(true)
    })

    it('should return false when some columns are hidden', () => {
      const table = makeTable(1, {
        initialState: {
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
      const table = makeTable(1, {
        initialState: {
          columnVisibility: {
            firstName: false,
          },
        },
      })

      const result = table_getIsSomeColumnsVisible(table)

      expect(result).toBe(true)
    })

    it('should return false when no columns are visible', () => {
      const table = makeTable(1)
      const allColumnIds = table.getAllLeafColumns().map((col) => col.id)
      const hideAllColumns = Object.fromEntries(
        allColumnIds.map((id) => [id, false]),
      )

      const tableWithHiddenColumns = makeTable(1, {
        initialState: {
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
      const table = makeTable(1, {
        onColumnVisibilityChange,
      })
      const handler = table_getToggleAllColumnsVisibilityHandler(table)

      handler({ target: { checked: true } })

      expect(onColumnVisibilityChange).toHaveBeenCalled()
      const result = onColumnVisibilityChange.mock.calls[0]?.[0]
      const allColumnIds = table.getAllLeafColumns().map((col) => col.id)
      expect(Object.entries(result)).toEqual(
        allColumnIds.map((id) => [id, true]),
      )
    })
  })
})

describe('row_getVisibleCellsByColumnId', () => {
  it('should key only visible cells by column id', () => {
    const table = makeTable(1, {
      initialState: {
        columnVisibility: {
          firstName: false,
        },
      },
    })
    const row = table.getRowModel().rows[0]!

    const cellsById = row_getVisibleCellsByColumnId(row)

    expect(cellsById['firstName']).toBeUndefined()
    expect(cellsById['lastName']!.column.id).toBe('lastName')
    expect(Object.keys(cellsById)).toEqual(
      row.getVisibleCells().map((cell) => cell.column.id),
    )
  })
})
