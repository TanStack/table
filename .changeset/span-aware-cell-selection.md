---
'@tanstack/table-core': minor
---

Make `cellSelectionFeature` aware of merged cells from `cellSpanningFeature`.

When both features are registered, selection rectangles expand at bounds-derivation time to fully enclose every merged cell they touch, and the expansion runs to a fixed point across chained merges. Exclude operations expand the same way, so a merged cell is always entirely selected or entirely unselected. Stored selection corners never change: sorting, paging, or toggling `enableCellSpanning` re-derives the same state against the current merges.

- Arrow-key navigation (`moveCellSelection` / `extendCellSelection`) treats a merge as one stop: entering a merge focuses its anchor, and the next step exits past the merge's full extent.
- `cell.getSelectionEdges()` draws the outline at the merge rectangle's boundary, probing the full adjacent strip on each side.
- `table.getSelectedCellCount()` counts a merge once, and `table.getSelectedCellIds()` returns only the cells that render. `table.getSelectedCellRangesData()` still returns the full row-major lattice grid, since covered cells carry real underlying values.
- New `table.getCellSelectionMergeBounds()` exposes the merged-cell rectangles in selection's display-order index space.

Cell selection does not import from the cell spanning module: it probes the API the spanning feature installs on the table, so tree-shaking is unaffected and behavior without `cellSpanningFeature` is unchanged.
