import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  createFilteredRowModel,
  filterFns,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

interface TestRow {
  name: string
}

const features = testFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})

const columns: Array<ColumnDef<typeof features, TestRow, any>> = [
  { accessorKey: 'name', id: 'name' },
]

describe('createFilteredRowModel', () => {
  it('assigns display indexes in filtered row order', () => {
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
})
