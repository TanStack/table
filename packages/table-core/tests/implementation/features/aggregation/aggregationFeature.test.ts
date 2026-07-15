import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  aggregationFeature,
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  constructTable,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  constructAggregationFn,
  filterFn_equalsString,
  rowPaginationFeature,
  rowExpandingFeature,
  rowSelectionFeature,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('aggregationFeature', () => {
  it('aggregates scalar and keyed root values without grouping', () => {
    const features = testFeatures({ aggregationFeature, aggregationFns })
    const data = [{ amount: 10 }, { amount: 20 }, { amount: null }]
    const columns: Array<
      ColumnDef<typeof features, (typeof data)[number], any>
    > = [
      { accessorKey: 'amount', id: 'scalar', aggregationFn: 'sum' },
      {
        accessorFn: (row) => row.amount,
        id: 'multiple',
        aggregationFn: [
          'count',
          'mean',
          { id: 'range', aggregationFn: 'extent' },
        ],
      },
      { accessorFn: (row) => row.amount, id: 'empty', aggregationFn: [] },
    ]
    const table = constructTable({ features, data, columns })

    expect(table.getColumn('scalar')!.getAggregationValue()).toBe(30)
    expect(table.getColumn('scalar')!.getAggregationValue([])).toBe(0)
    expect(table.getColumn('multiple')!.getAggregationValue()).toEqual({
      count: 3,
      mean: 15,
      range: [10, 20],
    })
    expect(table.getColumn('empty')!.getAggregationValue()).toEqual({})
    expect(
      table
        .getColumn('multiple')!
        .getAggregationFns()
        .map((fn) => fn.id),
    ).toEqual(['count', 'mean', 'range'])
    expect(
      table.getCoreRowModel().rows[0]!.getAllCells()[0]!.getIsAggregated(),
    ).toBe(false)
  })

  it('infers auto aggregation from the first core row value', () => {
    const features = testFeatures({ aggregationFeature, aggregationFns })
    const table = constructTable({
      features,
      data: [{ amount: 2 }, { amount: 3 }],
      columns: [{ accessorKey: 'amount' }],
    })

    const rows = table.getCoreRowModel().rows
    const firstGetValue = vi.spyOn(rows[0]!, 'getValue')
    const secondGetValue = vi.spyOn(rows[1]!, 'getValue')
    const column = table.getColumn('amount')!

    expect(column.getAutoAggregationFn()).toBe(aggregationFns.sum)
    expect(column.getAutoAggregationFn()).toBe(aggregationFns.sum)
    expect(firstGetValue).toHaveBeenCalledTimes(1)
    expect(secondGetValue).not.toHaveBeenCalled()
    expect(table.getColumn('amount')!.getAggregationValue()).toBe(5)
  })

  it('caches the default rows, invalidates with data, and recomputes explicit rows', () => {
    const aggregate = vi.fn(({ rows }) => rows.length)
    const sized = constructAggregationFn<any, any, unknown, number>({
      aggregate,
    })
    const features = testFeatures({
      aggregationFeature,
      aggregationFns: { sized },
    })
    const columns: Array<ColumnDef<typeof features, { value: number }, any>> = [
      { accessorKey: 'value', aggregationFn: 'sized' },
    ]
    const table = constructTable({
      features,
      data: [{ value: 1 }, { value: 2 }],
      columns,
    })
    const column = table.getColumn('value')!

    expect(column.getAggregationValue()).toBe(2)
    expect(column.getAggregationValue()).toBe(2)
    expect(aggregate).toHaveBeenCalledTimes(1)

    const rows = table.getCoreRowModel().rows
    expect(column.getAggregationValue(rows)).toBe(2)
    expect(column.getAggregationValue(rows)).toBe(2)
    expect(aggregate).toHaveBeenCalledTimes(3)

    table.setOptions((old) => ({ ...old, data: [...old.data, { value: 3 }] }))
    expect(column.getAggregationValue()).toBe(3)
    expect(aggregate).toHaveBeenCalledTimes(4)
  })

  it('accepts rows from any row model or custom selection', () => {
    const features = testFeatures({
      aggregationFeature,
      aggregationFns,
      columnFilteringFeature,
      filterFns: { equalsString: filterFn_equalsString },
      filteredRowModel: createFilteredRowModel(),
      paginatedRowModel: createPaginatedRowModel(),
      rowPaginationFeature,
      rowSelectionFeature,
    })
    const data = [
      { category: 'a', amount: 1 },
      { category: 'a', amount: 2 },
      { category: 'b', amount: 4 },
      { category: 'a', amount: 8 },
    ]
    const columns: Array<
      ColumnDef<typeof features, (typeof data)[number], any>
    > = [
      { accessorKey: 'category', filterFn: 'equalsString' },
      { accessorKey: 'amount', aggregationFn: 'sum' },
    ]
    const table = constructTable({
      features,
      data,
      columns,
      initialState: {
        columnFilters: [{ id: 'category', value: 'a' }],
        pagination: { pageIndex: 0, pageSize: 2 },
        rowSelection: { '1': true, '2': true },
      },
    })
    const column = table.getColumn('amount')!

    expect(column.getAggregationValue()).toBe(11)
    expect(column.getAggregationValue(table.getCoreRowModel().rows)).toBe(15)
    expect(column.getAggregationValue(table.getRowModel().rows)).toBe(3)
    expect(
      column.getAggregationValue(table.getFilteredSelectedRowModel().rows),
    ).toBe(2)
    expect(column.getAggregationValue([table.getCoreRowModel().rows[2]!])).toBe(
      4,
    )
  })

  it('normalizes hierarchical and duplicate explicit rows to terminal leaves', () => {
    type Node = { amount: number; subRows?: Array<Node> }
    const features = testFeatures({ aggregationFeature, aggregationFns })
    const data: Array<Node> = [
      {
        amount: 100,
        subRows: [{ amount: 2 }, { amount: 3 }],
      },
    ]
    const table = constructTable({
      features,
      data,
      columns: [{ accessorKey: 'amount', aggregationFn: 'sum' }],
      getSubRows: (row) => row.subRows,
    })
    const parent = table.getCoreRowModel().rows[0]!

    expect(table.getColumn('amount')!.getAggregationValue()).toBe(5)
    expect(
      table
        .getColumn('amount')!
        .getAggregationValue([parent, parent.subRows[0]!]),
    ).toBe(5)
  })

  it('uses handled column values and configurable local fallback', () => {
    const features = testFeatures({ aggregationFeature, aggregationFns })
    const resolver = vi.fn(({ rows }) => (rows ? { value: 99 } : undefined))
    const columns: Array<ColumnDef<typeof features, { amount: number }, any>> =
      [
        {
          accessorKey: 'amount',
          aggregationFn: 'sum',
          getAggregationValue: resolver,
        },
      ]
    const table = constructTable({
      features,
      data: [{ amount: 1 }, { amount: 2 }],
      columns,
    })
    const column = table.getColumn('amount')!

    expect(column.getAggregationValue(table.getCoreRowModel().rows)).toBe(99)
    expect(column.getAggregationValue()).toBe(3)

    table.setOptions((old) => ({ ...old, manualAggregation: true }))
    expect(column.getAggregationValue()).toBeUndefined()
    const handledUndefined = vi.fn(() => ({ value: undefined }))
    table.setOptions((old) => ({
      ...old,
      columns: [
        {
          accessorKey: 'amount',
          aggregationFn: 'sum',
          getAggregationValue: handledUndefined,
        },
      ],
    }))
    expect(table.getColumn('amount')!.getAggregationValue()).toBeUndefined()
    expect(handledUndefined).toHaveBeenCalledOnce()
  })

  it('supports a shared aggregation value provider through defaultColumn', () => {
    const features = testFeatures({ aggregationFeature, aggregationFns })
    const resolver = vi.fn(({ column }) =>
      column.id === 'amount' ? { value: 42 } : undefined,
    )
    const table = constructTable({
      features,
      data: [{ amount: 1 }],
      columns: [{ accessorKey: 'amount', aggregationFn: 'sum' }],
      defaultColumn: { getAggregationValue: resolver },
    })

    expect(table.getColumn('amount')!.getAggregationValue()).toBe(42)
    expect(resolver).toHaveBeenCalledOnce()
  })

  it('warns and preserves undefined keys for invalid multi configurations', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const features = testFeatures({ aggregationFeature, aggregationFns })
    const table = constructTable({
      features,
      data: [{ amount: 1 }],
      columns: [
        {
          accessorKey: 'amount',
          aggregationFn: ['sum', 'sum', 'missing'] as any,
        },
      ],
    })

    expect(table.getColumn('amount')!.getAggregationValue()).toEqual({
      missing: undefined,
      sum: undefined,
    })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicated'))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('not registered'))
  })
})

