import { describe, expect, it, vi } from 'vitest'
import { generateTestTableWithData } from '../../../helpers/generateTestTable'
import {
  column_getIndex,
  column_getIsFirstColumn,
  column_getIsLastColumn,
  getDefaultColumnOrderState,
  orderColumns,
  table_getOrderColumnsFn,
  table_resetColumnOrder,
  table_setColumnOrder,
} from '../../../../src/features/column-ordering/columnOrderingFeature.utils'
import type { TableFeatures } from '../../../../src'

describe('getDefaultColumnOrderState', () => {
  it('should return an empty array', () => {
    expect(getDefaultColumnOrderState()).toEqual([])
  })
})

describe('column_getIndex', () => {
  it('should return correct index for a column', () => {
    const table = generateTestTableWithData<TableFeatures>(3)
    const column = table.getAllLeafColumns()[1]!

    expect(column_getIndex(column)).toBe(1)
  })

  it('should return -1 for non-existent column', () => {
    const table = generateTestTableWithData<TableFeatures>(3)
    const column = {
      ...table.getAllLeafColumns()[0],
      id: 'non-existent',
      table,
    } as any

    expect(column_getIndex(column)).toBe(-1)
  })
})

describe('column_getIsFirstColumn', () => {
  it('should return true for first column', () => {
    const table = generateTestTableWithData<TableFeatures>(3)
    const firstColumn = table.getAllLeafColumns()[0]!

    expect(column_getIsFirstColumn(firstColumn)).toBe(true)
  })

  it('should return false for non-first column', () => {
    const table = generateTestTableWithData<TableFeatures>(3)
    const secondColumn = table.getAllLeafColumns()[1]!

    expect(column_getIsFirstColumn(secondColumn)).toBe(false)
  })
})

describe('column_getIsLastColumn', () => {
  it('should return true for last column', () => {
    const table = generateTestTableWithData<TableFeatures>(3)
    const columns = table.getAllLeafColumns()
    const lastColumn = columns[columns.length - 1]!

    expect(column_getIsLastColumn(lastColumn)).toBe(true)
  })

  it('should return false for non-last column', () => {
    const table = generateTestTableWithData<TableFeatures>(3)
    const firstColumn = table.getAllLeafColumns()[0]!

    expect(column_getIsLastColumn(firstColumn)).toBe(false)
  })
})

describe('table_setColumnOrder', () => {
  it('should call onColumnOrderChange with updater', () => {
    const onColumnOrderChange = vi.fn()
    const table = generateTestTableWithData<TableFeatures>(3, {
      onColumnOrderChange,
    })
    const newOrder = ['col1', 'col2']

    table_setColumnOrder(table, newOrder)

    expect(onColumnOrderChange).toHaveBeenCalledWith(newOrder)
  })
})

describe('table_resetColumnOrder', () => {
  it('should reset to empty array when defaultState is true', () => {
    const onColumnOrderChange = vi.fn()
    const table = generateTestTableWithData<TableFeatures>(3, {
      onColumnOrderChange,
    })

    table_resetColumnOrder(table, true)

    expect(onColumnOrderChange).toHaveBeenCalledWith([])
  })

  it('should reset to initialState when defaultState is false', () => {
    const initialColumnOrder = ['col1', 'col2']
    const onColumnOrderChange = vi.fn()
    const table = generateTestTableWithData<TableFeatures>(3, {
      onColumnOrderChange,
      initialState: { columnOrder: initialColumnOrder },
    })

    table_resetColumnOrder(table, false)

    expect(onColumnOrderChange).toHaveBeenCalledWith(initialColumnOrder)
  })
})

describe('table_getOrderColumnsFn', () => {
  it('should return original columns when no column order is specified', () => {
    const table = generateTestTableWithData<TableFeatures>(3)
    const columns = table.getAllLeafColumns()
    const orderFn = table_getOrderColumnsFn(table)

    expect(orderFn(columns)).toEqual(columns)
  })

  it('should reorder columns according to columnOrder', () => {
    const table = generateTestTableWithData<TableFeatures>(3, {
      state: {
        columnOrder: ['lastName', 'firstName'],
      },
    })
    const columns = table.getAllLeafColumns()
    const orderFn = table_getOrderColumnsFn(table)
    const orderedColumns = orderFn(columns)

    expect(orderedColumns[0]?.id).toBe('lastName')
    expect(orderedColumns[1]?.id).toBe('firstName')
  })
})

describe('orderColumns', () => {
  it('should return original columns when no grouping is present', () => {
    const table = generateTestTableWithData<TableFeatures>(3)
    const columns = table.getAllLeafColumns()

    expect(orderColumns(table, columns)).toEqual(columns)
  })

  it('should remove grouped columns when groupedColumnMode is "remove"', () => {
    const table = generateTestTableWithData<TableFeatures>(3, {
      state: {
        grouping: ['firstName'],
      },
      groupedColumnMode: 'remove',
    })
    const columns = table.getAllLeafColumns()
    const orderedColumns = orderColumns(table, columns)

    expect(orderedColumns.find((col) => col.id === 'firstName')).toBeUndefined()
  })

  it('should move grouped columns to start when groupedColumnMode is "reorder"', () => {
    const table = generateTestTableWithData<TableFeatures>(3, {
      state: {
        grouping: ['lastName'],
      },
      groupedColumnMode: 'reorder',
    })
    const columns = table.getAllLeafColumns()
    const orderedColumns = orderColumns(table, columns)

    expect(orderedColumns[0]?.id).toBe('lastName')
  })
})
