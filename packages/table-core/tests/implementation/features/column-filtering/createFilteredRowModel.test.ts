import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  createFilteredRowModel,
  filterFns,
  globalFilteringFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, FilterFn } from '../../../../src'

interface TestRow {
  name: string
}

interface TaggedRow {
  name: string
  tag: string
}

interface NestedRow {
  name: string
  subRows?: Array<NestedRow>
}

const features = testFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

const columns: Array<ColumnDef<typeof features, TestRow, any>> = [
  { accessorKey: 'name', id: 'name' },
]

const taggedColumns: Array<ColumnDef<typeof features, TaggedRow, any>> = [
  { accessorKey: 'name', id: 'name' },
  { accessorKey: 'tag', id: 'tag' },
]

const nestedColumns: Array<ColumnDef<typeof features, NestedRow, any>> = [
  { accessorKey: 'name', id: 'name' },
]

// 3-level nested dataset shared by the hierarchical filtering tests.
// 'keep' names match the { id: 'name', value: 'keep' } filter, 'drop' names do not.
const nestedData: Array<NestedRow> = [
  {
    name: 'keep-a',
    subRows: [
      { name: 'keep-a1', subRows: [{ name: 'drop-a1a' }] },
      { name: 'drop-a2' },
    ],
  },
  { name: 'drop-b', subRows: [{ name: 'keep-b1' }] },
  { name: 'keep-c' },
  { name: 'keep-d', subRows: [{ name: 'drop-d1' }] },
]

function makeNestedTable(options?: {
  filterFromLeafRows?: boolean
  maxLeafRowFilterDepth?: number
  data?: Array<NestedRow>
}) {
  return constructTable<typeof features, NestedRow>({
    features,
    columns: nestedColumns,
    data: options?.data ?? nestedData,
    getSubRows: (row) => row.subRows,
    filterFromLeafRows: options?.filterFromLeafRows,
    maxLeafRowFilterDepth: options?.maxLeafRowFilterDepth,
    initialState: {
      columnFilters: [{ id: 'name', value: 'keep' }],
    },
  })
}

const rowNames = (rows: Array<{ original: { name: string } }>) =>
  rows.map((row) => row.original.name)

