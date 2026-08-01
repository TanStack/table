---
title: Cell Spanning (Solid) Guide
---

## Examples

Want to skip to the implementation? Check out these Solid examples:

- [Cell Spanning](../examples/cell-spanning)

### Cell Spanning Setup

Here's how you set up your table to use cell spanning features. Adding the cell spanning feature enables the related APIs.

```ts
import {
  createTable,
  tableFeatures,
  cellSpanningFeature,
} from '@tanstack/solid-table'

const features = tableFeatures({ cellSpanningFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

## Cell Spanning (Solid) Guide

The cell spanning feature merges adjacent body cells into one rendered cell, the way `rowspan` and `colspan` merge cells in a plain HTML table or a spreadsheet. Row spans are derived from the data: adjacent rows that share a value in an opted-in column merge into one vertically spanning cell. Column spans are declared per row for things like full-width summary rows.

The feature is stateless. Spans are always recomputed from the rows that are actually rendered, so sorting, filtering, pagination, and row pinning simply change which rows are adjacent and the spans follow. There is nothing to persist and nothing to reset.

### Enable Row Spanning per Column

Opt a column into value-based row spanning with `spanRows` on its column def:

```ts
const columns = [
  columnHelper.accessor('region', {
    spanRows: true, // adjacent rows with equal region values merge
  }),
]
```

`spanRows: true` merges adjacent rows whose values are the same value, compared with `Object.is`. Nullish values never merge under the default comparison, since a merged block of blanks reads as a rendering bug and joins semantically unrelated rows.

Pass a predicate to control run boundaries yourself. The run is anchored: every candidate row is tested against the run's first row, which keeps runs transitive by construction.

```ts
columnHelper.accessor('createdAt', {
  spanRows: ({ anchorValue, value }) =>
    sameMonth(anchorValue as Date, value as Date),
})
```

### Rendering Spanned Cells

A covered cell reports a span of `0`, and the renderer skips it. This is the same convention as [`header.rowSpan`](../../../guide/headers#header-row-spanning). Keep the span reads inside JSX so they re-run when the row model changes.

```tsx
<For each={row.getVisibleCells()}>
  {(cell) => (
    // A covered cell reports a span of 0 on at least one axis. Skip it.
    // Do not render `rowSpan={0}`: in HTML that means "span to the end of
    // the row group", which merges the cell down the entire tbody.
    <Show when={!cell.getIsCovered()}>
      <td rowSpan={cell.getRowSpan()} colSpan={cell.getColSpan()}>
        <table.FlexRender cell={cell} />
      </td>
    </Show>
  )}
</For>
```

`cell.getIsCovered()` is a convenience for checking that `cell.getRowSpan()` and `cell.getColSpan()` are both non-zero, so read the span numbers directly when you need them separately.

### Column Spanning and Summary Rows

Declare horizontal spans with `spanColumns` on the column that should carry the merged content. The count is resolved per row and measured in the order columns actually render, so hidden columns are not counted and column reordering is handled for you.

```ts
columnHelper.accessor('label', {
  spanColumns: ({ row }) => (row.original.isSummary ? Infinity : 1),
})
```

Values larger than the available room are clamped to the end of the cell's pinned region, so `Infinity` means "the rest of my region". A column span can never cross the boundary between start-pinned, center, and end-pinned columns.

When a cell spans rows and columns at once, the merged block is a rectangle: the anchor cell reports both spans and every other cell in the rectangle reports `0` on at least one axis. Cells only join a vertical run when their column spans match, so a full-width summary row never merges into the data run above it.

### Spanning and Sorting, Filtering, and Pagination

Spans are derived from the final row model, never stored, so every row model change recomputes them:

- Sorting changes adjacency. Sorting by the spanned column clusters equal values and produces the largest runs; sorting by an unrelated column usually shatters them.
- Filtering removes rows. When a filter removes the middle of a run, the remaining neighbors become adjacent and merge.
- Pagination clips runs. A run never crosses a page boundary; the next page opens a fresh cell even when the value continues.
- Pinned rows render in separate sections, so a run never crosses a pinned section boundary either.

### Disable Cell Spanning

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  enableCellSpanning: false, // document-wide kill switch
})

columnHelper.accessor('status', {
  enableCellSpanning: false, // per-column opt out
})
```

### Selecting Merged Cells

`cellSelectionFeature` composes with cell spanning. When both features are registered, a selection rectangle expands to fully enclose every merged cell it touches, so a merge is always entirely selected or entirely unselected. This applies to subtractions too: excluding any part of a merge deselects the whole merge. Arrow-key navigation treats a merge as a single stop, `getSelectedCellCount()` counts a merge once, and `getSelectedCellIds()` returns only the cells that render. `getSelectedCellRangesData()` still returns the full row-major lattice grid, since covered cells carry real underlying values.

The expansion happens when the selection bounds are derived, not when the selection is stored. Stored corners stay stable while sorting, paging, or toggling `enableCellSpanning` changes which cells merge; the derived selection follows the current spans.

### Known Limitations

- Row virtualization needs extra care: if a run's anchor row is scrolled out of the rendered window, the covered rows render nothing. Read `table.getCellSpanIndex()` to find the anchor and render a clamped span at the top of the window.
- Grouped columns ignore `spanRows`, since grouping already collapses repeated values into group rows, and grouped rows never join a run in any column.
- Footer groups and `<tfoot>` rendering are unaffected by cell spanning.
