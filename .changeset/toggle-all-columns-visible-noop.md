---
'@tanstack/table-core': patch
---

Skip `onColumnVisibilityChange` when `table.toggleAllColumnsVisible()` is called with the visibility state every leaf column is already in. This matches the no-op guards `table.toggleAllRowsExpanded()` already has.
