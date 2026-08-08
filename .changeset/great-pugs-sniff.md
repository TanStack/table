---
'@tanstack/table-core': patch
---

Fix `getSortedRowModel().flatRows` listing sub-rows before their parent. Every other row model flattens a parent ahead of its own sub-rows, and the sorted model now matches.
