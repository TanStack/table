---
'@tanstack/table-core': patch
---

Clamp an out-of-range `pageIndex` to the last page when a data, filter, or grouping change shrinks the rows and `autoResetPageIndex` (or `autoResetAll`) is `false` with client-side pagination, instead of leaving the table on an empty page
