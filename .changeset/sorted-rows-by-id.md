---
'@tanstack/table-core': patch
---

Point the sorted row model's `rowsById` at the cloned branch rows whose `subRows` were re-ordered by sorting. Previously `rowsById` was reused from the pre-sorted row model, so `table.getRow(id)` returned the original parent with unsorted `subRows` instead of the row rendered in `getRowModel().rows`.
