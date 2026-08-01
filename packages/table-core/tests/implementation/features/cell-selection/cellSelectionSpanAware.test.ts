import { describe, expect, it } from 'vitest'
import {
  cellSelectionFeature,
  cellSpanningFeature,
  columnVisibilityFeature,
  constructTable,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef, Table } from '../../../../src'

const features = testFeatures({
  cellSelectionFeature,
  cellSpanningFeature,
  columnVisibilityFeature,
})

interface TestRow {
  id: string
  region: string
  team: string
  amount: number
  isSummary?: boolean
}

/** Three regions of three rows, region-major so runs exist naturally. */
function makeData(): Array<TestRow> {
  const rows: Array<TestRow> = []
  for (const region of ['North', 'South', 'East']) {
    for (let t = 0; t < 3; t++) {
      rows.push({
        id: `${region}-${t}`,
        region,
        team: `Team ${t}`,
        amount: rows.length,
      })
    }
  }
  return rows
}

const columns: Array<ColumnDef<typeof features, TestRow>> = [
  { id: 'region', accessorKey: 'region', spanRows: true },
  { id: 'team', accessorKey: 'team' },
  { id: 'amount', accessorKey: 'amount' },
]

function makeTable(
  overrides: Record<string, unknown> = {},
): Table<typeof features, TestRow> {
  return constructTable<typeof features, TestRow>({
    features,
    data: makeData(),
    columns,
    getRowId: (row) => row.id,
    renderFallbackValue: '',
    ...overrides,
  })
}

function getCell(
  table: Table<typeof features, TestRow>,
  rowId: string,
  columnId: string,
) {
  return table.getRowModel().rowsById[rowId]!.getAllCellsByColumnId()[columnId]!
}

describe('selection expands to enclose merged cells', () => {
  it('expands a range that clips a merge to the full merge', () => {
    const table = makeTable()

    // Drag from team row 1 into the region column of row 1: the region merge
    // spans rows 0-2, so the selection expands to cover them.
    table.setCellSelection([
      {
        anchorRowId: 'North-1',
        anchorColumnId: 'team',
        focusRowId: 'North-1',
        focusColumnId: 'region',
      },
    ])

    expect(table.getCellSelectionBounds()).toEqual([
      {
        minRowIndex: 0,
        maxRowIndex: 2,
        minColumnIndex: 0,
        maxColumnIndex: 1,
      },
    ])

    // Every cell of the expanded rectangle reports selected, including the
    // covered lattice cells of the merge.
    expect(getCell(table, 'North-0', 'region').getIsSelected()).toBe(true)
    expect(getCell(table, 'North-2', 'team').getIsSelected()).toBe(true)
    expect(getCell(table, 'North-0', 'amount').getIsSelected()).toBe(false)
  })

  it('does not expand a range that avoids every merge', () => {
    const table = makeTable()

    table.setCellSelection([
      {
        anchorRowId: 'North-0',
        anchorColumnId: 'team',
        focusRowId: 'North-1',
        focusColumnId: 'amount',
      },
    ])

    expect(table.getCellSelectionBounds()).toEqual([
      {
        minRowIndex: 0,
        maxRowIndex: 1,
        minColumnIndex: 1,
        maxColumnIndex: 2,
      },
    ])
  })

  it('expands exclude operations so a merge is never partially selected', () => {
    const table = makeTable()

    table.setCellSelection([
      {
        anchorRowId: 'North-0',
        anchorColumnId: 'region',
        focusRowId: 'South-2',
        focusColumnId: 'amount',
      },
      {
        // Subtract one row of the North merge; the exclusion expands to the
        // whole merge, and with it the full width of the excluded rows.
        anchorRowId: 'North-1',
        anchorColumnId: 'region',
        focusRowId: 'North-1',
        focusColumnId: 'region',
        operation: 'exclude',
      },
    ])

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const cell = getCell(table, `North-${rowIndex}`, 'region')
      expect([rowIndex, cell.getIsSelected()]).toEqual([rowIndex, false])
    }
    // Cells outside the merge's columns in the excluded rows stay selected.
    expect(getCell(table, 'North-1', 'team').getIsSelected()).toBe(true)
    expect(getCell(table, 'South-0', 'region').getIsSelected()).toBe(true)
  })

  it('keeps stored corners stable while spanning is toggled', () => {
    const table = makeTable({ enableCellSpanning: false })

    table.setCellSelection([
      {
        anchorRowId: 'North-1',
        anchorColumnId: 'region',
        focusRowId: 'North-1',
        focusColumnId: 'team',
      },
    ])

    // Spanning off: the raw one-row rectangle.
    expect(table.getCellSelectionBounds()).toEqual([
      { minRowIndex: 1, maxRowIndex: 1, minColumnIndex: 0, maxColumnIndex: 1 },
    ])

    table.setOptions((options) => ({ ...options, enableCellSpanning: true }))

    // Same stored state, expanded bounds.
    expect(table.getCellSelectionBounds()).toEqual([
      { minRowIndex: 0, maxRowIndex: 2, minColumnIndex: 0, maxColumnIndex: 1 },
    ])
  })
})

