---
'@tanstack/table-core': patch
---

Fix `getGroupedRowModel().flatRows` listing every group row after its own descendants. Group rows now come first at every depth, which aligns the flattened result with the grouped `rows` tree and with the core, paginated and sorted row models.
