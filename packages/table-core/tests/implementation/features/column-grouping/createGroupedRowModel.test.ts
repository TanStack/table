import { describe, expect, it } from 'vitest'
import {
  aggregationFns,
  aggregationFeature,
  columnGroupingFeature,
  constructTable,
  createGroupedRowModel,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { Person } from '../../../fixtures/data/types'
import type { ColumnDef, RowModel } from '../../../../src'

const features = testFeatures({
  aggregationFeature,
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})

interface TestRow {
  status: string | undefined
  firstName: string
}

const columns: Array<ColumnDef<typeof features, TestRow, any>> = [
  { accessorKey: 'status', id: 'status' },
  { accessorKey: 'firstName', id: 'firstName' },
]

function makeTable(data: Array<TestRow>, grouping: Array<string>) {
  return constructTable<typeof features, TestRow>({
    features,
    renderFallbackValue: '',
    data,
    columns,
    initialState: { grouping },
  })
}

function expectUniqueFlatRowIds(rowModel: RowModel<any, any>) {
  const ids = rowModel.flatRows.map((row) => row.id)
  expect(new Set(ids).size).toBe(ids.length)
}

describe('createGroupedRowModel flatRows contain every row exactly once', () => {
  it('single-level grouping over flat data', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'one' },
      { status: 'a', firstName: 'two' },
      { status: 'a', firstName: 'three' },
      { status: 'b', firstName: 'four' },
      { status: 'b', firstName: 'five' },
    ]
    const table = makeTable(data, ['status'])
    const rowModel = table.getRowModel()

    expect(rowModel.rows.length).toBe(2)
    expect(rowModel.rows.map((row) => row.getDisplayIndex())).toEqual([0, 1])

    table.setGrouping([])

    expect(
      table.getRowModel().rows.map((row) => row.getDisplayIndex()),
    ).toEqual([0, 1, 2, 3, 4])
    // 2 group rows + 5 leaf rows, each exactly once
    expect(rowModel.flatRows.length).toBe(7)
    expectUniqueFlatRowIds(rowModel)
    expect(Object.keys(rowModel.rowsById).length).toBe(7)
  })

  it('two-level grouping over flat data', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'x' },
      { status: 'a', firstName: 'x' },
      { status: 'a', firstName: 'y' },
      { status: 'b', firstName: 'x' },
    ]
    const table = makeTable(data, ['status', 'firstName'])
    const rowModel = table.getGroupedRowModel()

    // 2 depth-0 groups + 3 depth-1 groups + 4 leaves
    expect(rowModel.flatRows.length).toBe(9)
    expectUniqueFlatRowIds(rowModel)

    const ids = new Set(rowModel.flatRows.map((row) => row.id))
    expect(ids.has('status:a')).toBe(true)
    expect(ids.has('status:b')).toBe(true)
    expect(ids.has('status:a>firstName:x')).toBe(true)
    expect(ids.has('status:a>firstName:y')).toBe(true)
    expect(ids.has('status:b>firstName:x')).toBe(true)
  })

  it('single-level grouping over tree data keeps descendants below the terminal depth exactly once', () => {
    // 2 parents, each with 2 children, each with 2 grandchildren
    const data = generateTestData(2, 2, 2)
    data[0]!.status = 'single'
    data[1]!.status = 'complicated'

    const table = constructTable<typeof features, Person>({
      features,
      renderFallbackValue: '',
      data,
      columns: [
        { accessorKey: 'status', id: 'status' },
        { accessorKey: 'firstName', id: 'firstName' },
      ] as Array<ColumnDef<typeof features, Person, any>>,
      getSubRows: (originalRow) => originalRow.subRows,
      initialState: { grouping: ['status'] },
    })
    const rowModel = table.getGroupedRowModel()

    // 2 group rows + 2 parents + 4 children + 8 grandchildren
    expect(rowModel.flatRows.length).toBe(16)
    expectUniqueFlatRowIds(rowModel)

    const ids = new Set(rowModel.flatRows.map((row) => row.id))
    for (const id of ['0', '1', '0.0', '0.1', '0.0.0', '0.0.1', '1.1.1']) {
      expect(ids.has(id)).toBe(true)
    }

    // Depths are rewritten under the grouping: groups 0, parents 1, children 2, grandchildren 3
    expect(rowModel.rows[0]!.depth).toBe(0)
    expect(rowModel.rowsById['0']!.depth).toBe(1)
    expect(rowModel.rowsById['0.0']!.depth).toBe(2)
    expect(rowModel.rowsById['0.0.0']!.depth).toBe(3)
  })

  it('groups rows with undefined grouping values exactly once', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'one' },
      { status: 'a', firstName: 'two' },
      { status: undefined, firstName: 'three' },
    ]
    const table = makeTable(data, ['status'])
    const rowModel = table.getGroupedRowModel()

    expect(rowModel.rowsById).toHaveProperty('status:undefined')
    // 2 group rows + 3 leaf rows
    expect(rowModel.flatRows.length).toBe(5)
    expectUniqueFlatRowIds(rowModel)
  })

  it('grouping on a nonexistent column keeps every top-level row exactly once', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'one' },
      { status: 'b', firstName: 'two' },
      { status: 'c', firstName: 'three' },
    ]
    const table = makeTable(data, ['nope'])
    const rowModel = table.getGroupedRowModel()

    expect(rowModel.rows.length).toBe(3)
    expect(rowModel.flatRows.length).toBe(3)
    expectUniqueFlatRowIds(rowModel)
  })
})
