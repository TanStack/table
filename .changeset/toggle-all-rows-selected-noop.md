---
'@tanstack/table-core': patch
---

Stop `table.toggleAllRowsSelected()` from calling `onRowSelectionChange` when the requested state already matches the current one. Selecting when every selectable row is already selected, and deselecting when nothing is selected, are now no-ops, matching the O(1) guards `table.toggleAllRowsExpanded()` already has.
