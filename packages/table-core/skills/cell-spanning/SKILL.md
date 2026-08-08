---
name: cell-spanning
description: >
  Merge adjacent body cells with cellSpanningFeature: value-based rowSpan opt-in per column via spanRows, per-row colSpan via spanColumns, and the covered-cell convention where a span of 0 means skip the cell. Load for merged data grids, spans that disappear after sorting or paginating, ragged table rows, or a cell that unexpectedly merges down the whole tbody.
metadata:
  { type: sub-skill, library: '@tanstack/table-core', library_version: '9.1.1' }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/framework/react/guide/cell-spanning.md'
  - 'TanStack/table:packages/table-core/src/features/cell-spanning'
  - 'TanStack/table:examples/react/cell-spanning'
---

This skill builds on `core` and `table-features`. Cell spanning is stateless and fully derived: a memoized table-level span index is rebuilt from the rows that are actually rendered, and per-cell reads are O(1) lookups against it. Sorting, filtering, pagination, and row pinning only change adjacency; spans follow automatically and never persist.

## Setup

<!-- skill-snippet:check -->

```ts
import { cellSpanningFeature, tableFeatures } from '@tanstack/table-core'

export const features = tableFeatures({ cellSpanningFeature })
```

## Core Patterns

### Opt columns into value-based row spanning

```ts
const columns = [
  { accessorKey: 'region', spanRows: true },
  {
    accessorKey: 'createdAt',
    spanRows: ({
      anchorValue,
      value,
    }: {
      anchorValue: unknown
      value: unknown
    }) => sameMonth(anchorValue as Date, value as Date),
  },
]
```

`spanRows: true` merges adjacent rendered rows whose values match under `Object.is`. Nullish values never merge under the default comparison; a predicate can opt in. Predicates are anchored: every candidate row is tested against the run's first row (`anchorRow`/`anchorValue`), which keeps runs transitive.

### Declare column spans per row

```ts
const columns = [
  {
    accessorKey: 'label',
    spanColumns: ({ row }: { row: { original: { isSummary?: boolean } } }) =>
      row.original.isSummary ? Infinity : 1,
  },
]
```

`spanColumns` counts visible columns in render order and clamps to the end of the cell's pinned region, so `Infinity` means "the rest of my region" and a span never crosses a start/center/end pinning boundary. Cells only join a vertical run when their column spans match, so a full-width summary row never merges into the data run above it.

### Render with the skip-covered-cells loop

```tsx
{
  row.getVisibleCells().map((cell) => {
    const rowSpan = cell.getRowSpan()
    const colSpan = cell.getColSpan()
    if (rowSpan === 0 || colSpan === 0) return null
    return (
      <td key={cell.id} rowSpan={rowSpan} colSpan={colSpan}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    )
  })
}
```

A span of `0` means the cell is covered; `cell.getIsCovered()` is the same check as one call. This mirrors the `header.rowSpan` convention for uneven header trees.

### Disable

`enableCellSpanning: false` as a table option disables everything; the same flag on a column def opts a single column out and wins over the table option.

## Common Mistakes

### [CRITICAL] Rendering rowSpan={0} instead of skipping the cell

Wrong:

```tsx
<td rowSpan={cell.getRowSpan()} colSpan={cell.getColSpan()}>
```

Correct:

```tsx
cell.getIsCovered() ? null : (
  <td rowSpan={cell.getRowSpan()} colSpan={cell.getColSpan()}>
)
```

In HTML, `rowspan="0"` is valid and means "span to the end of the row group", so the wrong version does not render an empty cell. It merges the covered cell down the entire tbody and shifts every later cell out of its column.

### [HIGH] Expecting spanning to sort or group the rows

Wrong:

```ts
const features = tableFeatures({ cellSpanningFeature })
// data arrives unsorted; the table renders zero merged cells
```

Correct:

```ts
const features = tableFeatures({
  cellSpanningFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
// sort by the spanned column, or emit data with equal values adjacent
```

Value-based spanning merges adjacent equal values only. It does not reorder rows, and it is not grouping; register `columnGroupingFeature` when collapsible group rows are what is wanted.

### [HIGH] Precomputing spans from the source data

Wrong:

```ts
const spans = useMemo(() => computeSpans(data), [data])
```

Correct:

```ts
const rowSpan = cell.getRowSpan()
```

Spans derive from the final row model. A span precomputed from `data` survives sorting, filtering, and page changes, producing ragged rows the moment any of them changes.

### [MEDIUM] Assuming a run continues across a page boundary

A run is clipped by the paginated row model. The next page opens a fresh cell for the continuing value; nothing carries over, and nothing needs to.

### [MEDIUM] Reimplementing merge-aware selection on top of cellSelectionFeature

When both features are registered, selection is already merge-aware: ranges expand at derivation time to fully enclose any merge they touch (includes and excludes alike), navigation crosses a merge in one step, and `getSelectedCellCount()` counts a merge once. Do not pre-expand stored selection corners yourself; stored corners stay stable while sorting or paging changes the merges, and pre-expanded corners go stale.

### [MEDIUM] Spanning a grouped column

`spanRows` is ignored while its column is grouped, and grouped rows never join runs in any column. Grouping already collapses repeated values into group rows; spanning them again would merge twice.

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/cell-spanning/` for the full API: `cell.getRowSpan()`, `cell.getColSpan()`, `cell.getIsCovered()`, `table.getCellSpanIndex()`, and the `spanRows`/`spanColumns`/`enableCellSpanning` column and table options.
