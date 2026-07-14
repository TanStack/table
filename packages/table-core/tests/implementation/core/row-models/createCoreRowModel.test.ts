import { describe, expect, it, vi } from 'vitest'
import { constructTable } from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { Table, TableOptions } from '../../../../src'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({})

function makeTable(
  data: Array<Person>,
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Person> {
  return constructTable({
    features,
    data,
    columns: generateTestColumnDefs<typeof features>(data),
    ...options,
  })
}

function makeNestedTable(
  lengths: Array<number>,
  options?: Partial<
    Omit<TableOptions<typeof features, Person>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Person> {
  return makeTable(generateTestData(...lengths), {
    getSubRows: (row) => row.subRows,
    ...options,
  })
}

describe('flatRows ordering', () => {
  it('should list rows depth-first with each parent before its children', () => {
    const table = makeNestedTable([2, 2, 2])

    expect(table.getCoreRowModel().flatRows.map((row) => row.id)).toEqual([
      '0',
      '0.0',
      '0.0.0',
      '0.0.1',
      '0.1',
      '0.1.0',
      '0.1.1',
      '1',
      '1.0',
      '1.0.0',
      '1.0.1',
      '1.1',
      '1.1.0',
      '1.1.1',
    ])
  })

  it('should have flatRows.length equal to the total node count', () => {
    const table = makeNestedTable([3, 2, 2])

    // 3 roots + 3*2 children + 3*2*2 grandchildren = 21
    expect(table.getCoreRowModel().flatRows.length).toBe(21)
    expect(table.getCoreRowModel().rows.length).toBe(3)
  })
})

describe('rowsById', () => {
  it('should contain every dotted default id for nested rows', () => {
    const table = makeNestedTable([2, 2])
    const { rowsById } = table.getCoreRowModel()

    expect(Object.keys(rowsById).sort()).toEqual(
      ['0', '0.0', '0.1', '1', '1.0', '1.1'].sort(),
    )
  })

  it('should reference the same row objects as flatRows', () => {
    const table = makeNestedTable([2, 2])
    const { rowsById, flatRows } = table.getCoreRowModel()

    for (const row of flatRows) {
      expect(rowsById[row.id]).toBe(row)
    }
  })
})

describe('default row id scheme', () => {
  it('should use the row index for root rows and parentId.index for children', () => {
    const table = makeNestedTable([2, 3])
    const { rows } = table.getCoreRowModel()

    expect(rows.map((row) => row.id)).toEqual(['0', '1'])
    expect(rows[1]!.subRows.map((row) => row.id)).toEqual(['1.0', '1.1', '1.2'])
  })
})

describe('custom getRowId', () => {
  it('should receive (originalRow, index, parentRow) including the parent for nested rows', () => {
    const data = generateTestData(2, 2)
    const getRowId = vi.fn(
      (originalRow: Person, _index: number, parentRow?: any) =>
        parentRow ? `${parentRow.id}>${originalRow.id}` : originalRow.id,
    )
    const table = makeTable(data, {
      getSubRows: (row) => row.subRows,
      getRowId,
    })

    const model = table.getCoreRowModel()

    // Root call for first row: no parent
    expect(getRowId).toHaveBeenCalledWith(data[0], 0, undefined)
    // Nested call: parentRow is the constructed parent row object
    const parentRow = model.rows[0]!
    expect(getRowId).toHaveBeenCalledWith(data[0]!.subRows![1], 1, parentRow)
    expect(getRowId).toHaveBeenCalledTimes(6)
  })

  it('should key rowsById with the custom ids for nested rows', () => {
    const data = generateTestData(2, 2)
    const table = makeTable(data, {
      getSubRows: (row) => row.subRows,
      getRowId: (originalRow) => originalRow.id,
    })

    const { rowsById } = table.getCoreRowModel()

    for (const person of data) {
      expect(rowsById[person.id]?.original).toBe(person)
      for (const child of person.subRows!) {
        expect(rowsById[child.id]?.original).toBe(child)
      }
    }
  })

  it('should keep both rows in flatRows but last-write-wins in rowsById for duplicate ids', () => {
    // Documents existing behavior: duplicate ids silently overwrite each
    // other in rowsById while flatRows keeps every row.
    const data = generateTestData(3)
    const table = makeTable(data, {
      getRowId: (_originalRow, index) => (index < 2 ? 'dupe' : String(index)),
    })

    const { flatRows, rowsById } = table.getCoreRowModel()

    expect(flatRows.length).toBe(3)
    expect(Object.keys(rowsById).sort()).toEqual(['2', 'dupe'])
    expect(rowsById['dupe']).toBe(flatRows[1])
    expect(rowsById['dupe']).not.toBe(flatRows[0])
  })
})

describe('getSubRows edge cases', () => {
  it('should yield empty subRows when getSubRows returns undefined', () => {
    const data = generateTestData(2)
    const table = makeTable(data, { getSubRows: () => undefined })

    for (const row of table.getCoreRowModel().rows) {
      expect(row.subRows).toEqual([])
    }
  })

  it('should yield empty subRows when getSubRows returns an empty array', () => {
    const data = generateTestData(2)
    const table = makeTable(data, { getSubRows: () => [] })

    for (const row of table.getCoreRowModel().rows) {
      expect(row.subRows).toEqual([])
    }
  })

  it('should call getSubRows with (originalRow, index)', () => {
    const data = generateTestData(3)
    const getSubRows = vi.fn((row: Person) => row.subRows)
    const table = makeTable(data, { getSubRows })

    table.getCoreRowModel()

    expect(getSubRows).toHaveBeenCalledTimes(3)
    expect(getSubRows).toHaveBeenNthCalledWith(1, data[0], 0)
    expect(getSubRows).toHaveBeenNthCalledWith(3, data[2], 2)
  })

  it('should stay flat when nested raw data is used without getSubRows', () => {
    const table = makeTable(generateTestData(2, 2))
    const model = table.getCoreRowModel()

    expect(model.flatRows.length).toBe(2)
    for (const row of model.rows) {
      expect(row.subRows).toEqual([])
      expect(row.originalSubRows).toBeUndefined()
    }
  })
})

describe('row depth and parentId', () => {
  it('should assign depth 0, 1, 2 and the correct parentId for nested rows', () => {
    const table = makeNestedTable([1, 1, 1])
    const { rowsById } = table.getCoreRowModel()

    expect(rowsById['0']!.depth).toBe(0)
    expect(rowsById['0']!.parentId).toBeUndefined()
    expect(rowsById['0.0']!.depth).toBe(1)
    expect(rowsById['0.0']!.parentId).toBe('0')
    expect(rowsById['0.0.0']!.depth).toBe(2)
    expect(rowsById['0.0.0']!.parentId).toBe('0.0')
  })
})

describe('originalSubRows', () => {
  it('should equal the raw subRows array by reference', () => {
    const data = generateTestData(2, 2)
    const table = makeTable(data, { getSubRows: (row) => row.subRows })

    const { rows } = table.getCoreRowModel()

    expect(rows[0]!.originalSubRows).toBe(data[0]!.subRows)
    expect(rows[1]!.originalSubRows).toBe(data[1]!.subRows)
  })
})

describe('empty data', () => {
  it('should return empty rows, flatRows, and rowsById', () => {
    const table = makeTable([])
    const model = table.getCoreRowModel()

    expect(model.rows).toEqual([])
    expect(model.flatRows).toEqual([])
    expect(model.rowsById).toEqual({})
  })
})

describe('memoization', () => {
  it('should return the same model object across repeated calls', () => {
    const table = makeTable(generateTestData(3))

    const first = table.getCoreRowModel()

    expect(table.getCoreRowModel()).toBe(first)
    expect(table.getCoreRowModel().rows[0]).toBe(first.rows[0])
  })

  it('should build a new model when the data array identity changes', () => {
    const data = generateTestData(3)
    const table = makeTable(data)
    const first = table.getCoreRowModel()

    table.setOptions((old) => ({ ...old, data: [...data] }))
    const second = table.getCoreRowModel()

    expect(second).not.toBe(first)
    expect(second.rows[0]).not.toBe(first.rows[0])
    expect(second.rows.length).toBe(first.rows.length)
  })

  it('should preserve the cached model when setOptions keeps the same data reference', () => {
    const table = makeTable(generateTestData(3))
    const first = table.getCoreRowModel()

    table.setOptions((old) => ({ ...old, renderFallbackValue: 'N/A' }))

    expect(table.getCoreRowModel()).toBe(first)
  })
})
