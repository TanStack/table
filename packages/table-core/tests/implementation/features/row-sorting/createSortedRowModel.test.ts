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

  describe('sortUndefined', () => {
    type MaybePerson = {
      firstName: string
      age?: number
    }

    // amy and carl have undefined ages; dan (1) and bob (2) are defined
    const undefinedData: Array<MaybePerson> = [
      { firstName: 'amy' },
      { firstName: 'bob', age: 2 },
      { firstName: 'carl' },
      { firstName: 'dan', age: 1 },
    ]

    // Treats undefined as -Infinity so undefined values participate in the
    // sortFn deterministically for the sortUndefined: false case.
    const undefinedAwareSortFn = (rowA: any, rowB: any, columnId: string) => {
      const a = rowA.getValue(columnId) ?? -Infinity
      const b = rowB.getValue(columnId) ?? -Infinity
      return a === b ? 0 : a > b ? 1 : -1
    }

    function makeUndefinedTable(
      sortUndefined: false | -1 | 1 | 'first' | 'last',
      desc: boolean,
    ) {
      const localColumns: Array<ColumnDef<typeof features, MaybePerson, any>> =
        [
          { accessorKey: 'firstName', id: 'firstName' },
          {
            accessorKey: 'age',
            id: 'age',
            sortUndefined,
            sortFn: undefinedAwareSortFn,
          },
        ]

      return constructTable<typeof features, MaybePerson>({
        data: undefinedData,
        columns: localColumns,
        features,
        initialState: { sorting: [{ id: 'age', desc }] },
      })
    }

    function sortedNames(
      sortUndefined: false | -1 | 1 | 'first' | 'last',
      desc: boolean,
    ) {
      return makeUndefinedTable(sortUndefined, desc)
        .getSortedRowModel()
        .rows.map((row) => row.original.firstName)
    }

    it('should sort undefined values last for sortUndefined: 1 ascending, first descending', () => {
      // sortInt = aUndefined ? 1 : -1, then desc inverts it; so 1 does NOT
      // mean "undefined always last": direction flips the placement.
      expect(sortedNames(1, false)).toEqual(['dan', 'bob', 'amy', 'carl'])
      expect(sortedNames(1, true)).toEqual(['amy', 'carl', 'bob', 'dan'])
    })

    it('should sort undefined values first for sortUndefined: -1 ascending, last descending', () => {
      expect(sortedNames(-1, false)).toEqual(['amy', 'carl', 'dan', 'bob'])
      expect(sortedNames(-1, true)).toEqual(['bob', 'dan', 'amy', 'carl'])
    })

    it('should sort undefined values first for sortUndefined: "first" regardless of direction', () => {
      expect(sortedNames('first', false)).toEqual(['amy', 'carl', 'dan', 'bob'])
      expect(sortedNames('first', true)).toEqual(['amy', 'carl', 'bob', 'dan'])
    })

    it('should sort undefined values last for sortUndefined: "last" regardless of direction', () => {
      expect(sortedNames('last', false)).toEqual(['dan', 'bob', 'amy', 'carl'])
      expect(sortedNames('last', true)).toEqual(['bob', 'dan', 'amy', 'carl'])
    })

    it('should let undefined values participate via the sortFn for sortUndefined: false', () => {
      // The sortFn maps undefined to -Infinity, so undefined sorts as the
      // smallest value in both directions.
      expect(sortedNames(false, false)).toEqual(['amy', 'carl', 'dan', 'bob'])
      expect(sortedNames(false, true)).toEqual(['bob', 'dan', 'amy', 'carl'])
    })

    it('should keep the relative order of rows that are both undefined', () => {
      // Both-undefined comparisons hit the continue branch and fall through
      // to the rowA.index - rowB.index tiebreak: amy stays before carl.
      expect(sortedNames(1, false)).toEqual(['dan', 'bob', 'amy', 'carl'])
      expect(sortedNames(1, true)).toEqual(['amy', 'carl', 'bob', 'dan'])
    })
  })

  describe('invertSorting', () => {
    function makeInvertedTable(desc: boolean) {
      const localColumns: Array<ColumnDef<typeof features, Person, any>> = [
        { accessorKey: 'firstName', id: 'firstName' },
        { accessorKey: 'age', id: 'age', invertSorting: true },
      ]

      return constructTable<typeof features, Person>({
        data,
        columns: localColumns,
        features,
        initialState: { sorting: [{ id: 'age', desc }] },
      })
    }

    it('should invert an ascending sort when invertSorting is true', () => {
      const table = makeInvertedTable(false)

      expect(
        table.getSortedRowModel().rows.map((row) => row.original.firstName),
      ).toEqual(['bob', 'alice', 'amy'])
    })

    it('should double-negate back to ascending when invertSorting is combined with desc', () => {
      const table = makeInvertedTable(true)

      expect(
        table.getSortedRowModel().rows.map((row) => row.original.firstName),
      ).toEqual(['amy', 'alice', 'bob'])
    })
  })

  describe('stable sort', () => {
    const tiedData: Array<Person> = [
      { firstName: 'amy', age: 30 },
      { firstName: 'bob', age: 30 },
      { firstName: 'carl', age: 10 },
      { firstName: 'dan', age: 30 },
    ]

    it('should preserve original index order for equal sort keys ascending', () => {
      const table = makeTable([{ id: 'age', desc: false }], tiedData)

      expect(
        table.getSortedRowModel().rows.map((row) => row.original.firstName),
      ).toEqual(['carl', 'amy', 'bob', 'dan'])
    })

    it('should preserve original index order for equal sort keys descending', () => {
      const table = makeTable([{ id: 'age', desc: true }], tiedData)

      // The index tiebreak is always ascending, even for a descending sort.
      expect(
        table.getSortedRowModel().rows.map((row) => row.original.firstName),
      ).toEqual(['amy', 'bob', 'dan', 'carl'])
    })
  })

  describe('maxMultiSortColCount', () => {
    type Triple = { a: number; b: number; c: number; name: string }

    it('should not trim the sorting state applied by the model', () => {
      // maxMultiSortColCount only limits how many sort entries user toggle
      // interactions can add (column_toggleSorting); the sorted row model
      // applies every entry already present in the sorting state. Pinning
      // that all 3 entries affect row order despite maxMultiSortColCount: 2.
      const localColumns: Array<ColumnDef<typeof features, Triple, any>> = [
        { accessorKey: 'a', id: 'a' },
        { accessorKey: 'b', id: 'b' },
        { accessorKey: 'c', id: 'c' },
      ]

      // a and b are constant, so only the 3rd sort entry (c) can change order
      const localData: Array<Triple> = [
        { name: 'x', a: 1, b: 1, c: 1 },
        { name: 'y', a: 1, b: 1, c: 3 },
        { name: 'z', a: 1, b: 1, c: 2 },
      ]

      const table = constructTable<typeof features, Triple>({
        data: localData,
        columns: localColumns,
        features,
        maxMultiSortColCount: 2,
        initialState: {
          sorting: [
            { id: 'a', desc: false },
            { id: 'b', desc: false },
            { id: 'c', desc: true },
          ],
        },
      })

      expect(
        table.getSortedRowModel().rows.map((row) => row.original.name),
      ).toEqual(['y', 'z', 'x'])
    })
  })

  describe('enableSorting: false columns', () => {
    it('should skip disabled columns in the sorting state while other sorted columns still apply', () => {
      const localColumns: Array<ColumnDef<typeof features, Person, any>> = [
        { accessorKey: 'firstName', id: 'firstName', enableSorting: false },
        { accessorKey: 'age', id: 'age' },
      ]

      const table = constructTable<typeof features, Person>({
        data,
        columns: localColumns,
        features,
        initialState: {
          sorting: [
            // firstName desc would put bob first if it were applied
            { id: 'firstName', desc: true },
            { id: 'age', desc: false },
          ],
        },
      })

      expect(
        table.getSortedRowModel().rows.map((row) => row.original.firstName),
      ).toEqual(['amy', 'alice', 'bob'])
    })
  })

  describe('multi-sort', () => {
    it('should sort by 3 columns with mixed asc/desc directions', () => {
      type Triple = { a: number; b: number; c: number; name: string }

      const localColumns: Array<ColumnDef<typeof features, Triple, any>> = [
        { accessorKey: 'a', id: 'a' },
        { accessorKey: 'b', id: 'b' },
        { accessorKey: 'c', id: 'c' },
      ]

      const localData: Array<Triple> = [
        { name: 'p', a: 2, b: 1, c: 1 },
        { name: 'q', a: 1, b: 2, c: 1 },
        { name: 'r', a: 1, b: 2, c: 2 },
        { name: 's', a: 1, b: 1, c: 5 },
        { name: 't', a: 2, b: 3, c: 9 },
      ]

      const table = constructTable<typeof features, Triple>({
        data: localData,
        columns: localColumns,
        features,
        initialState: {
          sorting: [
            { id: 'a', desc: false },
            { id: 'b', desc: true },
            { id: 'c', desc: false },
          ],
        },
      })

      // a asc: [q, r, s] then [p, t]
      // within a=1, b desc: q/r (b=2) before s (b=1)
      // within a=1, b=2, c asc: q (c=1) before r (c=2)
      // within a=2, b desc: t (b=3) before p (b=1)
      expect(
        table.getSortedRowModel().rows.map((row) => row.original.name),
      ).toEqual(['q', 'r', 's', 't', 'p'])
    })
  })

  describe('manualSorting', () => {
    it('should toggle between identity and sorted output when manualSorting changes at runtime', () => {
      const table = constructTable<typeof features, Person>({
        data,
        columns,
        features,
        manualSorting: true,
        initialState: { sorting: [{ id: 'age', desc: false }] },
      })

      // Manual sorting: the sorted row model is the pre-sorted row model
      expect(table.getSortedRowModel()).toBe(table.getPreSortedRowModel())

      table.setOptions((prev) => ({ ...prev, manualSorting: false }))

      expect(table.getSortedRowModel()).not.toBe(table.getPreSortedRowModel())
      expect(
        table.getSortedRowModel().rows.map((row) => row.original.firstName),
      ).toEqual(['amy', 'alice', 'bob'])

      table.setOptions((prev) => ({ ...prev, manualSorting: true }))

      expect(table.getSortedRowModel()).toBe(table.getPreSortedRowModel())
    })
  })
})