describe('aggregation and grouping integration', () => {
  it('provides groupingRow only for grouped aggregation contexts', () => {
    const aggregate = vi.fn(({ rows }) => rows.length)
    const sized = constructAggregationFn<any, any, unknown, number>({
      aggregate,
    })
    const features = testFeatures({
      aggregationFeature,
      aggregationFns: { sized },
      columnGroupingFeature,
      groupedRowModel: createGroupedRowModel(),
    })
    const table = constructTable({
      features,
      data: [
        { region: 'a', amount: 1 },
        { region: 'a', amount: 2 },
      ],
      columns: [
        { accessorKey: 'region' },
        { accessorKey: 'amount', aggregationFn: 'sized' },
      ],
      initialState: { grouping: ['region'] },
    })
    const column = table.getColumn('amount')!

    expect(column.getAggregationValue()).toBe(2)
    const rootContext = aggregate.mock.calls[0]![0]
    expect(rootContext).not.toHaveProperty('subRows')
    expect(rootContext).not.toHaveProperty('groupingRow')
    expect(rootContext).not.toHaveProperty('source')

    const groupingRow = table.getGroupedRowModel().rows[0]!
    expect(groupingRow.getValue('amount')).toBe(2)
    const groupedContext = aggregate.mock.calls[1]![0]
    expect(groupedContext.subRows).toBe(groupingRow.subRows)
    expect(groupedContext.groupingRow).toBe(groupingRow)
    expect(groupedContext.groupingRow!.depth).toBe(0)
    expect(groupedContext).not.toHaveProperty('source')
  })

  it('lets aggregate choose immediate sub-rows instead of terminal rows', () => {
    const aggregate = vi.fn(({ subRows, rows }) =>
      subRows ? subRows.length : rows.length,
    )
    const childCount = constructAggregationFn<any, any, unknown, number>({
      aggregate,
    })
    const features = testFeatures({
      aggregationFeature,
      aggregationFns: { childCount },
      columnGroupingFeature,
      groupedRowModel: createGroupedRowModel(),
    })
    const table = constructTable({
      features,
      data: [
        { region: 'a', team: 'x', amount: 1 },
        { region: 'a', team: 'x', amount: 2 },
        { region: 'a', team: 'y', amount: 3 },
      ],
      columns: [
        { accessorKey: 'region' },
        { accessorKey: 'team' },
        { accessorKey: 'amount', aggregationFn: 'childCount' },
      ],
      initialState: { grouping: ['region', 'team'] },
    })

    const region = table.getGroupedRowModel().rows[0]!
    const team = region.subRows[0]!

    expect(team.getValue('amount')).toBe(2)
    expect(region.getValue('amount')).toBe(2)

    const terminalContext = aggregate.mock.calls[0]![0]
    expect(terminalContext.subRows).toBe(team.subRows)
    expect(terminalContext.rows).toHaveLength(2)

    const nestedContext = aggregate.mock.calls[1]![0]
    expect(nestedContext.subRows).toBe(region.subRows)
    expect(nestedContext.subRows).toHaveLength(2)
    expect(nestedContext.rows).toHaveLength(3)
  })

  it('keeps grouping structural when aggregationFeature is absent', () => {
    const features = testFeatures({
      columnGroupingFeature,
      groupedRowModel: createGroupedRowModel(),
    })
    const table = constructTable({
      features,
      data: [
        { group: 'a', amount: 1 },
        { group: 'a', amount: 2 },
      ],
      columns: [{ accessorKey: 'group' }, { accessorKey: 'amount' }],
      initialState: { grouping: ['group'] },
    })

    expect(
      table.getGroupedRowModel().rows[0]!.getValue('amount'),
    ).toBeUndefined()
  })

  it('computes nested scalar/keyed values and aggregates deeper grouping columns', () => {
    const features = testFeatures({
      aggregationFeature,
      aggregationFns,
      columnGroupingFeature,
      groupedRowModel: createGroupedRowModel(),
    })
    const data = [
      { region: 'north', level: 1, amount: 10, soldAt: new Date('2024-01-01') },
      { region: 'north', level: 1, amount: 20, soldAt: new Date('2024-02-01') },
      {
        region: 'north',
        level: 2,
        amount: 100,
        soldAt: new Date('2024-03-01'),
      },
    ]
    const columns: Array<
      ColumnDef<typeof features, (typeof data)[number], any>
    > = [
      { accessorKey: 'region' },
      { accessorKey: 'level', aggregationFn: 'sum' },
      {
        accessorKey: 'amount',
        aggregationFn: ['sum', 'mean', 'extent'],
      },
      { accessorKey: 'soldAt', aggregationFn: 'extent' },
    ]
    const table = constructTable({
      features,
      data,
      columns,
      initialState: { grouping: ['region', 'level'] },
    })
    const region = table.getGroupedRowModel().rows[0]!
    const level = region.subRows[0]!

    expect(region.getValue('level')).toBe(4)
    expect(level.getValue('level')).toBe(1)
    expect(region.getValue('amount')).toEqual({
      extent: [10, 100],
      mean: 130 / 3,
      sum: 130,
    })
    expect(region.getValue('soldAt')).toEqual([
      data[0]!.soldAt,
      data[2]!.soldAt,
    ])
    const amountCell = region
      .getAllCells()
      .find((cell) => cell.column.id === 'amount')!
    expect(amountCell.getIsAggregated()).toBe(true)
    const defaultAggregatedCell = amountCell.column.columnDef.aggregatedCell
    expect(
      typeof defaultAggregatedCell === 'function'
        ? defaultAggregatedCell(amountCell.getContext())
        : defaultAggregatedCell,
    ).toContain('sum: 130')
    expect(
      region
        .getAllCells()
        .find((cell) => cell.column.id === 'level')!
        .getIsAggregated(),
    ).toBe(false)
  })

  it('caches grouped values and merges sub-row results without rescanning parent leaves', () => {
    const aggregate = vi.fn(({ rows }) => rows.length)
    const merge = vi.fn(
      ({
        subRowResults,
      }: {
        subRowResults: ReadonlyArray<number>
        subRows: ReadonlyArray<unknown>
      }) => subRowResults.reduce((total, value) => total + value, 0),
    )
    const sized = constructAggregationFn<any, any, unknown, number>({
      aggregate,
      merge,
    })
    const features = testFeatures({
      aggregationFeature,
      aggregationFns: { sized },
      columnGroupingFeature,
      groupedRowModel: createGroupedRowModel(),
    })
    const table = constructTable({
      features,
      data: [
        { region: 'a', team: 'x', amount: 1 },
        { region: 'a', team: 'x', amount: 2 },
        { region: 'a', team: 'y', amount: 3 },
      ],
      columns: [
        { accessorKey: 'region' },
        { accessorKey: 'team' },
        { accessorKey: 'amount', aggregationFn: 'sized' },
      ],
      initialState: { grouping: ['region', 'team'] },
    })
    const region = table.getGroupedRowModel().rows[0]!

    expect(region.getValue('amount')).toBe(3)
    expect(region.getValue('amount')).toBe(3)
    expect(aggregate).toHaveBeenCalledTimes(2)
    expect(merge).toHaveBeenCalledTimes(1)
    expect(merge.mock.calls[0]![0].subRows).toBe(region.subRows)
    expect(merge.mock.calls[0]![0].subRowResults).toEqual([2, 1])
  })

  it('rebuilds grouped aggregation values when column definitions change', () => {
    const features = testFeatures({
      aggregationFeature,
      aggregationFns,
      columnGroupingFeature,
      groupedRowModel: createGroupedRowModel(),
    })
    const columns = (
      aggregationFn: 'count' | 'sum',
    ): Array<
      ColumnDef<typeof features, { region: string; amount: number }, any>
    > => [{ accessorKey: 'region' }, { accessorKey: 'amount', aggregationFn }]
    const table = constructTable({
      features,
      data: [
        { region: 'a', amount: 1 },
        { region: 'a', amount: 2 },
      ],
      columns: columns('sum'),
      initialState: { grouping: ['region'] },
    })
    const summedGroup = table.getGroupedRowModel().rows[0]!

    expect(summedGroup.getValue('amount')).toBe(3)

    table.setOptions((old) => ({ ...old, columns: columns('count') }))
    const countedGroup = table.getGroupedRowModel().rows[0]!

    expect(countedGroup).not.toBe(summedGroup)
    expect(countedGroup.getValue('amount')).toBe(2)
  })

  it('treats supplied hierarchical rows as terminal-leaf subtrees', () => {
    const features = testFeatures({
      aggregationFeature,
      aggregationFns,
      columnGroupingFeature,
      expandedRowModel: createExpandedRowModel(),
      groupedRowModel: createGroupedRowModel(),
      rowExpandingFeature,
    })
    const table = constructTable({
      features,
      data: [
        { region: 'a', amount: 1 },
        { region: 'a', amount: 2 },
      ],
      columns: [
        { accessorKey: 'region' },
        { accessorKey: 'amount', aggregationFn: 'sum' },
      ],
      initialState: { grouping: ['region'] },
    })
    const column = table.getColumn('amount')!

    expect(column.getAggregationValue(table.getRowModel().rows)).toBe(3)
    table.setExpanded(true)
    expect(column.getAggregationValue(table.getRowModel().rows)).toBe(3)
  })
})
