import { describe, expect, it } from 'vitest'
import { cellSpanningFeature, constructTable } from '../../../../src'
import {
  cell_getColSpan,
  cell_getIsCovered,
  cell_getRowSpan,
  column_getCanSpan,
  table_getCellSpanIndex,
} from '../../../../src/static-functions'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, Table } from '../../../../src'

const features = testFeatures({
  cellSpanningFeature,
})

// Statics must degrade gracefully when the feature is not registered.
const coreOnlyFeatures = testFeatures({})

interface TestRow {
  id: string
  region: string | null
  team: string
  amount: number | undefined
  isSummary?: boolean
}

const defaultData: Array<TestRow> = [
  { id: 'r0', region: 'North', team: 'Alpha', amount: 1 },
  { id: 'r1', region: 'North', team: 'Alpha', amount: 2 },
  { id: 'r2', region: 'North', team: 'Bravo', amount: 3 },
  { id: 'r3', region: 'South', team: 'Bravo', amount: 4 },
  { id: 'r4', region: 'South', team: 'Alpha', amount: 5 },
]

function makeColumns(
  overrides: Partial<
    Record<'region' | 'team' | 'amount', Record<string, unknown>>
  > = {},
): Array<ColumnDef<typeof features, TestRow>> {
  return [
    {
      id: 'region',
      accessorKey: 'region',
      spanRows: true,
      ...overrides.region,
    },
    { id: 'team', accessorKey: 'team', ...overrides.team },
    { id: 'amount', accessorKey: 'amount', ...overrides.amount },
  ]
}

function makeTable(
  overrides: Record<string, unknown> = {},
): Table<typeof features, TestRow> {
  return constructTable<typeof features, TestRow>({
    features,
    data: defaultData,
    columns: makeColumns(),
    getRowId: (row) => row.id,
    renderFallbackValue: '',
    ...overrides,
  })
}

function rowSpansOf(
  table: Table<typeof features, TestRow>,
  columnId: string,
): Array<number> {
  return table
    .getRowModel()
    .rows.map((row) => cell_getRowSpan(row.getAllCellsByColumnId()[columnId]!))
}

