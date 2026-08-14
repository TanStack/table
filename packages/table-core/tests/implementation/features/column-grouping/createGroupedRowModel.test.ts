import { describe, expect, it, vi } from 'vitest'
import {
  rowAggregationFeature,
  aggregationFns,
  columnGroupingFeature,
  constructTable,
  createGroupedRowModel,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { Person } from '../../../fixtures/data/types'
import type { ColumnDef, RowModel } from '../../../../src'

const features = testFeatures({
  rowAggregationFeature,
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

function flattenRows<TRow extends { subRows: Array<TRow> }>(rows: Array<TRow>) {
  const flatRows: Array<TRow> = []

  const visit = (nestedRows: Array<TRow>) => {
    for (const row of nestedRows) {
      flatRows.push(row)
      if (row.subRows.length) {
        visit(row.subRows)
      }
    }
  }

  visit(rows)
  return flatRows
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

describe('createGroupedRowModel flatRows follow the grouped rows tree', () => {
  it('lists a group ahead of its own rows over flat data', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'one' },
      { status: 'a', firstName: 'two' },
      { status: 'b', firstName: 'three' },
    ]
    const rowModel = makeTable(data, ['status']).getGroupedRowModel()

    expect(rowModel.flatRows.map((row) => row.id)).toEqual([
      'status:a',
      '0',
      '1',
      'status:b',
      '2',
    ])
  })

  it('lists a group ahead of its own rows at every grouping depth', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'x' },
      { status: 'a', firstName: 'y' },
      { status: 'b', firstName: 'x' },
    ]
    const rowModel = makeTable(data, [
      'status',
      'firstName',
    ]).getGroupedRowModel()

    expect(rowModel.flatRows.map((row) => row.id)).toEqual([
      'status:a',
      'status:a>firstName:x',
      '0',
      'status:a>firstName:y',
      '1',
      'status:b',
      'status:b>firstName:x',
      '2',
    ])
  })

  it('lists a parent ahead of its own sub-rows below the terminal grouping depth', () => {
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

    expect(rowModel.flatRows.map((row) => row.id)).toEqual(
      flattenRows(rowModel.rows).map((row) => row.id),
    )
  })
})

interface AbcRow {
  a: string
  b: string
  c: string
}

describe('createGroupedRowModel multi-level structure', () => {
  it('should build the full 3-level group structure with composite ids, depths, subRows, and leafRows', () => {
    const data: Array<AbcRow> = [
      { a: 'a1', b: 'b1', c: 'c1' },
      { a: 'a1', b: 'b1', c: 'c2' },
      { a: 'a1', b: 'b2', c: 'c1' },
      { a: 'a2', b: 'b1', c: 'c1' },
    ]
    const table = constructTable<typeof features, AbcRow>({
      features,
      renderFallbackValue: '',
      data,
      columns: [
        { accessorKey: 'a', id: 'a' },
        { accessorKey: 'b', id: 'b' },
        { accessorKey: 'c', id: 'c' },
      ] as Array<ColumnDef<typeof features, AbcRow, any>>,
      initialState: { grouping: ['a', 'b', 'c'] },
    })
    const rowModel = table.getGroupedRowModel()

    // depth 0: 2 groups (a1, a2)
    expect(rowModel.rows.map((row) => row.id)).toEqual(['a:a1', 'a:a2'])
    expect(rowModel.rows.map((row) => row.depth)).toEqual([0, 0])

    const a1 = rowModel.rows[0]! as any
    const a2 = rowModel.rows[1]! as any

    // depth 1: composite ids chain through the parent id
    expect(a1.subRows.map((row: any) => row.id)).toEqual([
      'a:a1>b:b1',
      'a:a1>b:b2',
    ])
    expect(a2.subRows.map((row: any) => row.id)).toEqual(['a:a2>b:b1'])
    expect(a1.subRows.map((row: any) => row.depth)).toEqual([1, 1])

    // depth 2: c-level groups
    const a1b1 = a1.subRows[0]
    expect(a1b1.subRows.map((row: any) => row.id)).toEqual([
      'a:a1>b:b1>c:c1',
      'a:a1>b:b1>c:c2',
    ])
    expect(a1b1.subRows.map((row: any) => row.depth)).toEqual([2, 2])

    // depth 3: leaf data rows under the deepest groups
    const a1b1c1 = a1b1.subRows[0]
    expect(a1b1c1.subRows.length).toBe(1)
    expect(a1b1c1.subRows[0].depth).toBe(3)
    expect(a1b1c1.subRows[0].parentId).toBe('a:a1>b:b1>c:c1')

    // leafRows at each level are the original data rows in that bucket
    expect(a1.leafRows.length).toBe(3)
    expect(a1b1.leafRows.length).toBe(2)
    expect(a1b1c1.leafRows.length).toBe(1)
    expect(a2.leafRows.length).toBe(1)

    // 2 + 3 + 4 group rows + 4 leaves, each exactly once
    expect(rowModel.flatRows.length).toBe(13)
    expectUniqueFlatRowIds(rowModel)
    expect(Object.keys(rowModel.rowsById).length).toBe(13)
  })
})

