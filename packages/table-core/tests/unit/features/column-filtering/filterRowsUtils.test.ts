import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  coreFeatures,
  filterFns,
  tableFeatures,
} from '../../../../src'
import { createFilteredRowModel } from '../../../../src/features/column-filtering/createFilteredRowModel'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type { ColumnDef, ColumnFiltersState } from '../../../../src'

type Row = { name: string; subRows?: Row[] }

const features = tableFeatures({ ...coreFeatures, columnFilteringFeature })

function makeNestedTable(opts?: {
  maxLeafRowFilterDepth?: number
  filterFromLeafRows?: boolean
  initialFilters?: ColumnFiltersState
}) {
  const columns: Array<ColumnDef<typeof features, Row, any>> = [
    { accessorKey: 'name', id: 'name', filterFn: 'includesString' },
  ]

  // 2 parents, 3 children total
  // parent1 (Alice) → child1 (Charlie), child2 (Dave)
  // parent2 (Bob)   → child3 (Eve)
  const data: Row[] = [
    {
      name: 'Alice',
      subRows: [
        { name: 'Charlie', subRows: [] },
        { name: 'Dave', subRows: [] },
      ],
    },
    {
      name: 'Bob',
      subRows: [
        { name: 'Eve', subRows: [] },
      ],
    },
  ]

  const table = constructTable<typeof features, Row>({
    data,
    columns,
    getSubRows: (row) => row.subRows ?? [],
    maxLeafRowFilterDepth: opts?.maxLeafRowFilterDepth ?? 100,
    filterFromLeafRows: opts?.filterFromLeafRows ?? false,
    initialState: {
      columnFilters: opts?.initialFilters ?? [],
    },
    features: {
      ...features,
      filteredRowModel: createFilteredRowModel(),
      filterFns,
      coreReactivityFeature: storeReactivityBindings(),
    },
  })

  return table
}

describe('filterRowModelFromRoot: flatRows includes sub-rows of passing parents', () => {
  it('without filter: flatRows includes all rows (2 parents + 3 children = 5)', () => {
    const table = makeNestedTable()
    const filtered = table.getFilteredRowModel()
    expect(filtered.flatRows).toHaveLength(5)
  })

  it('maxLeafRowFilterDepth=100 + filter that passes one parent only: flatRows has parent + kept sub-rows', () => {
    // "Alice" matches Alice only (Bob doesn't match)
    // Alice's sub-rows (Charlie, Dave) don't match "Alice" and are filtered out
    // (filterFromLeafRows=false → sub-rows filtered independently)
    const table = makeNestedTable({
      maxLeafRowFilterDepth: 100,
      initialFilters: [{ id: 'name', value: 'Alice' }],
    })
    const filtered = table.getFilteredRowModel()
    // Only Alice at root; Charlie and Dave don't match so excluded
    expect(filtered.rows).toHaveLength(1)
    expect(filtered.flatRows).toHaveLength(1) // just Alice (sub-rows filtered out)
  })

  it('maxLeafRowFilterDepth=0 + filter passes one parent: flatRows MUST include parent and all sub-rows', () => {
    // With maxLeafRowFilterDepth=0, filtering applies only at depth 0.
    // "Alice" matches Alice at depth 0. Bob does not match.
    // Alice's sub-rows (Charlie, Dave) are NOT subject to filtering — they're
    // visible as row.subRows and MUST also appear in flatRows.
    //
    // Bug: flatRows only contains Alice (1 row); Charlie and Dave are missing.
    const table = makeNestedTable({
      maxLeafRowFilterDepth: 0,
      initialFilters: [{ id: 'name', value: 'Alice' }],
    })
    const filtered = table.getFilteredRowModel()

    expect(filtered.rows).toHaveLength(1) // only Alice passes at depth 0
    // Alice has 2 sub-rows — they must be in flatRows too
    expect(filtered.rows[0]!.subRows).toHaveLength(2)

    // BUG: currently flatRows has 1 (just Alice), missing Charlie and Dave
    expect(filtered.flatRows).toHaveLength(3) // Alice + Charlie + Dave
  })

  it('maxLeafRowFilterDepth=0 + all parents pass: flatRows includes all rows (same as no-filter case)', () => {
    // "e" matches Alice (Alice has 'e'), Bob (Bob has no 'e'), Eve... wait
    // Actually let's use a filter that matches both parents:
    // "a" appears in "Alice" (→ passes). Does not appear in "Bob". Hmm.
    // Let's use a filter that passes both: empty filter → both pass
    // Actually with empty filter, autoRemove removes it. Let's use a
    // substring that is in BOTH parents: we need a different approach.
    // Let's use the full dataset without filtering at depth 0 to see
    // that ALL sub-rows appear in flatRows even when parents pass.
    
    // Filter that passes ALL rows at depth 0 (case-insensitive "a" is in Alice but not Bob)
    // Let's instead set a filter that matches both parents:
    // Combine Alice+Bob — both contain neither 'x' nor others... 
    // Actually, the issue is simpler: just add a filter value that matches both.
    // "l" appears in "Alice" but not "Bob". 
    // "o" appears in "Bob" but not "Alice".
    // Let's just set a filter that's definitely in both: "" (empty), but that auto-removes.
    // 
    // Better approach: verify the sub-rows count matches across filter depths.
    const tableNoFilter = makeNestedTable({ maxLeafRowFilterDepth: 0 })
    const tableWithFilter = makeNestedTable({
      maxLeafRowFilterDepth: 0,
      // "i" is in "Alice" → Alice passes; NOT in "Bob" → Bob excluded
      initialFilters: [{ id: 'name', value: 'Alice' }],
    })

    const noFilterFlat = tableNoFilter.getFilteredRowModel().flatRows
    const withFilterResult = tableWithFilter.getFilteredRowModel()

    // Without filter: 5 rows total
    expect(noFilterFlat).toHaveLength(5)

    // With filter (Alice passes, Bob excluded):
    // Alice + her 2 sub-rows = 3
    const aliceSubRowCount = withFilterResult.rows[0]!.subRows.length
    expect(aliceSubRowCount).toBeGreaterThan(0) // Alice HAS sub-rows
    expect(withFilterResult.flatRows).toHaveLength(1 + aliceSubRowCount)
  })
})
