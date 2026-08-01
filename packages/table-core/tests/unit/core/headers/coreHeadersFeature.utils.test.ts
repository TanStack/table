import { describe, expect, it } from 'vitest'
import {
  columnPinningFeature,
  columnVisibilityFeature,
  constructTable,
} from '../../../../src'
import {
  header_getContext,
  header_getLeafHeaders,
  table_getHeaderGroups,
  table_getLeafHeaders,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, Table, TableOptions } from '../../../../src'

type Item = {
  a: string
  b: string
  c: string
}

const features = testFeatures({
  columnPinningFeature,
  columnVisibilityFeature,
})

const columns: Array<ColumnDef<typeof features, Item, any>> = [
  {
    id: 'group',
    header: 'Group',
    columns: [
      { accessorKey: 'a', id: 'a' },
      { accessorKey: 'b', id: 'b' },
    ],
  },
  { accessorKey: 'c', id: 'c' },
]

const data: Array<Item> = [{ a: 'a1', b: 'b1', c: 'c1' }]

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, Item>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, Item> {
  return constructTable({
    features,
    columns,
    data,
    ...options,
  })
}

describe('table_getHeaderGroups', () => {
  it('should build one group per column depth', () => {
    const table = makeTable()
    const headerGroups = table_getHeaderGroups(table)

    expect(headerGroups).toHaveLength(2)
    expect(headerGroups[1]!.headers.map((header) => header.column.id)).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  it('should order pinned columns first via the pin partitioning path', () => {
    const table = makeTable({
      initialState: { columnPinning: { start: ['c'], end: [] } },
    })
    const headerGroups = table_getHeaderGroups(table)

    expect(headerGroups[1]!.headers.map((header) => header.column.id)).toEqual([
      'c',
      'a',
      'b',
    ])
  })

  it('should exclude hidden columns', () => {
    const table = makeTable({
      initialState: { columnVisibility: { b: false } },
    })
    const headerGroups = table_getHeaderGroups(table)

    expect(headerGroups[1]!.headers.map((header) => header.column.id)).toEqual([
      'a',
      'c',
    ])
  })

  it('should preserve nested spans and shrink them when a leaf is hidden', () => {
    const deepColumns: Array<ColumnDef<typeof features, Item, any>> = [
      {
        id: 'outer',
        columns: [
          {
            id: 'inner',
            columns: [
              { accessorKey: 'a', id: 'a' },
              { accessorKey: 'b', id: 'b' },
            ],
          },
          { accessorKey: 'c', id: 'c' },
        ],
      },
    ]
    const makeDeepTable = (hideB = false) =>
      constructTable<typeof features, Item>({
        features,
        columns: deepColumns,
        data,
        initialState: hideB ? { columnVisibility: { b: false } } : undefined,
      })

    const headerGroups = table_getHeaderGroups(makeDeepTable())
    const outer = headerGroups[0]!.headers.find(
      (header) => header.column.id === 'outer',
    )!
    const inner = headerGroups[1]!.headers.find(
      (header) => header.column.id === 'inner',
    )!

    expect(headerGroups).toHaveLength(3)
    expect(outer.colSpan).toBe(3)
    expect(inner.colSpan).toBe(2)
    expect(
      headerGroups[2]!.headers.map((header) => [
        header.column.id,
        header.colSpan,
        header.rowSpan,
      ]),
    ).toEqual([
      ['a', 1, 1],
      ['b', 1, 1],
      // c is covered by the spanning placeholder in the row above it.
      ['c', 1, 0],
    ])

    const hiddenHeaderGroups = table_getHeaderGroups(makeDeepTable(true))
    const hiddenOuter = hiddenHeaderGroups[0]!.headers.find(
      (header) => header.column.id === 'outer',
    )!
    const hiddenInner = hiddenHeaderGroups[1]!.headers.find(
      (header) => header.column.id === 'inner',
    )!

    expect(hiddenOuter.colSpan).toBe(2)
    expect(hiddenInner.colSpan).toBe(1)
    expect(
      hiddenHeaderGroups[2]!.headers.map((header) => header.column.id),
    ).toEqual(['a', 'c'])
  })
})

describe('header rowSpan for uneven column trees', () => {
  it('should give the top placeholder of a chain the full span and cover the leaf', () => {
    // group[a, b] is two levels deep while c is a top-level leaf, so c gets a
    // placeholder above its real header. The placeholder carries the rowSpan
    // and the covered real header reports 0 so renderers can skip it.
    const table = makeTable()
    const headerGroups = table_getHeaderGroups(table)

    expect(headerGroups).toHaveLength(2)

    const topRow = headerGroups[0]!.headers
    expect(
      topRow.map((header) => [
        header.column.id,
        header.isPlaceholder,
        header.colSpan,
        header.rowSpan,
      ]),
    ).toEqual([
      ['group', false, 2, 1],
      ['c', true, 1, 2],
    ])

    const leafRow = headerGroups[1]!.headers
    expect(
      leafRow.map((header) => [
        header.id,
        header.column.id,
        header.isPlaceholder,
        header.colSpan,
        header.rowSpan,
      ]),
    ).toEqual([
      ['a', 'a', false, 1, 1],
      ['b', 'b', false, 1, 1],
      // The real leaf header stays in the bottom row with its plain column id,
      // covered by the spanning placeholder above it.
      ['c', 'c', false, 1, 0],
    ])
  })

  it('should give every rowSpan length in a three-level mixed tree', () => {
    const mixedColumns: Array<ColumnDef<typeof features, Item, any>> = [
      { accessorKey: 'a', id: 'a' },
      {
        id: 'group',
        header: 'Group',
        columns: [
          { accessorKey: 'b', id: 'b' },
          {
            id: 'nested',
            header: 'Nested',
            columns: [{ accessorKey: 'c', id: 'c' }],
          },
        ],
      },
    ]
    const table = constructTable<typeof features, Item>({
      features,
      columns: mixedColumns,
      data,
    })
    const headerGroups = table_getHeaderGroups(table)

    expect(headerGroups).toHaveLength(3)

    const spansByRow = headerGroups.map((headerGroup) =>
      headerGroup.headers.map((header) => [
        header.column.id,
        header.isPlaceholder,
        header.rowSpan,
      ]),
    )
    expect(spansByRow).toEqual([
      [
        // a spans all three rows from its top placeholder.
        ['a', true, 3],
        ['group', false, 1],
      ],
      [
        ['a', true, 0],
        // b spans the bottom two rows from its own top placeholder.
        ['b', true, 2],
        ['nested', false, 1],
      ],
      [
        ['a', false, 0],
        ['b', false, 0],
        ['c', false, 1],
      ],
    ])

    // Every row still covers the full leaf width.
    for (const headerGroup of headerGroups) {
      const totalColSpan = headerGroup.headers.reduce(
        (total, header) => total + header.colSpan,
        0,
      )
      expect(totalColSpan).toBe(3)
    }
  })

  it('should shrink rowSpans when hiding columns flattens the tree', () => {
    // Hiding both leaves of the group removes the second header row entirely,
    // so c no longer needs a spanning placeholder.
    const table = makeTable({
      initialState: { columnVisibility: { a: false, b: false } },
    })
    const headerGroups = table_getHeaderGroups(table)

    expect(headerGroups).toHaveLength(1)
    expect(
      headerGroups[0]!.headers.map((header) => [
        header.column.id,
        header.isPlaceholder,
        header.rowSpan,
      ]),
    ).toEqual([['c', false, 1]])
  })

  it('should keep rowSpans consistent through the pin partitioning path', () => {
    const table = makeTable({
      initialState: { columnPinning: { start: ['c'], end: [] } },
    })
    const headerGroups = table_getHeaderGroups(table)

    const spanningPlaceholder = headerGroups[0]!.headers.find(
      (header) => header.column.id === 'c',
    )!
    expect(spanningPlaceholder.isPlaceholder).toBe(true)
    expect(spanningPlaceholder.rowSpan).toBe(2)

    expect(
      headerGroups[1]!.headers.map((header) => [
        header.column.id,
        header.isPlaceholder,
        header.rowSpan,
      ]),
    ).toEqual([
      ['c', false, 0],
      ['a', false, 1],
      ['b', false, 1],
    ])
  })
})

describe('header_getLeafHeaders', () => {
  it('should collect descendant leaf headers before the header itself', () => {
    const table = makeTable()
    const groupHeader = table_getHeaderGroups(table)[0]!.headers.find(
      (header) => header.column.id === 'group',
    )!

    const leafHeaders = header_getLeafHeaders(groupHeader)

    expect(leafHeaders.map((header) => header.column.id)).toEqual([
      'a',
      'b',
      'group',
    ])
  })

  it('should return only itself for a leaf header', () => {
    const table = makeTable()
    const leafHeader = table_getHeaderGroups(table)[1]!.headers.find(
      (header) => header.column.id === 'a',
    )!

    expect(header_getLeafHeaders(leafHeader)).toEqual([leafHeader])
  })

  it('should preserve descendant-first identity across three levels', () => {
    const deepColumns: Array<ColumnDef<typeof features, Item, any>> = [
      {
        id: 'outer',
        columns: [
          {
            id: 'inner',
            columns: [
              { accessorKey: 'a', id: 'a' },
              { accessorKey: 'b', id: 'b' },
            ],
          },
        ],
      },
    ]
    const table = constructTable<typeof features, Item>({
      features,
      columns: deepColumns,
      data,
    })
    const headerGroups = table_getHeaderGroups(table)
    const outer = headerGroups[0]!.headers[0]!
    const inner = headerGroups[1]!.headers[0]!
    const [a, b] = headerGroups[2]!.headers

    const leafHeaders = header_getLeafHeaders(outer)

    expect(leafHeaders.map((header) => header.column.id)).toEqual([
      'a',
      'b',
      'inner',
      'outer',
    ])
    expect(leafHeaders).toEqual([a, b, inner, outer])
  })
})

describe('header_getContext', () => {
  it('should expose the header, column, and table', () => {
    const table = makeTable()
    const header = table_getHeaderGroups(table)[1]!.headers[0]!

    const context = header_getContext(header)

    expect(context.header).toBe(header)
    expect(context.column).toBe(header.column)
    expect(context.table).toBe(header.column.table)
  })
})

describe('table_getLeafHeaders', () => {
  it('should collect the leaf headers reachable from the top header row', () => {
    const table = makeTable()
    const ids = table_getLeafHeaders(table).map((header) => header.column.id)

    expect(ids).toEqual(expect.arrayContaining(['a', 'b', 'c']))
  })
})
