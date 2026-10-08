---
'@tanstack/table-core': patch
'@tanstack/table-devtools': patch
---

Improve tree-shaking. Importing one built-in `filterFn_*`, `sortFn_*`, or `aggregationFn_*` now bundles only that function instead of its whole module. The core row model, header building, and the filtered, sorted, and grouped row models no longer import code from features a table doesn't register, so a minimal table is about 0.6 kB (brotli) smaller and grouping without `rowAggregationFeature` no longer bundles the aggregation executor. Add `table.autoResetSorting()`, and fix the `Table_RowPagination` type to declare the `autoResetPageIndex` method the table actually has (it was typed as `_autoResetPageIndex`).

The devtools Features panel now shows measured minified + brotli sizes for every feature, row model, and built-in function, and its total accounts for code that features share.
