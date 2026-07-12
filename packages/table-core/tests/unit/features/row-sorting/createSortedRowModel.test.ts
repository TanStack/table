import { describe, expect, it } from 'vitest'
import {
  constructTable,
  createSortedRowModel,
  rowSortingFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

type Person = {
  firstName: string
  age: number
  subRows?: Array<Person>
}

const features = testFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { accessorKey: 'firstName', id: 'firstName' },
  { accessorKey: 'age', id: 'age' },
]

const data: Array<Person> = [
  { firstName: 'amy', age: 20 },
  { firstName: 'bob', age: 40 },
  { firstName: 'alice', age: 30 },
]

function makeTable(
  sorting: Array<{ id: string; desc: boolean }>,
  tableData: Array<Person> = data,
) {
  return constructTable<typeof features, Person>({
    data: tableData,
    columns,
    features,
    initialState: { sorting },
    getSubRows: (row) => row.subRows,
  })
}

describe('createSortedRowModel', () => {
  it('does not crash when the sorting state references a column that no longer exists', () => {
    const table = makeTable([{ id: 'thisColumnDoesNotExist', desc: false }])

    expect(() => table.getSortedRowModel()).not.toThrow()
  })

  it('falls back to the pre-sorted row order when only unknown columns are sorted', () => {
    const table = makeTable([{ id: 'thisColumnDoesNotExist', desc: false }])

    expect(
      table.getSortedRowModel().rows.map((row) => row.original.firstName),
    ).toEqual(['amy', 'bob', 'alice'])
  })

  it('returns the pre-sorted row model when only unknown columns are sorted', () => {
    const table = makeTable([{ id: 'thisColumnDoesNotExist', desc: false }])

    expect(table.getSortedRowModel()).toBe(table.getPreSortedRowModel())
  })

  it('still sorts by the remaining known columns when one sort entry is unknown', () => {
    const table = makeTable([
      { id: 'thisColumnDoesNotExist', desc: false },
      { id: 'age', desc: false },
    ])

    expect(
      table.getSortedRowModel().rows.map((row) => row.original.firstName),
    ).toEqual(['amy', 'alice', 'bob'])
  })

  it('assigns display indexes in the final sorted order', () => {
    const table = makeTable([{ id: 'age', desc: false }])

    let rows = table.getRowModel().rows

    expect(rows.map((row) => row.original.firstName)).toEqual([
      'amy',
      'alice',
      'bob',
    ])
    expect(rows.map((row) => row.getDisplayIndex())).toEqual([0, 1, 2])

    table.setSorting([{ id: 'age', desc: true }])
    rows = table.getRowModel().rows

    expect(rows.map((row) => row.original.firstName)).toEqual([
      'bob',
      'alice',
      'amy',
    ])
    expect(rows.map((row) => row.getDisplayIndex())).toEqual([0, 1, 2])

    table.setSorting([])
    rows = table.getRowModel().rows

    expect(rows.map((row) => row.original.firstName)).toEqual([
      'amy',
      'bob',
      'alice',
    ])
    expect(rows.map((row) => row.getDisplayIndex())).toEqual([0, 1, 2])
  })

  it('keeps branch row identity when sorted subRows are unchanged', () => {
    const table = makeTable(
      [{ id: 'age', desc: false }],
      [
        {
          firstName: 'parent',
          age: 20,
          subRows: [
            { firstName: 'child-a', age: 10 },
            { firstName: 'child-b', age: 15 },
          ],
        },
      ],
    )

    const preSortedRow = table.getPreSortedRowModel().rows[0]!
    const sortedRow = table.getSortedRowModel().rows[0]!

    expect(sortedRow).toBe(preSortedRow)
    expect(sortedRow.subRows[0]).toBe(preSortedRow.subRows[0])
    expect(sortedRow.subRows[1]).toBe(preSortedRow.subRows[1])
  })

  it('clones branch rows when sorted subRows change', () => {
    const table = makeTable(
      [{ id: 'age', desc: false }],
      [
        {
          firstName: 'parent',
          age: 20,
          subRows: [
            { firstName: 'child-b', age: 15 },
            { firstName: 'child-a', age: 10 },
          ],
        },
      ],
    )

    const preSortedRow = table.getPreSortedRowModel().rows[0]!
    const sortedRow = table.getSortedRowModel().rows[0]!

    expect(sortedRow).not.toBe(preSortedRow)
    expect(sortedRow.subRows.map((row) => row.original.firstName)).toEqual([
      'child-a',
      'child-b',
    ])
  })

  it('does not copy memoized row APIs from the original row to sorted branch clones', () => {
    const table = makeTable(
      [{ id: 'age', desc: false }],
      [
        {
          firstName: 'parent',
          age: 20,
          subRows: [
            { firstName: 'child-b', age: 15 },
            { firstName: 'child-a', age: 10 },
          ],
        },
      ],
    )
    const preSortedRow = table.getPreSortedRowModel().rows[0]!

    // Warm a per-row memo on the original. The sorted clone must build its own
    // memo so returned cells point back to the clone, not the source row.
    preSortedRow.getAllCells()

    const sortedRow = table.getSortedRowModel().rows[0]!

    expect(sortedRow).not.toBe(preSortedRow)
    expect(sortedRow.getAllCells()[0]!.row).toBe(sortedRow)
  })

  it('builds leaf-row memos for sorted branch clones from the clone subRows', () => {
    const table = makeTable(
      [{ id: 'age', desc: false }],
      [
        {
          firstName: 'parent',
          age: 20,
          subRows: [
            { firstName: 'child-b', age: 15 },
            { firstName: 'child-a', age: 10 },
          ],
        },
      ],
    )
    const preSortedRow = table.getPreSortedRowModel().rows[0]!

    expect(
      preSortedRow.getLeafRows().map((row) => row.original.firstName),
    ).toEqual(['child-b', 'child-a'])

    const sortedRow = table.getSortedRowModel().rows[0]!

    expect(sortedRow).not.toBe(preSortedRow)
    expect(sortedRow.getLeafRows()).toBe(sortedRow.getLeafRows())
    expect(
      sortedRow.getLeafRows().map((row) => row.original.firstName),
    ).toEqual(['child-a', 'child-b'])
  })
})