describe('selection edges around merged cells', () => {
  it('draws the outline at the merge rectangle boundary', () => {
    const table = makeTable()

    table.setCellSelection([
      {
        anchorRowId: 'North-0',
        anchorColumnId: 'region',
        focusRowId: 'North-2',
        focusColumnId: 'region',
      },
    ])

    const anchor = getCell(table, 'North-0', 'region')
    expect(anchor.getSelectionEdges()).toEqual({
      top: true,
      right: true,
      bottom: true,
      left: true,
    })
  })

  it('opens the merge edge that faces adjacent selected cells', () => {
    const table = makeTable()

    table.setCellSelection([
      {
        anchorRowId: 'North-0',
        anchorColumnId: 'region',
        focusRowId: 'North-2',
        focusColumnId: 'team',
      },
    ])

    const anchor = getCell(table, 'North-0', 'region')
    // The team column beside the merge is selected for all three rows, so the
    // merge's right side is interior, not an edge.
    expect(anchor.getSelectionEdges()).toEqual({
      top: true,
      right: false,
      bottom: true,
      left: true,
    })

    const team = getCell(table, 'North-1', 'team')
    expect(team.getSelectionEdges()).toEqual({
      top: false,
      right: true,
      bottom: false,
      left: false,
    })
  })

  it('marks a side as an edge when any strip cell is outside', () => {
    const table = makeTable()

    // Select the merge plus only ONE of the three team cells beside it. The
    // merge's right strip is then partially outside, so the border draws.
    table.setCellSelection([
      {
        anchorRowId: 'North-0',
        anchorColumnId: 'region',
        focusRowId: 'North-2',
        focusColumnId: 'region',
      },
      {
        anchorRowId: 'North-1',
        anchorColumnId: 'team',
        focusRowId: 'North-1',
        focusColumnId: 'team',
      },
    ])

    const anchor = getCell(table, 'North-0', 'region')
    expect(anchor.getSelectionEdges().right).toBe(true)
  })
})

describe('navigation treats a merge as one stop', () => {
  it('crosses a merge with a single vertical step', () => {
    const table = makeTable()

    table.setFocusedCell('North-0', 'region')
    table.moveCellSelection('down')

    // Down from the North merge anchor exits past the merge into South, whose
    // own merge snaps focus to its anchor.
    const focused = table.getFocusedCell()!
    expect([focused.row.id, focused.column.id]).toEqual(['South-0', 'region'])
  })

  it('snaps an entering step to the merge anchor', () => {
    const table = makeTable()

    // From the team column of row 1, stepping left lands inside the North
    // merge and snaps to its anchor row.
    table.setFocusedCell('North-1', 'team')
    table.moveCellSelection('left')

    const focused = table.getFocusedCell()!
    expect([focused.row.id, focused.column.id]).toEqual(['North-0', 'region'])
  })

  it('extends a selection past a merge in one step', () => {
    const table = makeTable()

    table.setFocusedCell('East-2', 'region')
    table.extendCellSelection('up')

    // East's merge anchors at East-0; extending up from inside it reaches the
    // row above the merge, and expansion pulls the whole South merge in.
    const bounds = table.getCellSelectionBounds()
    expect(bounds).toEqual([
      { minRowIndex: 3, maxRowIndex: 8, minColumnIndex: 0, maxColumnIndex: 0 },
    ])
  })
})

describe('derived reads dedupe covered cells', () => {
  it('counts a merge once and skips covered ids', () => {
    const table = makeTable()

    table.setCellSelection([
      {
        anchorRowId: 'North-0',
        anchorColumnId: 'region',
        focusRowId: 'North-2',
        focusColumnId: 'team',
      },
    ])

    // The expanded region is 3 rows x 2 columns = 6 lattice cells, but the
    // merge renders once: 1 merge + 3 team cells.
    expect(table.getSelectedCellCount()).toBe(4)

    const ids = table.getSelectedCellIds()
    expect(ids).toHaveLength(4)
    expect(ids).toContain('North-0_region')
    expect(ids).not.toContain('North-1_region')
  })

  it('keeps ranges data as the full lattice grid', () => {
    const table = makeTable()

    table.setCellSelection([
      {
        anchorRowId: 'North-0',
        anchorColumnId: 'region',
        focusRowId: 'North-2',
        focusColumnId: 'team',
      },
    ])

    const [grid] = table.getSelectedCellRangesData()
    // Covered cells keep their underlying values so the grid stays row-major
    // and rectangular.
    expect(grid).toEqual([
      ['North', 'Team 0'],
      ['North', 'Team 1'],
      ['North', 'Team 2'],
    ])
  })
})

