import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, Row, RowModel } from '../../../../src'

interface PipelineRow {
  group: string
  name: string
  subRows?: Array<PipelineRow>
}

const features = testFeatures({
  columnFilteringFeature,
  columnGroupingFeature,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
})

const data: Array<PipelineRow> = [
  {
    group: 'b',
    name: 'keep-b',
    subRows: [
      {
        group: 'b',
        name: 'keep-b2',
        subRows: [{ group: 'b', name: 'keep-b2a' }],
      },
      { group: 'b', name: 'keep-b1' },
    ],
  },
  {
    group: 'a',
    name: 'keep-a',
    subRows: [{ group: 'a', name: 'keep-a1' }],
  },
]

const columns: Array<ColumnDef<typeof features, PipelineRow, any>> = [
  { accessorKey: 'group', id: 'group' },
  { accessorKey: 'name', id: 'name' },
]

function preorderIds(rows: Array<Row<typeof features, PipelineRow>>) {
  const result: Array<string> = []
  const seen = new Set<string>()

  const visit = (nestedRows: Array<Row<typeof features, PipelineRow>>) => {
    for (let i = 0; i < nestedRows.length; i++) {
      const row = nestedRows[i]!
      if (seen.has(row.id)) continue
      seen.add(row.id)
      result.push(row.id)
      visit(row.subRows)
    }
  }

  visit(rows)
  return result
}

function expectPreorder(model: RowModel<typeof features, PipelineRow>) {
  const flatIds = model.flatRows.map((row) => row.id)
  expect(flatIds).toEqual(preorderIds(model.rows))
  expect(new Set(flatIds).size).toBe(flatIds.length)
}

describe('row-model pipeline flatRows ordering', () => {
  it('keeps parents before descendants through every hierarchical stage', () => {
    const table = constructTable<typeof features, PipelineRow>({
      features,
      columns,
      data,
      getSubRows: (row) => row.subRows,
      initialState: {
        columnFilters: [{ id: 'name', value: 'keep' }],
        expanded: true,
        grouping: ['group'],
        pagination: { pageIndex: 0, pageSize: 1 },
        sorting: [{ id: 'name', desc: false }],
      },
    })

    const models = [
      table.getCoreRowModel(),
      table.getFilteredRowModel(),
      table.getGroupedRowModel(),
      table.getSortedRowModel(),
      table.getExpandedRowModel(),
      table.getPaginatedRowModel(),
    ]

    for (let i = 0; i < models.length; i++) {
      expectPreorder(models[i]!)
    }
  })
})
