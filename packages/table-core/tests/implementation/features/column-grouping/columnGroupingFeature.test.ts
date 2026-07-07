import { describe, expect, it } from 'vitest'
import {
  aggregationFns,
  columnGroupingFeature,
  constructTable,
  createGroupedRowModel,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

const features = testFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})

interface TestRow {
  bucket: string
  label: string
}

describe('columnGroupingFeature', () => {
  it('passes the original row, row index, and row instance to getGroupingValue', () => {
    const data: Array<TestRow> = [
      { bucket: 'alpha', label: 'first' },
      { bucket: 'alpha', label: 'second' },
    ]
    const calls: Array<{
      originalRow: TestRow
      index: number
      rowId: string
      rowIndex: number
      rowOriginal: TestRow
    }> = []
    const columns: Array<ColumnDef<typeof features, TestRow, any>> = [
      {
        id: 'bucket',
        accessorKey: 'bucket',
        getGroupingValue: (originalRow, index, row) => {
          calls.push({
            originalRow,
            index,
            rowId: row.id,
            rowIndex: row.index,
            rowOriginal: row.original,
          })

          return `${originalRow.bucket}-${index}`
        },
      },
      {
        id: 'label',
        accessorKey: 'label',
      },
    ]

    const table = constructTable<typeof features, TestRow>({
      features,
      renderFallbackValue: '',
      data,
      columns,
      initialState: {
        grouping: ['bucket'],
      },
    })

    expect(
      table.getGroupedRowModel().rows.map((row) => row.groupingValue),
    ).toEqual(['alpha-0', 'alpha-1'])
    expect(calls).toEqual([
      {
        originalRow: data[0],
        index: 0,
        rowId: '0',
        rowIndex: 0,
        rowOriginal: data[0],
      },
      {
        originalRow: data[1],
        index: 1,
        rowId: '1',
        rowIndex: 1,
        rowOriginal: data[1],
      },
    ])
  })
})