describe('table_getCellSpanIndex', () => {
  it('detects value runs with the anchor holding the run length', () => {
    const index = table_getCellSpanIndex(makeTable() as any)

    expect(Array.from(index.rowSpans['region']!)).toEqual([3, 0, 0, 2, 0])
  })

  it('stores no array for a column whose every run has length one', () => {
    const table = makeTable({
      columns: makeColumns({ team: { spanRows: true } }),
      data: [
        { id: 'r0', region: 'North', team: 'Alpha', amount: 1 },
        { id: 'r1', region: 'South', team: 'Bravo', amount: 2 },
        { id: 'r2', region: 'North', team: 'Alpha', amount: 3 },
      ],
    })
    const index = table_getCellSpanIndex(table as any)

    expect(index.rowSpans['region']).toBeUndefined()
    expect(index.rowSpans['team']).toBeUndefined()
    expect(rowSpansOf(table, 'region')).toEqual([1, 1, 1])
  })

  it('never merges nullish values under the default comparison', () => {
    const table = makeTable({
      data: [
        { id: 'r0', region: null, team: 'Alpha', amount: 1 },
        { id: 'r1', region: null, team: 'Alpha', amount: 2 },
        { id: 'r2', region: 'North', team: 'Alpha', amount: undefined },
        { id: 'r3', region: 'North', team: 'Alpha', amount: undefined },
      ],
    })

    expect(rowSpansOf(table, 'region')).toEqual([1, 1, 2, 0])
  })

  it('merges nullish values when a predicate opts in', () => {
    const table = makeTable({
      columns: makeColumns({
        region: {
          spanRows: (context: { anchorValue: unknown; value: unknown }) =>
            context.anchorValue === context.value,
        },
      }),
      data: [
        { id: 'r0', region: null, team: 'Alpha', amount: 1 },
        { id: 'r1', region: null, team: 'Alpha', amount: 2 },
        { id: 'r2', region: 'North', team: 'Alpha', amount: 3 },
      ],
    })

    expect(rowSpansOf(table, 'region')).toEqual([2, 0, 1])
  })

  it('merges NaN values and keeps -0 and 0 distinct, following Object.is', () => {
    const table = makeTable({
      columns: [{ id: 'amount', accessorKey: 'amount', spanRows: true }],
      data: [
        { id: 'r0', region: 'x', team: 'x', amount: NaN },
        { id: 'r1', region: 'x', team: 'x', amount: NaN },
        { id: 'r2', region: 'x', team: 'x', amount: -0 as number },
        { id: 'r3', region: 'x', team: 'x', amount: 0 },
      ],
    })

    expect(rowSpansOf(table, 'amount')).toEqual([2, 0, 1, 1])
  })

  it('anchors predicate runs so every candidate compares against the run start', () => {
    const seen: Array<{ anchor: string; previous: string; row: string }> = []
    const table = makeTable({
      columns: makeColumns({
        region: {
          spanRows: (context: {
            anchorRow: { id: string }
            previousRow: { id: string }
            row: { id: string }
            anchorValue: unknown
            value: unknown
          }) => {
            seen.push({
              anchor: context.anchorRow.id,
              previous: context.previousRow.id,
              row: context.row.id,
            })
            return context.anchorValue === context.value
          },
        },
      }),
      data: [
        { id: 'r0', region: 'North', team: 'a', amount: 1 },
        { id: 'r1', region: 'North', team: 'a', amount: 2 },
        { id: 'r2', region: 'North', team: 'a', amount: 3 },
      ],
    })

    expect(rowSpansOf(table, 'region')).toEqual([3, 0, 0])
    // Both later rows were tested against the run anchor, not chained.
    expect(seen).toEqual([
      { anchor: 'r0', previous: 'r0', row: 'r1' },
      { anchor: 'r0', previous: 'r1', row: 'r2' },
    ])
  })

  it('spans no cells when disabled at the table or column level', () => {
    const disabledTable = makeTable({ enableCellSpanning: false })
    expect(rowSpansOf(disabledTable, 'region')).toEqual([1, 1, 1, 1, 1])

    const disabledColumn = makeTable({
      columns: makeColumns({ region: { enableCellSpanning: false } }),
    })
    expect(rowSpansOf(disabledColumn, 'region')).toEqual([1, 1, 1, 1, 1])
  })

  it('resolves column spans with covered cells reporting zero', () => {
    const table = makeTable({
      columns: makeColumns({
        region: {
          spanRows: undefined,
          spanColumns: (context: { row: { original: TestRow } }) =>
            context.row.original.isSummary ? 3 : 1,
        },
      }),
      data: [
        { id: 'r0', region: 'North', team: 'Alpha', amount: 1 },
        { id: 'r1', region: 'Total', team: '', amount: 6, isSummary: true },
      ],
    })
    const summaryCells = table
      .getRowModel()
      .rowsById['r1']!.getAllCellsByColumnId()

    expect(cell_getColSpan(summaryCells['region']!)).toBe(3)
    expect(cell_getColSpan(summaryCells['team']!)).toBe(0)
    expect(cell_getColSpan(summaryCells['amount']!)).toBe(0)
    expect(cell_getIsCovered(summaryCells['team']!)).toBe(true)

    const normalCells = table
      .getRowModel()
      .rowsById['r0']!.getAllCellsByColumnId()
    expect(cell_getColSpan(normalCells['region']!)).toBe(1)
  })

  it('clamps Infinity column spans to the remaining columns', () => {
    const table = makeTable({
      columns: makeColumns({
        team: { spanColumns: Infinity },
      }),
    })
    const cells = table.getRowModel().rowsById['r0']!.getAllCellsByColumnId()

    expect(cell_getColSpan(cells['team']!)).toBe(2)
    expect(cell_getColSpan(cells['amount']!)).toBe(0)
    expect(cell_getColSpan(cells['region']!)).toBe(1)
  })

  it('ends a vertical run at a horizontally spanning row', () => {
    const table = makeTable({
      columns: makeColumns({
        region: {
          spanRows: true,
          spanColumns: (context: { row: { original: TestRow } }) =>
            context.row.original.isSummary ? Infinity : 1,
        },
      }),
      data: [
        { id: 'r0', region: 'North', team: 'a', amount: 1 },
        { id: 'r1', region: 'North', team: 'a', amount: 2 },
        { id: 'r2', region: 'North', team: '', amount: 3, isSummary: true },
        { id: 'r3', region: 'North', team: 'b', amount: 4 },
      ],
    })

    // The full-width summary row has a different column span than the data
    // rows, so it neither joins the run above it nor lets the run continue
    // through to the row below.
    expect(rowSpansOf(table, 'region')).toEqual([2, 0, 1, 1])
  })

  it('covers the full rectangle when a cell spans rows and columns', () => {
    const table = makeTable({
      columns: makeColumns({
        region: { spanRows: true, spanColumns: 2 },
      }),
      data: [
        { id: 'r0', region: 'North', team: 'a', amount: 1 },
        { id: 'r1', region: 'North', team: 'b', amount: 2 },
      ],
    })
    const anchor = table.getRowModel().rowsById['r0']!.getAllCellsByColumnId()
    const below = table.getRowModel().rowsById['r1']!.getAllCellsByColumnId()

    // Both rows' region cells span 2 columns, so they share a width and merge
    // vertically into a 2x2 rectangle anchored at the top-left.
    expect(cell_getRowSpan(anchor['region']!)).toBe(2)
    expect(cell_getColSpan(anchor['region']!)).toBe(2)
    expect(cell_getColSpan(anchor['team']!)).toBe(0)
    expect(cell_getRowSpan(below['region']!)).toBe(0)
    expect(cell_getColSpan(below['team']!)).toBe(0)

    const covered = [anchor['team']!, below['region']!, below['team']!]
    for (const cell of covered) {
      expect(cell_getIsCovered(cell)).toBe(true)
    }
    expect(cell_getIsCovered(anchor['region']!)).toBe(false)
  })

  it('handles empty and single-row tables without storing spans', () => {
    const emptyIndex = table_getCellSpanIndex(makeTable({ data: [] }) as any)
    expect(emptyIndex.rows).toEqual([])
    expect(Object.keys(emptyIndex.rowSpans)).toEqual([])

    const single = makeTable({ data: [defaultData[0]!] })
    expect(rowSpansOf(single, 'region')).toEqual([1])
    expect(Object.keys(table_getCellSpanIndex(single as any).rowSpans)).toEqual(
      [],
    )
  })
})

describe('statics without the feature registered', () => {
  it('reports spans of one and builds an index from the row model', () => {
    const table = constructTable<typeof coreOnlyFeatures, TestRow>({
      features: coreOnlyFeatures,
      data: defaultData,
      columns: [
        { id: 'region', accessorKey: 'region', spanRows: true },
        { id: 'team', accessorKey: 'team' },
      ] as Array<ColumnDef<typeof coreOnlyFeatures, TestRow>>,
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    // The static path still works: it derives the index on the fly.
    const cell = table.getRowModel().rows[0]!.getAllCells()[0]!
    expect(cell_getRowSpan(cell as any)).toBe(3)
    expect(column_getCanSpan(table.getColumn('team')! as any)).toBe(true)
  })
})
