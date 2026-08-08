import { describe, expect, it, vi } from 'vitest'
import {
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  constructTable,
} from '../../../../src'
import {
  column_getIndex,
  column_getIsFirstColumn,
  column_getIsLastColumn,
  getDefaultColumnOrderState,
  orderColumns,
  table_getColumnIndexes,
  table_getOrderColumnsFn,
  table_getPinnedVisibleLeafColumns,
  table_resetColumnOrder,
  table_setColumnOrder,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
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

describe('getDefaultColumnOrderState', () => {
  it('should return an empty array', () => {
    expect(getDefaultColumnOrderState()).toEqual([])
  })
})

describe('table_getColumnIndexes', () => {
  it('should map each visible column id to its index within each region', () => {
    const table = makeTable(3, {
      initialState: {
        columnPinning: {
          start: ['lastName'],
          end: ['age'],
        },
        columnVisibility: {
          firstName: false,
        },
      },
    })

    const indexes = table_getColumnIndexes(table)

    for (const [key, position] of [
      ['all', undefined],
      ['start', 'start'],
      ['end', 'end'],
      ['center', 'center'],
    ] as const) {
      const columns = table_getPinnedVisibleLeafColumns(table, position)
      expect(indexes[key]).toEqual(
        Object.fromEntries(columns.map((col, i) => [col.id, i])),
      )
    }
  })
})

describe('column_getIndex', () => {
  it('should return correct index for a column', () => {
    const table = makeTable(3)
    const column = table.getAllLeafColumns()[1]!

    expect(column_getIndex(column)).toBe(1)
  })

  it('should return -1 for a column that is not visible', () => {
    const table = makeTable(3, {
      initialState: {
        columnVisibility: {
          firstName: false,
        },
      },
    })
    const column = table.getColumn('firstName')!

    expect(column_getIndex(column)).toBe(-1)
  })

  it('should return the index within the requested pinning region', () => {
    const table = makeTable(3, {
      initialState: {
        columnPinning: {
          start: ['lastName', 'firstName'],
          end: ['age'],
        },
      },
    })
    const columns = table.getAllLeafColumns()
    const firstName = columns.find((col) => col.id === 'firstName')!
    const age = columns.find((col) => col.id === 'age')!
    const visits = columns.find((col) => col.id === 'visits')!

    expect(column_getIndex(firstName, 'start')).toBe(1)
    expect(column_getIndex(age, 'end')).toBe(0)
    expect(column_getIndex(visits, 'center')).toBeGreaterThanOrEqual(0)
    expect(column_getIndex(firstName, 'end')).toBe(-1)
    expect(column_getIndex(firstName, 'center')).toBe(-1)
  })

  it('should recompute the instance API after column order changes', () => {
    const table = makeTable(1)

    const lastName = table.getColumn('lastName')!

    expect(lastName.getIndex()).toBe(2)
    expect(table.getColumnIndexes().all['lastName']).toBe(2)

    table.setColumnOrder(['lastName', 'firstName'])

    expect(lastName.getIndex()).toBe(0)
    expect(table.getColumnIndexes().all['lastName']).toBe(0)
  })
})

describe('column_getIsFirstColumn', () => {
  it('should return true for first column', () => {
    const table = makeTable(3)
    const firstColumn = table.getAllLeafColumns()[0]!

    expect(column_getIsFirstColumn(firstColumn)).toBe(true)
  })

  it('should return false for non-first column', () => {
    const table = makeTable(3)
    const secondColumn = table.getAllLeafColumns()[1]!

    expect(column_getIsFirstColumn(secondColumn)).toBe(false)
  })
})

describe('column_getIsLastColumn', () => {
  it('should return true for last column', () => {
    const table = makeTable(3)
    const columns = table.getAllLeafColumns()
    const lastColumn = columns[columns.length - 1]!

    expect(column_getIsLastColumn(lastColumn)).toBe(true)
  })

  it('should return false for non-last column', () => {
    const table = makeTable(3)
    const firstColumn = table.getAllLeafColumns()[0]!

    expect(column_getIsLastColumn(firstColumn)).toBe(false)
  })
})

describe('table_setColumnOrder', () => {
  it('should call onColumnOrderChange with updater', () => {
    const onColumnOrderChange = vi.fn()
    const table = makeTable(3, {
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
    const table = makeTable(3, {
      onColumnOrderChange,
      state: { columnOrder: ['col1'] },
    })

    table_resetColumnOrder(table, true)

    expect(onColumnOrderChange).toHaveBeenCalledWith([])
  })

  it('should reset to initialState when defaultState is false', () => {
    const initialColumnOrder = ['col1', 'col2']
    const onColumnOrderChange = vi.fn()
    const table = makeTable(3, {
      onColumnOrderChange,
      initialState: { columnOrder: initialColumnOrder },
      state: { columnOrder: [] },
    })

    table_resetColumnOrder(table, false)

    expect(onColumnOrderChange).toHaveBeenCalledWith(initialColumnOrder)
  })
})

describe('table_getOrderColumnsFn', () => {
  it('should return original columns when no column order is specified', () => {
    const table = makeTable(3)
    const columns = table.getAllLeafColumns()
    const orderFn = table_getOrderColumnsFn(table)

    expect(orderFn(columns)).toEqual(columns)
  })

  it('should reorder columns according to columnOrder', () => {
    const table = makeTable(3, {
      initialState: {
        columnOrder: ['lastName', 'firstName'],
      },
    })
    const columns = table.getAllLeafColumns()
    const orderFn = table_getOrderColumnsFn(table)
    const orderedColumns = orderFn(columns)

    expect(orderedColumns[0]?.id).toBe('lastName')
    expect(orderedColumns[1]?.id).toBe('firstName')
  })

  it('should append leftover columns in original order when columnOrder is partial', () => {
    const table = makeTable(3, {
      initialState: {
        columnOrder: ['age', 'firstName'],
      },
    })
    const columns = table.getAllLeafColumns()
    const originalIds = columns.map((c) => c.id)
    const orderFn = table_getOrderColumnsFn(table)
    const orderedIds = orderFn(columns).map((c) => c.id)

    expect(orderedIds.slice(0, 2)).toEqual(['age', 'firstName'])
    const leftoverIds = originalIds.filter(
      (id) => id !== 'age' && id !== 'firstName',
    )
    expect(orderedIds.slice(2)).toEqual(leftoverIds)
  })

  it('should skip unknown ids in columnOrder', () => {
    const table = makeTable(3, {
      initialState: {
        columnOrder: ['unknown1', 'lastName', 'unknown2', 'firstName'],
      },
    })
    const columns = table.getAllLeafColumns()
    const originalIds = columns.map((c) => c.id)
    const orderFn = table_getOrderColumnsFn(table)
    const orderedIds = orderFn(columns).map((c) => c.id)

    expect(orderedIds.slice(0, 2)).toEqual(['lastName', 'firstName'])
    expect(orderedIds).toHaveLength(originalIds.length)
    expect(new Set(orderedIds)).toEqual(new Set(originalIds))
  })

  it('should not duplicate columns when columnOrder contains duplicates', () => {
    const table = makeTable(3, {
      initialState: {
        columnOrder: ['lastName', 'lastName', 'firstName'],
      },
    })
    const columns = table.getAllLeafColumns()
    const originalIds = columns.map((c) => c.id)
    const orderFn = table_getOrderColumnsFn(table)
    const orderedIds = orderFn(columns).map((c) => c.id)

    expect(orderedIds).toHaveLength(originalIds.length)
    expect(new Set(orderedIds)).toEqual(new Set(originalIds))
    expect(orderedIds[0]).toBe('lastName')
    expect(orderedIds[1]).toBe('firstName')
  })
})

describe('orderColumns', () => {
  it('should return original columns when no grouping is present', () => {
    const table = makeTable(3)
    const columns = table.getAllLeafColumns()

    expect(orderColumns(table, columns)).toEqual(columns)
  })

  it('should remove grouped columns when groupedColumnMode is "remove"', () => {
    const table = makeTable(3, {
      initialState: {
        grouping: ['firstName'],
      },
      groupedColumnMode: 'remove',
    })
    const columns = table.getAllLeafColumns()
    const orderedColumns = orderColumns(table, columns)

    expect(orderedColumns.find((col) => col.id === 'firstName')).toBeUndefined()
  })

  it('should move grouped columns to start when groupedColumnMode is "reorder"', () => {
    const table = makeTable(3, {
      initialState: {
        grouping: ['lastName'],
      },
      groupedColumnMode: 'reorder',
    })
    const columns = table.getAllLeafColumns()
    const orderedColumns = orderColumns(table, columns)

    expect(orderedColumns[0]?.id).toBe('lastName')
  })

  it('should preserve grouping order and original order for non-grouping when reordering', () => {
    const table = makeTable(3, {
      initialState: {
        grouping: ['age', 'firstName'],
      },
      groupedColumnMode: 'reorder',
    })
    const columns = table.getAllLeafColumns()
    const originalIds = columns.map((c) => c.id)
    const orderedIds = orderColumns(table, columns).map((c) => c.id)

    expect(orderedIds.slice(0, 2)).toEqual(['age', 'firstName'])
    const leftoverIds = originalIds.filter(
      (id) => id !== 'age' && id !== 'firstName',
    )
    expect(orderedIds.slice(2)).toEqual(leftoverIds)
  })
})
