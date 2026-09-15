import { describe, expect, it } from 'vitest'
import {
  aggregationFns,
  columnGroupingFeature,
  constructTable,
  createGroupedRowModel,
  rowAggregationFeature,
} from '../../src'
import { FlexRender, flexRender } from '../../src/flex-render'
import { testFeatures } from '../fixtures/features'
import type { ColumnDef } from '../../src'

type Person = {
  id: string
  region: string
  team: string
  amount: number
}

const data: Array<Person> = [
  { id: '1', region: 'Europe', team: 'Blue', amount: 1 },
  { id: '2', region: 'Europe', team: 'Green', amount: 2 },
]

describe('flexRender', () => {
  it('should return null for nullish templates', () => {
    expect(flexRender(null, {})).toBeNull()
    expect(flexRender(undefined, {})).toBeNull()
  })

  it('should call function templates with the props and pass through values', () => {
    expect(
      flexRender((props: { value: string }) => props.value, {
        value: 'called',
      }),
    ).toBe('called')
    expect(flexRender('static', {})).toBe('static')
    // Falsey non-nullish values still render.
    expect(flexRender(0, {})).toBe(0)
  })
})

describe('FlexRender', () => {
  const features = testFeatures({})

  const unevenColumns: Array<ColumnDef<typeof features, Person, any>> = [
    { id: 'shallow', accessorKey: 'region', header: 'Shallow' },
    {
      id: 'group',
      header: 'Group',
      columns: [{ id: 'deep', accessorKey: 'team', header: 'Deep' }],
    },
  ]

  function makeUnevenTable() {
    return constructTable({ features, columns: unevenColumns, data })
  }

  it('should render header and footer templates', () => {
    const table = constructTable({
      features,
      data,
      columns: [
        {
          id: 'region',
          accessorKey: 'region',
          header: 'Region',
          footer: 'Sum',
        },
      ],
    })
    const header = table.getHeaderGroups()[0]!.headers[0]!

    expect(FlexRender({ header })).toBe('Region')
    expect(FlexRender({ footer: header })).toBe('Sum')
  })

  // Skipping placeholders is the caller's decision, which is what makes
  // `header.rowSpan` usable for merging header cells vertically. Every
  // framework adapter behaves this way.
  it('should render a placeholder header instead of suppressing it', () => {
    const headerGroups = makeUnevenTable().getHeaderGroups()
    const topRow = headerGroups[0]!.headers
    const spanningHeader = topRow.find(
      (header) => header.column.id === 'shallow',
    )!

    expect(spanningHeader.isPlaceholder).toBe(true)
    expect(spanningHeader.rowSpan).toBe(2)
    expect(FlexRender({ header: spanningHeader })).toBe('Shallow')

    // The real leaf header it covers still renders too; the template decides
    // which of the two to skip.
    const coveredHeader = headerGroups[1]!.headers.find(
      (header) => header.column.id === 'shallow',
    )!
    expect(coveredHeader.rowSpan).toBe(0)
    expect(FlexRender({ header: coveredHeader })).toBe('Shallow')
  })

  it('should render a placeholder footer instead of suppressing it', () => {
    const table = constructTable({
      features,
      data,
      columns: [
        { id: 'shallow', accessorKey: 'region', footer: 'Shallow Footer' },
        {
          id: 'group',
          header: 'Group',
          columns: [{ id: 'deep', accessorKey: 'team' }],
        },
      ],
    })
    const spanningFooter = table
      .getFooterGroups()
      .flatMap((footerGroup) => footerGroup.headers)
      .find((header) => header.column.id === 'shallow' && header.isPlaceholder)!

    expect(FlexRender({ footer: spanningFooter })).toBe('Shallow Footer')
  })

  it('should return null when no cell, header, or footer is passed', () => {
    expect(FlexRender({} as any)).toBeNull()
  })
})

describe('FlexRender with the column grouping feature', () => {
  const groupingFeatures = testFeatures({
    aggregationFns,
    columnGroupingFeature,
    groupedRowModel: createGroupedRowModel(),
    rowAggregationFeature,
  })

  const groupingColumns: Array<
    ColumnDef<typeof groupingFeatures, Person, any>
  > = [
    {
      id: 'region',
      accessorKey: 'region',
      cell: (context) => `Region ${String(context.getValue())}`,
    },
    {
      id: 'team',
      accessorKey: 'team',
      cell: (context) => `Team ${String(context.getValue())}`,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      aggregationFn: 'sum',
      cell: (context) => `Amount ${String(context.getValue())}`,
      aggregatedCell: (context) => `Total ${String(context.getValue())}`,
    },
  ]

  function makeGroupedTable() {
    return constructTable({
      features: groupingFeatures,
      columns: groupingColumns,
      data,
      initialState: { grouping: ['region', 'team'] },
    })
  }

  // These three modes match every framework adapter's FlexRender.
  it('should render aggregated cells with aggregatedCell', () => {
    const row = makeGroupedTable().getRowModel().rows[0]!
    const cell = row.getAllCells().find((c) => c.column.id === 'amount')!

    expect(cell.getIsAggregated()).toBe(true)
    expect(FlexRender({ cell })).toBe('Total 3')
  })

  it('should render nothing for grouping placeholder cells', () => {
    const row = makeGroupedTable().getRowModel().rows[0]!
    const cell = row.getAllCells().find((c) => c.column.id === 'team')!

    expect(cell.getIsPlaceholder()).toBe(true)
    expect(FlexRender({ cell })).toBeNull()
  })

  it('should render the active grouping cell with its own cell template', () => {
    const row = makeGroupedTable().getRowModel().rows[0]!
    const cell = row.getAllCells().find((c) => c.column.id === 'region')!

    expect(cell.getIsGrouped()).toBe(true)
    expect(FlexRender({ cell })).toBe('Region Europe')
  })

  it('should render aggregated cells with cell when no aggregatedCell is defined', () => {
    const table = constructTable({
      features: groupingFeatures,
      data,
      columns: [
        { id: 'region', accessorKey: 'region' },
        {
          id: 'amount',
          accessorKey: 'amount',
          aggregationFn: 'sum',
          cell: (context) => `Amount ${String(context.getValue())}`,
        },
      ],
      initialState: { grouping: ['region'] },
    })
    const row = table.getRowModel().rows[0]!
    const cell = row.getAllCells().find((c) => c.column.id === 'amount')!

    expect(cell.getIsAggregated()).toBe(true)
    expect(FlexRender({ cell })).toBe('Amount 3')
  })

  it('should format aggregated cells when no cell renderers are defined', () => {
    const table = constructTable({
      features: groupingFeatures,
      data,
      columns: [
        { id: 'region', accessorKey: 'region' },
        {
          id: 'amount',
          accessorKey: 'amount',
          aggregationFn: 'sum',
        },
      ],
      initialState: { grouping: ['region'] },
    })
    const row = table.getRowModel().rows[0]!
    const cell = row.getAllCells().find((c) => c.column.id === 'amount')!

    expect(cell.getIsAggregated()).toBe(true)
    expect(FlexRender({ cell })).toBe('3')
  })
})
