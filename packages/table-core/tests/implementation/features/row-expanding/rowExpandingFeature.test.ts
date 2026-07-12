import { describe, expect, it } from 'vitest'
import {
  constructTable,
  createColumnHelper,
  createExpandedRowModel,
  createPaginatedRowModel,
  rowExpandingFeature,
  rowPaginationFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

type Person = {
  firstName: string
  subRows?: Array<Person>
}

const features = testFeatures({
  rowExpandingFeature,
  rowPaginationFeature,
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

function createTable(options?: { paginateExpandedRows?: boolean }) {
  const data: Array<Person> = [
    {
      firstName: 'Parent 1',
      subRows: [{ firstName: 'Child 1' }],
    },
    {
      firstName: 'Parent 2',
      subRows: [{ firstName: 'Child 2' }],
    },
  ]
  const columnHelper = createColumnHelper<typeof features, Person>()
  const columns: Array<ColumnDef<typeof features, Person, any>> = [
    columnHelper.accessor('firstName', { id: 'firstName' }),
  ]

  return constructTable<typeof features, Person>({
    features,
    data,
    columns,
    getSubRows: (row) => row.subRows,
    paginateExpandedRows: options?.paginateExpandedRows,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 1,
      },
    },
  })
}

describe('row expanding feature', () => {
  it('assigns display indexes in expanded row order before pagination', () => {
    const table = createTable({ paginateExpandedRows: true })

    table.getRow('0').toggleExpanded()

    const rows = table.getPrePaginatedRowModel().rows
    expect(rows.map((row) => row.id)).toEqual(['0', '0.0', '1'])
    expect(rows.map((row) => row.getDisplayIndex())).toEqual([0, 1, 2])

    table.getRow('0').toggleExpanded()

    const collapsedRows = table.getPrePaginatedRowModel().rows
    expect(collapsedRows.map((row) => row.id)).toEqual(['0', '1'])
    expect(collapsedRows.map((row) => row.getDisplayIndex())).toEqual([0, 1])
  })

  it('updates the paginated row model when expanded state changes and expanded rows are not paginated', () => {
    const table = createTable({ paginateExpandedRows: false })

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['0'])
    expect(table.getRowDisplayIndexRows().map((row) => row.id)).toEqual([
      '0',
      '1',
    ])

    table.getRow('0').toggleExpanded()

    expect(table.atoms.expanded.get()).toEqual({ 0: true })
    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['0', '0.0'])
    expect(table.getRowDisplayIndexRows().map((row) => row.id)).toEqual([
      '0',
      '0.0',
      '1',
    ])
    expect(
      table.getRowModel().rows.map((row) => row.getDisplayIndex()),
    ).toEqual([0, 1])

    table.setPageIndex(1)

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(['1'])
    expect(table.getRowModel().rows[0]!.getDisplayIndex()).toBe(2)

    table.getRow('0').toggleExpanded()

    expect(table.getRowDisplayIndexRows().map((row) => row.id)).toEqual([
      '0',
      '1',
    ])
    expect(table.getRow('0.0').getDisplayIndex()).toBe(-1)
  })
})
