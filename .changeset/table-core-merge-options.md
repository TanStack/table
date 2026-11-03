---
'@tanstack/table-core': patch
---

`table.setOptions(updater)` now applies the updater to the latest options inside the options store update, so back-to-back calls in one tick compose with adapters that batch writes. `constructTable` also merges the initial options through `mergeOptions` when one is provided, so adapter getters such as `get data()` stay live.

Event handler getters such as `column.getToggleSortingHandler()`, `row.getToggleSelectedHandler()`, `row.getToggleExpandedHandler()`, `column.getToggleGroupingHandler()`, `header.getResizeHandler()` and the cell selection handlers now check whether the action is allowed when the handler runs, not when it is created. A handler created before an `enable*` option changes no longer acts on the old value, and creating a handler no longer reads table state, so Solid doesn't warn about an untracked read.
