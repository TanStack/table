import { describe, expect, it } from 'vitest'
import {
  row_getIsPlaceholder,
  table_getMissingRowRanges,
} from '../../../../src/static-functions'
import { constructTable, sparseRowsFeature } from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { Table, TableOptions, Table_Internal } from '../../../../src'

interface Person {
  id: string
  name: string
}

const features = testFeatures({ sparseRowsFeature })

// Core-only tables exercise the static functions on tables that never
// registered sparseRowsFeature.
const coreOnlyFeatures = testFeatures({})

function makeSparseData(...ranges: Array<[number, number]>): Array<Person> {
  const data: Array<Person> = []
  for (const [startIndex, endIndex] of ranges) {
    for (let i = startIndex; i <= endIndex; i++) {
      data[i] = { id: `person-${i}`, name: `Person ${i}` }
    }
  }
  return data
}

function makeTable(
  options?: Partial<TableOptions<typeof features, Person>>,
): Table<typeof features, Person> {
  return constructTable<typeof features, Person>({
    features,
    columns: [{ accessorKey: 'name', id: 'name' }],
    data: makeSparseData([10, 19], [40, 59]),
    rowCount: 100,
    getRowId: (person) => person.id,
    ...options,
  })
}

function asInternal(table: Table<typeof features, Person>) {
  return table as unknown as Table_Internal<typeof features, Person>
}

