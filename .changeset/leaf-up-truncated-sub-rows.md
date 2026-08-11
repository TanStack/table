---
'@tanstack/table-core': patch
---

Fix `filterFromLeafRows` discarding the sub-rows of rows kept past `maxLeafRowFilterDepth`. The leaf-up filter path rebuilt those rows without their unfiltered subtree, so the truncated descendants vanished from `subRows`, `flatRows` and `rowsById` alike. They are now carried over and flattened, the way the root-down path already keeps them.
