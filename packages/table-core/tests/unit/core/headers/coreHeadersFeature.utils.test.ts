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