describe('table_getMissingRowRanges', () => {
  it('should return the exact gaps with both bounds included', () => {
    const table = makeTable()

    expect(
      table_getMissingRowRanges(asInternal(table), {
        startIndex: 0,
        endIndex: 99,
      }),
    ).toEqual([
      { startIndex: 0, endIndex: 9 },
      { startIndex: 20, endIndex: 39 },
      { startIndex: 60, endIndex: 99 },
    ])
    expect(table.getMissingRowRanges({ startIndex: 5, endIndex: 20 })).toEqual([
      { startIndex: 5, endIndex: 9 },
      { startIndex: 20, endIndex: 20 },
    ])
    expect(table.getMissingRowRanges({ startIndex: 9, endIndex: 9 })).toEqual([
      { startIndex: 9, endIndex: 9 },
    ])
  })

  it('should return no ranges when all rows in the range are loaded', () => {
    const table = makeTable()

    expect(table.getMissingRowRanges({ startIndex: 10, endIndex: 19 })).toEqual(
      [],
    )
    expect(table.getMissingRowRanges({ startIndex: 45, endIndex: 45 })).toEqual(
      [],
    )
  })

  it('should clamp the range to the rows of the table', () => {
    const table = makeTable()

    expect(
      table.getMissingRowRanges({ startIndex: -20, endIndex: 12 }),
    ).toEqual([{ startIndex: 0, endIndex: 9 }])
    expect(
      table.getMissingRowRanges({ startIndex: 95, endIndex: 500 }),
    ).toEqual([{ startIndex: 95, endIndex: 99 }])
    expect(
      table.getMissingRowRanges({ startIndex: 55, endIndex: Infinity }),
    ).toEqual([{ startIndex: 60, endIndex: 99 }])
    expect(
      table.getMissingRowRanges({ startIndex: 100, endIndex: 200 }),
    ).toEqual([])
  })

  it('should return no ranges for a range that has no rows', () => {
    const table = makeTable()

    expect(table.getMissingRowRanges({ startIndex: 30, endIndex: 20 })).toEqual(
      [],
    )
    expect(
      table.getMissingRowRanges({ startIndex: Number.NaN, endIndex: 20 }),
    ).toEqual([])
    expect(
      table.getMissingRowRanges({ startIndex: 0, endIndex: Number.NaN }),
    ).toEqual([])
  })

  it('should read fractional bounds as the whole rows between them', () => {
    const table = makeTable()

    expect(
      table.getMissingRowRanges({ startIndex: 4.2, endIndex: 7.9 }),
    ).toEqual([{ startIndex: 5, endIndex: 7 }])
  })

  it('should treat undefined entries as missing rows', () => {
    const data = makeSparseData([0, 5])
    data[2] = undefined as unknown as Person
    const table = makeTable({ data, rowCount: 6 })

    expect(table.getMissingRowRanges({ startIndex: 0, endIndex: 5 })).toEqual([
      { startIndex: 2, endIndex: 2 },
    ])
  })

  it('should use data.length when rowCount is not set', () => {
    const table = makeTable({ rowCount: undefined })

    expect(table.getMissingRowRanges({ startIndex: 0, endIndex: 500 })).toEqual(
      [
        { startIndex: 0, endIndex: 9 },
        { startIndex: 20, endIndex: 39 },
      ],
    )
  })

  it('should return one whole block for each block with a missing row', () => {
    const table = makeTable()

    expect(
      table.getMissingRowRanges({
        startIndex: 15,
        endIndex: 65,
        blockSize: 25,
      }),
    ).toEqual([
      { startIndex: 0, endIndex: 24 },
      { startIndex: 25, endIndex: 49 },
      { startIndex: 50, endIndex: 74 },
    ])
  })

  it('should skip a block when its rows in the range are loaded', () => {
    const table = makeTable()

    expect(
      table.getMissingRowRanges({
        startIndex: 12,
        endIndex: 18,
        blockSize: 25,
      }),
    ).toEqual([])
    expect(
      table.getMissingRowRanges({
        startIndex: 40,
        endIndex: 62,
        blockSize: 10,
      }),
    ).toEqual([{ startIndex: 60, endIndex: 69 }])
  })

  it('should return the same block for different ranges inside it', () => {
    const table = makeTable()
    const block = [{ startIndex: 60, endIndex: 79 }]

    expect(
      table.getMissingRowRanges({
        startIndex: 61,
        endIndex: 70,
        blockSize: 20,
      }),
    ).toEqual(block)
    expect(
      table.getMissingRowRanges({
        startIndex: 68,
        endIndex: 79,
        blockSize: 20,
      }),
    ).toEqual(block)
  })

  it('should end the last block at the last row', () => {
    const table = makeTable({ rowCount: 95 })

    expect(
      table.getMissingRowRanges({
        startIndex: 85,
        endIndex: 94,
        blockSize: 30,
      }),
    ).toEqual([
      { startIndex: 60, endIndex: 89 },
      { startIndex: 90, endIndex: 94 },
    ])
  })

  it.each([0, -5, Number.NaN, Infinity])(
    'should return exact gaps when blockSize is %s',
    (blockSize) => {
      const table = makeTable()

      expect(
        table.getMissingRowRanges({ startIndex: 5, endIndex: 25, blockSize }),
      ).toEqual([
        { startIndex: 5, endIndex: 9 },
        { startIndex: 20, endIndex: 25 },
      ])
    },
  )

  it('should not build the core row model', () => {
    const table = makeTable({
      rowCount: 100_000,
      getRowId: () => {
        throw new Error('The core row model was built')
      },
    })

    expect(
      table.getMissingRowRanges({ startIndex: 99_950, endIndex: 99_999 }),
    ).toEqual([{ startIndex: 99_950, endIndex: 99_999 }])
  })

  it('should read the data of a table without the feature', () => {
    const table = constructTable<typeof coreOnlyFeatures, Person>({
      features: coreOnlyFeatures,
      columns: [],
      data: makeSparseData([0, 4]),
    })

    expect(
      table_getMissingRowRanges(
        table as unknown as Table_Internal<typeof coreOnlyFeatures, Person>,
        { startIndex: 0, endIndex: 20 },
      ),
    ).toEqual([])
  })
})

describe('row_getIsPlaceholder', () => {
  it('should return true only for rows without data', () => {
    const { rows } = makeTable().getRowModel()

    expect(row_getIsPlaceholder(rows[9]!)).toBe(true)
    expect(row_getIsPlaceholder(rows[10]!)).toBe(false)
  })

  it('should return false for the rows of a table without the feature', () => {
    const table = constructTable<typeof coreOnlyFeatures, Person>({
      features: coreOnlyFeatures,
      columns: [],
      data: makeSparseData([0, 1]),
    })

    expect(row_getIsPlaceholder(table.getRowModel().rows[0]!)).toBe(false)
  })
})

describe('table_createSparseRowModel', () => {
  it('should build an empty row model for an empty table', () => {
    const table = makeTable({ data: [], rowCount: 0 })

    expect(table.getRowModel()).toEqual({
      rows: [],
      flatRows: [],
      rowsById: {},
    })
  })
})