describe('createGroupedRowModel custom getGroupingValue', () => {
  it('should merge rows into shared buckets and call getGroupingValue once per row via the grouping values cache', () => {
    const data: Array<TestRow> = [
      { status: 'apple', firstName: 'one' },
      { status: 'avocado', firstName: 'two' },
      { status: 'banana', firstName: 'three' },
      { status: 'apricot', firstName: 'four' },
    ]
    const getGroupingValue = vi.fn(
      (originalRow: TestRow) => originalRow.status![0],
    )
    const table = constructTable<typeof features, TestRow>({
      features,
      renderFallbackValue: '',
      data,
      columns: [
        { accessorKey: 'status', id: 'status', getGroupingValue },
        { accessorKey: 'firstName', id: 'firstName' },
      ] as Array<ColumnDef<typeof features, TestRow, any>>,
      initialState: { grouping: ['status'] },
    })
    const rowModel = table.getGroupedRowModel()

    // Rows sharing a first letter merge into the same bucket
    expect(rowModel.rows.map((row) => row.id)).toEqual(['status:a', 'status:b'])
    const aGroup = rowModel.rows[0]! as any
    expect(aGroup.leafRows.map((row: any) => row.original.status)).toEqual([
      'apple',
      'avocado',
      'apricot',
    ])
    expect((rowModel.rows[1]! as any).leafRows.length).toBe(1)

    // groupBy read each of the 4 rows exactly once
    expect(getGroupingValue).toHaveBeenCalledTimes(4)

    // Repeated reads hit _groupingValuesCache instead of re-invoking the fn
    aGroup.leafRows.forEach((row: any) => row.getGroupingValue('status'))
    expect(getGroupingValue).toHaveBeenCalledTimes(4)
  })
})

interface TreeRow {
  status: string
  firstName: string
  subRows?: Array<TreeRow>
}

function makeTreeTable(data: Array<TreeRow>, grouping: Array<string>) {
  return constructTable<typeof features, TreeRow>({
    features,
    renderFallbackValue: '',
    data,
    columns: [
      { accessorKey: 'status', id: 'status' },
      { accessorKey: 'firstName', id: 'firstName' },
    ] as Array<ColumnDef<typeof features, TreeRow, any>>,
    getSubRows: (originalRow) => originalRow.subRows,
    initialState: { grouping },
  })
}

describe('createGroupedRowModel leafRows vs subRows over tree data', () => {
  it('should flatten terminal descendants into leafRows while subRows keep direct children', () => {
    const data: Array<TreeRow> = [
      {
        status: 'x',
        firstName: 'parent1',
        subRows: [
          { status: 'x', firstName: 'child1' },
          { status: 'x', firstName: 'child2' },
        ],
      },
      {
        status: 'x',
        firstName: 'parent2',
        subRows: [{ status: 'x', firstName: 'child3' }],
      },
    ]
    const table = makeTreeTable(data, ['status'])
    const rowModel = table.getGroupedRowModel()

    expect(rowModel.rows.length).toBe(1)
    const group = rowModel.rows[0]! as any

    // subRows are the direct children of the group: the two parents
    expect(group.subRows.map((row: any) => row.original.firstName)).toEqual([
      'parent1',
      'parent2',
    ])

    // leafRows are the flattened terminal descendants: the three children only
    expect(group.leafRows.map((row: any) => row.original.firstName)).toEqual([
      'child1',
      'child2',
      'child3',
    ])
  })
})

describe('createGroupedRowModel grouping key coercion', () => {
  interface MixedRow {
    value: number | string | null
    firstName: string
  }

  function makeMixedTable(data: Array<MixedRow>) {
    return constructTable<typeof features, MixedRow>({
      features,
      renderFallbackValue: '',
      data,
      columns: [
        { accessorKey: 'value', id: 'value' },
        { accessorKey: 'firstName', id: 'firstName' },
      ] as Array<ColumnDef<typeof features, MixedRow, any>>,
      initialState: { grouping: ['value'] },
    })
  }

  it('should collide numeric 1 and string "1" into the same group (keys are string-coerced)', () => {
    // Current behavior: groupBy coerces every grouping value with template
    // string interpolation, so 1 and '1' share the 'value:1' bucket.
    const table = makeMixedTable([
      { value: 1, firstName: 'numeric' },
      { value: '1', firstName: 'string' },
      { value: 2, firstName: 'other' },
    ])
    const rowModel = table.getGroupedRowModel()

    expect(rowModel.rows.map((row) => row.id)).toEqual(['value:1', 'value:2'])
    expect((rowModel.rows[0]! as any).leafRows.length).toBe(2)
  })

  it('should group null values under the "null" key', () => {
    const table = makeMixedTable([
      { value: null, firstName: 'one' },
      { value: null, firstName: 'two' },
      { value: 'x', firstName: 'three' },
    ])
    const rowModel = table.getGroupedRowModel()

    expect(rowModel.rowsById).toHaveProperty('value:null')
    expect((rowModel.rowsById['value:null'] as any).leafRows.length).toBe(2)
  })
})

