import { describe, expect, it, vi } from 'vitest'
import { columnOrderingFeature, constructTable } from '../../../../src'
import {
  row_getAllCells,
  row_getAllCellsByColumnId,
  row_getLeafRows,
  row_getParentRow,
  row_getParentRows,
  row_getUniqueValues,
  row_getValue,
  row_renderValue,
  table_getRow,
  table_getRowId,
  table_getMaxSubRowDepth,
} from '../../../../src/core/rows/coreRowsFeature.utils'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { ColumnDef, Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  columnOrderingFeature,
})

function makeTable(rowCount: number): Table<typeof features, Person> {
  const data = generateTestData(rowCount)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
  })
}

describe('row_getAllCells', () => {
  it('should build one cell per leaf column in leaf column order', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const cells = row_getAllCells(row)

    expect(cells.map((cell) => cell.column.id)).toEqual(
      table.getAllLeafColumns().map((col) => col.id),
    )
    expect(cells.every((cell) => cell.row === row)).toBe(true)
  })

  it('should reuse cell instances across calls', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const firstCells = row_getAllCells(row)
    const secondCells = row_getAllCells(row)

    expect(secondCells).not.toBe(firstCells)
    for (let i = 0; i < firstCells.length; i++) {
      expect(secondCells[i]).toBe(firstCells[i])
    }
  })

  it('should preserve cell identity across column order changes', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const cellsBefore = row.getAllCells()
    const cellsByColumnIdBefore = new Map(
      cellsBefore.map((cell) => [cell.column.id, cell]),
    )

    table.setColumnOrder(['lastName', 'firstName'])

    const cellsAfter = row.getAllCells()

    expect(cellsAfter).not.toBe(cellsBefore)
    expect(cellsAfter[0]?.column.id).toBe('lastName')
    expect(cellsAfter[1]?.column.id).toBe('firstName')
    for (const cell of cellsAfter) {
      expect(cell).toBe(cellsByColumnIdBefore.get(cell.column.id))
    }
  })
})

function makeNestedTable(
  lengths: Array<number> = [3, 2],
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Person> {
  const data = generateTestData(...lengths)
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
    getSubRows: (row) => row.subRows,
    ...options,
  })
}

describe('row_getValue', () => {
  it('should read and cache the accessor value', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const value = row_getValue(row, 'firstName')

    expect(typeof value).toBe('string')
    expect(row_getValue(row, 'firstName')).toBe(value)
  })

  it('should return undefined for unknown columns', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    expect(row_getValue(row, 'not-a-column')).toBeUndefined()
  })
})

describe('row_getUniqueValues', () => {
  it('should wrap the accessor value in an array by default', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    expect(row_getUniqueValues(row, 'firstName')).toEqual([
      row.getValue('firstName'),
    ])
  })

  it('should prefer getUniqueValues and cache the result per row', () => {
    const getUniqueValues = vi.fn(() => ['x', 'y'])
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { accessorKey: 'firstName', id: 'firstName', getUniqueValues },
    ]
    const data = generateTestData(1)
    const table = constructTable({ features, data, columns })
    const row = table.getRowModel().rows[0]!

    expect(row_getUniqueValues(row, 'firstName')).toEqual(['x', 'y'])
    expect(row_getUniqueValues(row, 'firstName')).toEqual(['x', 'y'])
    expect(getUniqueValues).toHaveBeenCalledTimes(1)
  })

  it('should return undefined for unknown columns', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    expect(row_getUniqueValues(row, 'not-a-column')).toBeUndefined()
  })
})

describe('row_renderValue', () => {
  it('should return the accessor value when present', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    expect(row_renderValue(row, 'firstName')).toBe(row.getValue('firstName'))
  })

  it('should fall back to renderFallbackValue for nullish values', () => {
    const columns: Array<ColumnDef<typeof features, Person, any>> = [
      { id: 'nothing', accessorFn: () => null },
    ]
    const data = generateTestData(1)
    const table = constructTable({
      features,
      data,
      columns,
      renderFallbackValue: 'N/A',
    })
    const row = table.getRowModel().rows[0]!

    expect(row_renderValue(row, 'nothing')).toBe('N/A')
  })
})

describe('row tree readers', () => {
  it('memoizes the deepest structural sub-row depth on the table', () => {
    const table = makeNestedTable([2, 2, 2])
    const coreRowModel = table.getCoreRowModel()

    expect(table_getMaxSubRowDepth(table as any)).toBe(2)
    expect(table.getMaxSubRowDepth()).toBe(2)
    expect(table.getMaxSubRowDepth()).toBe(2)
    expect(table.getCoreRowModel()).toBe(coreRowModel)
  })

  it('returns zero for flat and empty row models', () => {
    expect(makeTable(2).getMaxSubRowDepth()).toBe(0)
    expect(makeTable(0).getMaxSubRowDepth()).toBe(0)
  })

  it('row_getLeafRows should flatten all descendants', () => {
    const table = makeNestedTable([2, 2, 2])
    const row = table.getRow('0')

    expect(row_getLeafRows(row).map((leaf) => leaf.id)).toEqual([
      '0.0',
      '0.0.0',
      '0.0.1',
      '0.1',
      '0.1.0',
      '0.1.1',
    ])
  })

  it('row_getParentRow should return the direct parent or undefined', () => {
    const table = makeNestedTable()

    expect(row_getParentRow(table.getRow('0.1', true))?.id).toBe('0')
    expect(row_getParentRow(table.getRow('0'))).toBeUndefined()
  })

  it('row_getParentRows should collect ancestors from root to parent', () => {
    const table = makeNestedTable([2, 2, 2])

    expect(
      row_getParentRows(table.getRow('0.1.0', true)).map((r) => r.id),
    ).toEqual(['0', '0.1'])
    expect(row_getParentRows(table.getRow('1'))).toEqual([])
  })
})

describe('row_getAllCellsByColumnId', () => {
  it('should key this row cells by column id', () => {
    const table = makeTable(1)
    const row = table.getRowModel().rows[0]!

    const cellsById = row_getAllCellsByColumnId(row)

    expect(Object.keys(cellsById)).toEqual(
      table.getAllLeafColumns().map((column) => column.id),
    )
    expect(cellsById['firstName']!.column.id).toBe('firstName')
    expect(cellsById['firstName']!.row).toBe(row)
  })
})

describe('table_getRowId', () => {
  it('should default to the row index for root rows', () => {
    const table = makeTable(2)

    expect(table_getRowId(generateTestData(1)[0]!, table, 1)).toBe('1')
  })

  it('should join parent ids with a dot for child rows', () => {
    const table = makeNestedTable()
    const parent = table.getRow('1')

    expect(table_getRowId(generateTestData(1)[0]!, table, 2, parent)).toBe(
      '1.2',
    )
  })

  it('should prefer options.getRowId', () => {
    const data = generateTestData(2)
    const table = constructTable({
      features,
      data,
      columns: generateTestColumnDefs<typeof features>(data),
      getRowId: (originalRow) => originalRow.id,
    })

    expect(Object.keys(table.getCoreRowModel().rowsById)).toEqual(
      data.map((person) => person.id),
    )
  })
})

describe('table_getRow', () => {
  it('should find rows by id, including nested rows', () => {
    const table = makeNestedTable()

    expect(table_getRow(table, '1').id).toBe('1')
    expect(table_getRow(table, '0.1', true).id).toBe('0.1')
  })

  it('should throw for unknown row ids', () => {
    const table = makeTable(1)

    expect(() => table_getRow(table, 'not-a-row')).toThrow()
  })
})