describe('spanning absent or disabled leaves selection untouched', () => {
  it('behaves lattice-wise when enableCellSpanning is false', () => {
    const table = makeTable({ enableCellSpanning: false })

    table.setCellSelection([
      {
        anchorRowId: 'North-1',
        anchorColumnId: 'region',
        focusRowId: 'North-1',
        focusColumnId: 'team',
      },
    ])

    expect(table.getCellSelectionBounds()).toEqual([
      { minRowIndex: 1, maxRowIndex: 1, minColumnIndex: 0, maxColumnIndex: 1 },
    ])
    expect(table.getSelectedCellCount()).toBe(2)
  })

  it('reports no merge bounds without the spanning feature', () => {
    const bare = testFeatures({
      cellSelectionFeature,
      columnVisibilityFeature,
    })
    const table = constructTable<typeof bare, TestRow>({
      features: bare,
      data: makeData(),
      columns: columns as unknown as Array<ColumnDef<typeof bare, TestRow>>,
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    expect(table.getCellSelectionMergeBounds()).toEqual([])

    table.setCellSelection([
      {
        anchorRowId: 'North-1',
        anchorColumnId: 'region',
        focusRowId: 'North-1',
        focusColumnId: 'team',
      },
    ])

    expect(table.getCellSelectionBounds()).toEqual([
      { minRowIndex: 1, maxRowIndex: 1, minColumnIndex: 0, maxColumnIndex: 1 },
    ])
  })
})

describe('column spans map into merge bounds', () => {
  it('emits a horizontal-only span as a one-row merge and expands to it', () => {
    // `team` has no `spanRows`, so this merge only exists in the colSpans half
    // of the span index and must survive the horizontal-only pass.
    const table = makeTable({
      columns: [
        { id: 'region', accessorKey: 'region', spanRows: true },
        {
          id: 'team',
          accessorKey: 'team',
          spanColumns: ({ row }: { row: { original: TestRow } }) =>
            row.original.id === 'South-1' ? 2 : 1,
        },
        { id: 'amount', accessorKey: 'amount' },
      ] as Array<ColumnDef<typeof features, TestRow>>,
    })

    expect(table.getCellSelectionMergeBounds()).toEqual([
      { minRowIndex: 0, maxRowIndex: 2, minColumnIndex: 0, maxColumnIndex: 0 },
      { minRowIndex: 3, maxRowIndex: 5, minColumnIndex: 0, maxColumnIndex: 0 },
      { minRowIndex: 6, maxRowIndex: 8, minColumnIndex: 0, maxColumnIndex: 0 },
      { minRowIndex: 4, maxRowIndex: 4, minColumnIndex: 1, maxColumnIndex: 2 },
    ])

    // Selecting the covered half of the merge expands to its full width and
    // counts the merge once.
    table.setCellSelection([
      {
        anchorRowId: 'South-1',
        anchorColumnId: 'amount',
        focusRowId: 'South-1',
        focusColumnId: 'amount',
      },
    ])

    expect(table.getCellSelectionBounds()).toEqual([
      { minRowIndex: 4, maxRowIndex: 4, minColumnIndex: 1, maxColumnIndex: 2 },
    ])
    expect(table.getSelectedCellCount()).toBe(1)
  })

  it('emits a row-and-column rectangle as one merge, not one per row', () => {
    // North rows carry both a vertical run and a colSpan of 2, forming a 3x2
    // rectangle. Its vertically covered rows keep their colSpan in the index,
    // so the horizontal-only pass must skip them: emitting them too would
    // stack duplicate one-row merges inside the rectangle.
    const table = makeTable({
      columns: [
        {
          id: 'region',
          accessorKey: 'region',
          spanRows: true,
          spanColumns: ({ row }: { row: { original: TestRow } }) =>
            row.original.region === 'North' ? 2 : 1,
        },
        { id: 'team', accessorKey: 'team' },
        { id: 'amount', accessorKey: 'amount' },
      ] as Array<ColumnDef<typeof features, TestRow>>,
    })

    expect(table.getCellSelectionMergeBounds()).toEqual([
      { minRowIndex: 0, maxRowIndex: 2, minColumnIndex: 0, maxColumnIndex: 1 },
      { minRowIndex: 3, maxRowIndex: 5, minColumnIndex: 0, maxColumnIndex: 0 },
      { minRowIndex: 6, maxRowIndex: 8, minColumnIndex: 0, maxColumnIndex: 0 },
    ])

    // A single covered lattice cell drags in the whole rectangle.
    table.setCellSelection([
      {
        anchorRowId: 'North-1',
        anchorColumnId: 'team',
        focusRowId: 'North-1',
        focusColumnId: 'team',
      },
    ])

    expect(table.getCellSelectionBounds()).toEqual([
      { minRowIndex: 0, maxRowIndex: 2, minColumnIndex: 0, maxColumnIndex: 1 },
    ])
    expect(table.getSelectedCellCount()).toBe(1)
    expect(getCell(table, 'North-2', 'team').getIsSelected()).toBe(true)
  })
})
