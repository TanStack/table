---
'@tanstack/table-core': patch
---

Ignore nested sub-rows that have no selectable descendants in `row.getIsAllSubRowsSelected()` and `row.getIsSomeSelected()`. A parent whose selectable descendants were all selected reported `getIsSomeSelected() === true` and `getIsAllSubRowsSelected() === false` when one of its sub-rows had only unselectable children.