describe('createGroupedRowModel ancestor grouping-value inheritance', () => {
  interface RegionRow {
    region: string
    level: string
    firstName: string
  }

  it('should expose the parent region value on depth-1 group rows via getValue', () => {
    const data: Array<RegionRow> = [
      { region: 'east', level: 'high', firstName: 'one' },
      { region: 'east', level: 'low', firstName: 'two' },
      { region: 'west', level: 'high', firstName: 'three' },
    ]
    const table = constructTable<typeof features, RegionRow>({
      features,
      renderFallbackValue: '',
      data,
      columns: [
        { accessorKey: 'region', id: 'region' },
        { accessorKey: 'level', id: 'level' },
        { accessorKey: 'firstName', id: 'firstName' },
      ] as Array<ColumnDef<typeof features, RegionRow, any>>,
      initialState: { grouping: ['region', 'level'] },
    })
    const rowModel = table.getGroupedRowModel()

    const eastGroup = rowModel.rows[0]!
    expect(eastGroup.getValue('region')).toBe('east')

    const eastHigh = eastGroup.subRows[0]!
    expect(eastHigh.id).toBe('region:east>level:high')
    // Ancestor grouping column value is inherited on the deeper group row
    expect(eastHigh.getValue('level')).toBe('high')
    expect(eastHigh.getValue('region')).toBe('east')
    // Second read hits _valuesCache and stays consistent
    expect(eastHigh.getValue('region')).toBe('east')

    const westHigh = rowModel.rows[1]!.subRows[0]!
    expect(westHigh.getValue('region')).toBe('west')
  })
})

describe('createGroupedRowModel ungrouping reset', () => {
  it('should reset depth and parentId on flat rows after setGrouping([])', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'one' },
      { status: 'a', firstName: 'two' },
      { status: 'b', firstName: 'three' },
    ]
    const table = makeTable(data, ['status'])

    const grouped = table.getGroupedRowModel()
    expect(grouped.rowsById['0']!.depth).toBe(1)
    expect(grouped.rowsById['0']!.parentId).toBe('status:a')

    table.setGrouping([])
    const ungrouped = table.getGroupedRowModel()

    expect(ungrouped.rows.length).toBe(3)
    ungrouped.rows.forEach((row) => {
      expect(row.depth).toBe(0)
      expect(row.parentId).toBeUndefined()
    })
  })

  it('should reset depth and parentId on nested tree rows after setGrouping([])', () => {
    const data: Array<TreeRow> = [
      {
        status: 'x',
        firstName: 'parent1',
        subRows: [
          {
            status: 'x',
            firstName: 'child1',
            subRows: [{ status: 'x', firstName: 'grandchild1' }],
          },
        ],
      },
      { status: 'y', firstName: 'parent2' },
    ]
    const table = makeTreeTable(data, ['status'])

    const grouped = table.getGroupedRowModel()
    expect(grouped.rowsById['0']!.depth).toBe(1)
    expect(grouped.rowsById['0']!.parentId).toBe('status:x')
    expect(grouped.rowsById['0.0']!.depth).toBe(2)
    expect(grouped.rowsById['0.0.0']!.depth).toBe(3)

    table.setGrouping([])
    const ungrouped = table.getGroupedRowModel()

    ungrouped.rows.forEach((row) => {
      expect(row.depth).toBe(0)
      expect(row.parentId).toBeUndefined()
    })
    // Nested descendants return to their natural tree depth instead of
    // keeping the shifted depth from the previous grouped pass.
    expect(ungrouped.rowsById['0.0']!.depth).toBe(1)
    expect(ungrouped.rowsById['0.0']!.parentId).toBe('0')
    expect(ungrouped.rowsById['0.0.0']!.depth).toBe(2)
    expect(ungrouped.rowsById['0.0.0']!.parentId).toBe('0.0')
  })
})

describe('createGroupedRowModel manualGrouping', () => {
  it('should bypass a registered grouped row model when manualGrouping is true', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'one' },
      { status: 'b', firstName: 'two' },
    ]
    const table = constructTable<typeof features, TestRow>({
      features,
      renderFallbackValue: '',
      data,
      columns,
      manualGrouping: true,
      initialState: { grouping: ['status'] },
    })

    expect(table.getGroupedRowModel()).toBe(table.getPreGroupedRowModel())
    expect(table.getGroupedRowModel().rows).toHaveLength(2)
  })
})

describe('createGroupedRowModel rowsById', () => {
  it('should contain group row ids and leaf ids exactly once', () => {
    const data: Array<TestRow> = [
      { status: 'a', firstName: 'one' },
      { status: 'a', firstName: 'two' },
      { status: 'b', firstName: 'three' },
    ]
    const table = makeTable(data, ['status'])
    const rowModel = table.getGroupedRowModel()

    const ids = Object.keys(rowModel.rowsById).sort()
    expect(ids).toEqual(['0', '1', '2', 'status:a', 'status:b'])
    // rowsById mirrors flatRows one-to-one
    expect(ids.length).toBe(rowModel.flatRows.length)
    expectUniqueFlatRowIds(rowModel)
  })
})
