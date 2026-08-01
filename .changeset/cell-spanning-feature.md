---
'@tanstack/table-core': minor
---

Add the `cellSpanningFeature`, an opt-in stock feature that merges adjacent body cells into row- and column-spanning cells.

Row spans are value-based and opt-in per column: `columnDef.spanRows: true` merges adjacent rendered rows whose values match under `Object.is` (nullish values never merge), and the predicate form `spanRows: (ctx) => boolean` controls run boundaries with an anchored comparison. Column spans are declared per row with `columnDef.spanColumns`, counted in render order and clamped to the cell's pinned region, so `Infinity` means "the rest of my region".

The feature is stateless. Spans always derive from the rows that are actually rendered, so sorting, filtering, pagination, expansion, and row pinning only change adjacency: runs never cross a page boundary, a pinned-section boundary, a change of position in the row tree, or a grouped row.

Cells expose `getRowSpan()`, `getColSpan()`, and `getIsCovered()`. A covered cell reports a span of `0` and must be skipped by the renderer, matching the `header.rowSpan` convention:

```jsx
{
  row.getVisibleCells().map((cell) => {
    const rowSpan = cell.getRowSpan()
    const colSpan = cell.getColSpan()
    // Never render a 0: in HTML, rowspan="0" means "span to the end of the row
    // group", which merges the cell down the entire tbody.
    if (rowSpan === 0 || colSpan === 0) return null
    return (
      <td key={cell.id} rowSpan={rowSpan} colSpan={colSpan}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    )
  })
}
```

Known limitation: `cellSelectionFeature` is not span-aware yet. Selection ranges address the underlying cell grid, so a selection crossing a merged cell selects the covered cells individually. Span-aware selection is planned as a follow-up.
