---
'@tanstack/table-core': minor
---

Add an opt-in include/exclude row selection mode for tables that do not load every row: with `manualRowSelection: true`, `toggleAllRowsSelected(true)` sets the new `rowSelectionMode` state to `'exclude'` and clears `rowSelection`, which then holds the deselected row ids, and the new `table.getSelectedRowCount()` returns `rowCount` minus those ids.
