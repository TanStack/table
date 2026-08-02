import { describe, expect, it } from 'vitest'
import { cellSpanningFeature, constructTable } from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src'

const features = testFeatures({
  cellSpanningFeature,
})

interface WideRow {
  id: string
  [key: string]: string | number
}

const ROW_COUNT = 10_000
const COLUMN_COUNT = 20
const DISTINCT_VALUES = 100

function makeWideData(): Array<WideRow> {
  return Array.from({ length: ROW_COUNT }, (_, rowIndex) => {
    const row: WideRow = { id: `r${rowIndex}` }
    for (let c = 0; c < COLUMN_COUNT; c++) {
      // Clustered values so the two spanning columns produce real runs.
      row[`col${c}`] =
        c < 2
          ? `value-${Math.floor((rowIndex / ROW_COUNT) * DISTINCT_VALUES)}`
          : rowIndex * COLUMN_COUNT + c
    }
    return row
  })
}

function makeWideColumns(): Array<ColumnDef<typeof features, WideRow>> {
  return Array.from({ length: COLUMN_COUNT }, (_, c) => ({
    id: `col${c}`,
    accessorKey: `col${c}`,
    ...(c < 2 ? { spanRows: true } : null),
  })) as Array<ColumnDef<typeof features, WideRow>>
}

describe('cell spanning performance', () => {
  it('builds the span index for 10k rows x 20 columns quickly and memoizes it', () => {
    const table = constructTable<typeof features, WideRow>({
      features,
      data: makeWideData(),
      columns: makeWideColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    const start = performance.now()
    const index = (table as any).getCellSpanIndex()
    const buildMs = performance.now() - start

    expect(Object.keys(index.rowSpans)).toEqual(['col0', 'col1'])
    // Generous CI bound; local builds run in ~2ms.
    expect(buildMs).toBeLessThan(500)

    // The second call is a memo hit returning the identical object.
    expect((table as any).getCellSpanIndex()).toBe(index)
  })

  it('keeps per-cell reads O(1): 200k getRowSpan calls stay fast', () => {
    const table = constructTable<typeof features, WideRow>({
      features,
      data: makeWideData(),
      columns: makeWideColumns(),
      getRowId: (row) => row.id,
      renderFallbackValue: '',
    })

    // Warm the index and the cell caches outside the timed section.
    ;(table as any).getCellSpanIndex()
    const rows = table.getRowModel().rows
    const cellLists = rows.map((row) => row.getAllCells())

    const start = performance.now()
    let total = 0
    for (const cells of cellLists) {
      for (const cell of cells) {
        total += (cell as any).getRowSpan()
      }
    }
    const readMs = performance.now() - start

    // Anchors carry their run lengths, so the grand total equals the number
    // of rendered (non-covered) slots... which for rowSpan-only equals the
    // full grid.
    expect(total).toBe(ROW_COUNT * COLUMN_COUNT)
    // Generous CI bound; local runs take ~15ms for 200k reads.
    expect(readMs).toBeLessThan(2_000)
  })
})
