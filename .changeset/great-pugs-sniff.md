---
'@tanstack/table-core': patch
---

Fix `getSortedRowModel().flatRows` listing sub-rows before their parent. This restores the parent-first order used by the v8 sorted model and aligns the flattened result with the sorted `rows` tree, core row model, and paginated row model.
