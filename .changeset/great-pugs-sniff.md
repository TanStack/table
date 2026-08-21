---
"@tanstack/table-core": patch
---

Fix `getFilteredRowModel().flatRows` listing sub-rows before their parent in both `filterFromLeafRows` and `filterFromRoot` modes. This restores the parent-first order used by the core, sorted, and paginated row models, and aligns the flattened result with the filtered `rows` tree.
