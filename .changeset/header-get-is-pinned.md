---
'@tanstack/table-core': minor
---

Add `header.getIsPinned()`, which reads the pinned region of a header's own leaf columns. A group column split across pinned regions renders one header per region, and `header.column.getIsPinned()` reported the same region for all of them (#4906).
