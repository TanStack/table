---
'@tanstack/table-core': patch
---

Fix `columnFiltersMeta` being dropped from every row of the filtered row model when `filterFromLeafRows` is enabled. The leaf-up filter path rebuilds each row with `constructRow` and copied only `columnFilters` onto the copy, leaving the meta as the empty map that `constructRow` initialises. Rank metadata recorded by a filter function's `addMeta` callback — the basis for rank-aware sorting in the fuzzy filtering guide — now survives on parent rows and sub-rows alike, and each row keeps the meta produced by its own filter run.
