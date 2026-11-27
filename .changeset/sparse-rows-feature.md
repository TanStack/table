---
'@tanstack/table-core': minor
---

Add the opt-in `sparseRowsFeature` for remote tables: `data` holds the loaded rows by their absolute index, `rowCount` is the total, missing rows become placeholder rows (`row.getIsPlaceholder()`), and `table.getMissingRowRanges()` returns the ranges to load. With `cellSelectionFeature`, the focused cell can be in a placeholder row, so keyboard navigation can move into rows that are not loaded.
