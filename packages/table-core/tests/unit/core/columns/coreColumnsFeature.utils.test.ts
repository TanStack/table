import { describe, expect, it } from 'vitest'
import { constructTable } from '../../../../src'
import {
  column_getFlatColumns,
  column_getLeafColumns,
  table_getAllColumns,
  table_getAllFlatColumns,
  table_getAllFlatColumnsById,
  table_getAllLeafColumns,
  table_getAllLeafColumnsById,
  table_getColumn,
  table_getDefaultColumnDef,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

type Item = {
  a: string
  b: string
  c: string
}

const features = testFeatures({})

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

function makeTable() {
  return constructTable<typeof features, Item>({
    features,
    columns,
    data,
  })
}

describe('table_getAllColumns', () => {
  it('should build the nested column tree from column defs', () => {
    const table = makeTable()
    const allColumns = table_getAllColumns(table)

    expect(allColumns.map((column) => column.id)).toEqual(['group', 'c'])
    expect(allColumns[0]!.columns.map((column) => column.id)).toEqual([
      'a',
      'b',
    ])
    expect(allColumns[0]!.columns[0]!.parent?.id).toBe('group')
    expect(allColumns[0]!.columns[0]!.depth).toBe(1)
  })
})

describe('column_getFlatColumns', () => {
  it('should flatten a group column with itself first', () => {
    const table = makeTable()
    const groupColumn = table.getColumn('group')!

    expect(
      column_getFlatColumns(groupColumn).map((column) => column.id),
    ).toEqual(['group', 'a', 'b'])
  })

  it('should return only itself for a leaf column', () => {
    const table = makeTable()
    const leafColumn = table.getColumn('c')!

    expect(
      column_getFlatColumns(leafColumn).map((column) => column.id),
    ).toEqual(['c'])
  })
})

describe('column_getLeafColumns', () => {
  it('should return the descendants of a group column', () => {
    const table = makeTable()
    const groupColumn = table.getColumn('group')!

    expect(
      column_getLeafColumns(groupColumn).map((column) => column.id),
    ).toEqual(['a', 'b'])
  })

  it('should return only itself for a leaf column', () => {
    const table = makeTable()
    const leafColumn = table.getColumn('c')!

    expect(
      column_getLeafColumns(leafColumn).map((column) => column.id),
    ).toEqual(['c'])
  })
})

describe('table_getAllFlatColumns / table_getAllFlatColumnsById', () => {
  it('should include group and leaf columns', () => {
    const table = makeTable()

    expect(table_getAllFlatColumns(table).map((column) => column.id)).toEqual([
      'group',
      'a',
      'b',
      'c',
    ])

    const byId = table_getAllFlatColumnsById(table)
    expect(Object.keys(byId)).toEqual(['group', 'a', 'b', 'c'])
    expect(byId['a']!.id).toBe('a')
  })
})

describe('table_getAllLeafColumns / table_getAllLeafColumnsById', () => {
  it('should exclude group columns', () => {
    const table = makeTable()

    expect(table_getAllLeafColumns(table).map((column) => column.id)).toEqual([
      'a',
      'b',
      'c',
    ])

    const byId = table_getAllLeafColumnsById(table)
    expect(Object.keys(byId)).toEqual(['a', 'b', 'c'])
    expect(byId['group']).toBeUndefined()
  })
})

describe('table_getColumn', () => {
  it('should find group and leaf columns by id', () => {
    const table = makeTable()

    expect(table_getColumn(table, 'group')?.id).toBe('group')
    expect(table_getColumn(table, 'b')?.id).toBe('b')
  })

  it('should return undefined for unknown column ids', () => {
    const table = makeTable()

    expect(table_getColumn(table, 'missing')).toBeUndefined()
  })
})

describe('table_getDefaultColumnDef', () => {
  it('should render accessor keys as the default header', () => {
    const table = makeTable()
    const defaultColumnDef = table_getDefaultColumnDef(table)

    const header = defaultColumnDef.header as (props: any) => unknown
    expect(
      header({ header: { column: { columnDef: { accessorKey: 'a' } } } }),
    ).toBe('a')
    expect(
      header({
        header: {
          column: { columnDef: { accessorFn: () => 1, id: 'fn-col' } },
        },
      }),
    ).toBe('fn-col')
    expect(header({ header: { column: { columnDef: {} } } })).toBeNull()
  })

  it('should stringify values in the default cell renderer', () => {
    const table = makeTable()
    const defaultColumnDef = table_getDefaultColumnDef(table)

    const cell = defaultColumnDef.cell as (props: any) => unknown
    expect(cell({ renderValue: () => 42 })).toBe('42')
    expect(cell({ renderValue: () => null })).toBeNull()
  })

  it('should let options.defaultColumn win', () => {
    const table = constructTable<typeof features, Item>({
      features,
      columns,
      data,
      defaultColumn: { header: 'custom header' },
    })

    expect(table_getDefaultColumnDef(table).header).toBe('custom header')
  })
})