describe('createFilteredRowModel', () => {
  it('should assign display indexes in filtered row order', () => {
    const table = constructTable<typeof features, TestRow>({
      features,
      columns,
      data: [{ name: 'keep' }, { name: 'drop' }, { name: 'keep' }],
      initialState: {
        columnFilters: [{ id: 'name', value: 'keep' }],
      },
    })

    const rows = table.getRowModel().rows
    const filteredOutRow = table.getCoreRowModel().rows[1]!

    expect(rows.map((row) => row.index)).toEqual([0, 2])
    expect(rows.map((row) => row.getDisplayIndex())).toEqual([0, 1])
    expect(filteredOutRow.getDisplayIndex()).toBe(-1)

    table.setColumnFilters([])

    expect(
      table.getRowModel().rows.map((row) => row.getDisplayIndex()),
    ).toEqual([0, 1, 2])
    expect(filteredOutRow.getDisplayIndex()).toBe(1)
  })

  describe('hierarchical filtering from root (default)', () => {
    it('should keep a matching parent with recursively filtered subRows', () => {
      const table = makeNestedTable()
      const { rows } = table.getFilteredRowModel()

      expect(rowNames(rows)).toEqual(['keep-a', 'keep-c', 'keep-d'])

      const keepA = rows[0]!
      expect(rowNames(keepA.subRows)).toEqual(['keep-a1'])
      // keep-a1's own non-matching child is filtered out too
      expect(keepA.subRows[0]!.subRows).toEqual([])
      // keep-d matches but has no matching children
      expect(rows[2]!.subRows).toEqual([])
    })

    it('should clone matching parents that have subRows', () => {
      const table = makeNestedTable()
      const preRow = table.getPreFilteredRowModel().rows[0]!
      const filteredRow = table.getFilteredRowModel().rows[0]!

      expect(filteredRow).not.toBe(preRow)
      expect(filteredRow.id).toBe(preRow.id)
      expect(filteredRow.original).toBe(preRow.original)
    })

    it('should drop the entire subtree of a non-matching parent even if children match', () => {
      const table = makeNestedTable()
      const model = table.getFilteredRowModel()

      expect(rowNames(model.rows)).not.toContain('drop-b')
      // keep-b1 matches, but its parent drop-b was pruned first
      expect(rowNames(model.flatRows)).not.toContain('keep-b1')
    })

    it('should include cloned rows and exclude dropped rows in flatRows and rowsById', () => {
      const table = makeNestedTable()
      const model = table.getFilteredRowModel()

      expect(rowNames(model.flatRows).sort()).toEqual([
        'keep-a',
        'keep-a1',
        'keep-c',
        'keep-d',
      ])

      const byIdNames = Object.values(model.rowsById)
        .map((row) => row.original.name)
        .sort()
      expect(byIdNames).toEqual(['keep-a', 'keep-a1', 'keep-c', 'keep-d'])

      // rowsById points at the cloned rows present in the filtered tree
      const keepA = model.rows[0]!
      expect(model.rowsById[keepA.id]).toBe(keepA)
      expect(model.rowsById[keepA.subRows[0]!.id]).toBe(keepA.subRows[0])
    })
  })

  describe('filterFromLeafRows', () => {
    it('should retain a non-matching parent when any descendant matches', () => {
      const table = makeNestedTable({ filterFromLeafRows: true })
      const { rows } = table.getFilteredRowModel()

      expect(rowNames(rows)).toEqual(['keep-a', 'drop-b', 'keep-c', 'keep-d'])

      const dropB = rows[1]!
      expect(rowNames(dropB.subRows)).toEqual(['keep-b1'])
    })

    it('should keep a matching parent that has no matching children', () => {
      const table = makeNestedTable({ filterFromLeafRows: true })
      const { rows } = table.getFilteredRowModel()

      const keepD = rows.find((row) => row.original.name === 'keep-d')!
      expect(keepD.subRows).toEqual([])
    })

    it('should drop a non-matching parent whose descendants all fail', () => {
      const table = makeNestedTable({
        filterFromLeafRows: true,
        data: [{ name: 'drop-z', subRows: [{ name: 'drop-z1' }] }],
      })

      expect(table.getFilteredRowModel().rows).toEqual([])
    })

    it('should retain a 3-level chain of non-matching ancestors above a matching leaf', () => {
      const table = makeNestedTable({
        filterFromLeafRows: true,
        data: [
          {
            name: 'drop-x',
            subRows: [{ name: 'drop-x1', subRows: [{ name: 'keep-x1a' }] }],
          },
        ],
      })
      const { rows, flatRows } = table.getFilteredRowModel()

      expect(rowNames(rows)).toEqual(['drop-x'])
      expect(rowNames(rows[0]!.subRows)).toEqual(['drop-x1'])
      expect(rowNames(rows[0]!.subRows[0]!.subRows)).toEqual(['keep-x1a'])
      expect(rowNames(flatRows).sort()).toEqual([
        'drop-x',
        'drop-x1',
        'keep-x1a',
      ])
    })

    it('should prune matching subRows from a matching parent while filtering', () => {
      // Covers the branch pair in filterRowsUtils where a parent both passes
      // and has surviving children.
      const table = makeNestedTable({ filterFromLeafRows: true })
      const keepA = table.getFilteredRowModel().rows[0]!

      expect(rowNames(keepA.subRows)).toEqual(['keep-a1'])
      expect(keepA.subRows[0]!.subRows).toEqual([])
    })
  })

  describe('maxLeafRowFilterDepth', () => {
    it('should keep subRows unfiltered when maxLeafRowFilterDepth is 0 (from root)', () => {
      const table = makeNestedTable({ maxLeafRowFilterDepth: 0 })
      const { rows } = table.getFilteredRowModel()

      expect(rowNames(rows)).toEqual(['keep-a', 'keep-c', 'keep-d'])

      // Non-matching children survive because sub-row filtering stopped at depth 0
      const keepA = rows[0]!
      expect(rowNames(keepA.subRows)).toEqual(['keep-a1', 'drop-a2'])
      expect(rowNames(keepA.subRows[0]!.subRows)).toEqual(['drop-a1a'])
      expect(rowNames(rows[2]!.subRows)).toEqual(['drop-d1'])
    })

    it('should treat rows as leaves when maxLeafRowFilterDepth is 0 (from leaf)', () => {
      const table = makeNestedTable({
        filterFromLeafRows: true,
        maxLeafRowFilterDepth: 0,
      })
      const { rows } = table.getFilteredRowModel()

      // drop-b is dropped even though keep-b1 matches, because descendants
      // are never consulted at depth 0
      expect(rowNames(rows)).toEqual(['keep-a', 'keep-c', 'keep-d'])
    })

    it('should stop filtering below depth 1 when maxLeafRowFilterDepth is 1 (from root)', () => {
      const table = makeNestedTable({ maxLeafRowFilterDepth: 1 })
      const keepA = table.getFilteredRowModel().rows[0]!

      // Depth 1 children are filtered, depth 2 grandchildren are kept as-is
      expect(rowNames(keepA.subRows)).toEqual(['keep-a1'])
      expect(rowNames(keepA.subRows[0]!.subRows)).toEqual(['drop-a1a'])
    })

    it('should stop consulting descendants below depth 1 when maxLeafRowFilterDepth is 1 (from leaf)', () => {
      const table = makeNestedTable({
        filterFromLeafRows: true,
        maxLeafRowFilterDepth: 1,
        data: [
          {
            name: 'drop-x',
            subRows: [{ name: 'drop-x1', subRows: [{ name: 'keep-x1a' }] }],
          },
          { name: 'drop-b', subRows: [{ name: 'keep-b1' }] },
        ],
      })
      const { rows } = table.getFilteredRowModel()

      // drop-b survives via its depth-1 matching child, but drop-x does not:
      // its only match lives at depth 2, past the max filter depth
      expect(rowNames(rows)).toEqual(['drop-b'])
    })

    it('should filter deep trees fully with the default depth of 100', () => {
      const fromRoot = makeNestedTable()
      const fromLeaf = makeNestedTable({ filterFromLeafRows: true })

      // Depth 2 rows are still filtered in both modes
      expect(
        fromRoot.getFilteredRowModel().rows[0]!.subRows[0]!.subRows,
      ).toEqual([])
      expect(
        fromLeaf.getFilteredRowModel().rows[0]!.subRows[0]!.subRows,
      ).toEqual([])
    })
  })

  describe('column filter and global filter together', () => {
    it('should require rows to pass both filters (AND semantics) in one pass', () => {
      const table = constructTable<typeof features, TaggedRow>({
        features,
        columns: taggedColumns,
        data: [
          { name: 'keep', tag: 'x1' },
          { name: 'keep', tag: 'y' },
          { name: 'drop', tag: 'x2' },
          { name: 'drop', tag: 'y' },
        ],
        initialState: {
          columnFilters: [{ id: 'name', value: 'keep' }],
          globalFilter: 'x',
        },
      })

      const { rows, flatRows } = table.getFilteredRowModel()
      expect(rows.map((row) => row.original.tag)).toEqual(['x1'])
      expect(flatRows).toHaveLength(1)

      // Per-row survival flags on the pre-filtered flat rows
      const preRows = table.getPreFilteredRowModel().flatRows
      expect(preRows.map((row) => row.columnFilters.name)).toEqual([
        true,
        true,
        false,
        false,
      ])
      expect(preRows.map((row) => row.columnFilters.__global__)).toEqual([
        true,
        false,
        true,
        false,
      ])
    })
  })

  describe('columnFilters state edge cases', () => {
    it('should skip an unknown column id in columnFilters state', () => {
      const table = constructTable<typeof features, TestRow>({
        features,
        columns,
        data: [{ name: 'keep' }, { name: 'drop' }],
        initialState: {
          columnFilters: [{ id: 'doesNotExist', value: 'z' }],
        },
      })

      expect(rowNames(table.getFilteredRowModel().rows)).toEqual([
        'keep',
        'drop',
      ])
    })

    it('should still filter a column with enableColumnFilter false when state contains an entry', () => {
      // Documents existing behavior: the filtered row model does not consult
      // column.getCanFilter(), so a state entry for a non-filterable column
      // is applied anyway.
      const table = constructTable<typeof features, TestRow>({
        features,
        columns: [
          { accessorKey: 'name', id: 'name', enableColumnFilter: false },
        ],
        data: [{ name: 'keep' }, { name: 'drop' }],
        initialState: {
          columnFilters: [{ id: 'name', value: 'keep' }],
        },
      })

      expect(table.getColumn('name')!.getCanFilter()).toBe(false)
      expect(rowNames(table.getFilteredRowModel().rows)).toEqual(['keep'])
    })
  })

  describe('columnFiltersMeta', () => {
    it('should populate row.columnFiltersMeta via the addMeta callback of a column filterFn', () => {
      const metaFilterFn: FilterFn<typeof features, any> = (
        row,
        columnId,
        filterValue,
        addMeta,
      ) => {
        const value = row.getValue<string>(columnId)
        addMeta?.({ inspected: value })
        return value.includes(filterValue as string)
      }

      const table = constructTable<typeof features, TestRow>({
        features,
        columns: [{ accessorKey: 'name', id: 'name', filterFn: metaFilterFn }],
        data: [{ name: 'keep' }, { name: 'drop' }],
        initialState: {
          columnFilters: [{ id: 'name', value: 'keep' }],
        },
      })

      table.getFilteredRowModel()
      const preRows = table.getPreFilteredRowModel().flatRows

      // Meta is recorded on every tested row, surviving or not
      expect(preRows[0]!.columnFiltersMeta.name).toEqual({ inspected: 'keep' })
      expect(preRows[1]!.columnFiltersMeta.name).toEqual({ inspected: 'drop' })
    })

    it('should populate row.columnFiltersMeta via the addMeta callback of a custom global filter', () => {
      const globalMetaFn: FilterFn<typeof features, any> = (
        row,
        columnId,
        filterValue,
        addMeta,
      ) => {
        const value = row.getValue<string>(columnId)
        addMeta?.({ globalHit: value })
        return value.includes(filterValue as string)
      }

      const table = constructTable<typeof features, TestRow>({
        features,
        columns,
        data: [{ name: 'keep' }, { name: 'drop' }],
        globalFilterFn: globalMetaFn,
        initialState: {
          globalFilter: 'keep',
        },
      })

      table.getFilteredRowModel()
      const preRows = table.getPreFilteredRowModel().flatRows

      // Global filter meta is keyed by the column id it evaluated
      expect(preRows[0]!.columnFiltersMeta.name).toEqual({ globalHit: 'keep' })
      expect(preRows[1]!.columnFiltersMeta.name).toEqual({ globalHit: 'drop' })
    })
  })

  describe('row.columnFilters flags', () => {
    it('should tag flat rows with per-column pass/fail and the __global__ flag', () => {
      const table = constructTable<typeof features, TestRow>({
        features,
        columns,
        data: [{ name: 'keep' }, { name: 'drop' }],
        initialState: {
          columnFilters: [{ id: 'name', value: 'keep' }],
          globalFilter: 'drop',
        },
      })

      table.getFilteredRowModel()
      const preRows = table.getPreFilteredRowModel().flatRows

      expect(preRows[0]!.columnFilters).toEqual({
        name: true,
        __global__: false,
      })
      expect(preRows[1]!.columnFilters).toEqual({
        name: false,
        __global__: true,
      })
    })

    it('should reset columnFilters and columnFiltersMeta on rows after all filters are removed', () => {
      const table = constructTable<typeof features, TestRow>({
        features,
        columns,
        data: [{ name: 'keep' }, { name: 'drop' }],
        initialState: {
          columnFilters: [{ id: 'name', value: 'keep' }],
          globalFilter: 'keep',
        },
      })

      table.getFilteredRowModel()
      const preRows = table.getPreFilteredRowModel().flatRows
      expect(preRows[0]!.columnFilters).not.toEqual({})

      table.setColumnFilters([])
      table.setGlobalFilter(undefined)
      table.getFilteredRowModel()

      expect(preRows[0]!.columnFilters).toEqual({})
      expect(preRows[0]!.columnFiltersMeta).toEqual({})
      expect(preRows[1]!.columnFilters).toEqual({})
      expect(preRows[1]!.columnFiltersMeta).toEqual({})
    })
  })

  describe('global filtering edge cases', () => {
    it('should pass rows through when no columns are globally filterable', () => {
      const table = constructTable<typeof features, TestRow>({
        features,
        columns: [
          { accessorKey: 'name', id: 'name', enableGlobalFilter: false },
        ],
        data: [{ name: 'keep' }, { name: 'drop' }],
        initialState: {
          globalFilter: 'keep',
        },
      })

      const { rows, flatRows } = table.getFilteredRowModel()
      expect(rowNames(rows)).toEqual(['keep', 'drop'])
      // No __global__ tagging happened either
      expect(flatRows[0]!.columnFilters).toEqual({})
    })

    it('should match mixed-case global filter values via includesString value resolution', () => {
      const table = constructTable<typeof features, TestRow>({
        features,
        columns,
        data: [{ name: 'Keep Me' }, { name: 'drop' }],
        initialState: {
          globalFilter: 'kEeP',
        },
      })

      expect(rowNames(table.getFilteredRowModel().rows)).toEqual(['Keep Me'])
    })

    it('should apply a numeric zero global filter value', () => {
      const table = constructTable<typeof features, TestRow>({
        features,
        columns,
        data: [{ name: 'status 0' }, { name: 'status 1' }],
        initialState: {
          globalFilter: 0,
        },
      })

      expect(rowNames(table.getFilteredRowModel().rows)).toEqual(['status 0'])
    })
  })

  describe('unresolvable global filter fn', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should apply no global filtering and warn when the globalFilterFn name is not registered', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const table = constructTable<typeof features, TestRow>({
        features,
        columns,
        data: [{ name: 'keep' }, { name: 'drop' }],
        globalFilterFn: 'doesNotExist' as any,
        initialState: {
          globalFilter: 'keep',
        },
      })

      expect(rowNames(table.getFilteredRowModel().rows)).toEqual([
        'keep',
        'drop',
      ])
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(`'doesNotExist'`),
      )
    })
  })

  describe('no active filters', () => {
    it('should return the pre-filtered row model identity when no filters are active', () => {
      const table = constructTable<typeof features, TestRow>({
        features,
        columns,
        data: [{ name: 'keep' }, { name: 'drop' }],
      })

      expect(table.getFilteredRowModel()).toBe(table.getPreFilteredRowModel())
    })
  })
})
