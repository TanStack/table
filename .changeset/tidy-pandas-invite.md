---
'@tanstack/table-core': patch
---

fix: invalidate cached row values when a column's `accessorFn` changes. Rows are memoized on `data`, so replacing column definitions kept serving stale `getValue()` results. The cache now records the accessor identity and recomputes when it changes.
