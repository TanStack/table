---
'@tanstack/table-core': patch
---

Clear row value caches when column definitions are replaced, so a column whose `accessorFn` changes no longer serves the value produced by the previous accessor.
