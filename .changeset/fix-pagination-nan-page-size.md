---
'@tanstack/table-core': patch
---

Fix pagination state corruption from invalid `pageSize`/`pageIndex` values: `setPageIndex`/`setPageSize` now fall back to the default state instead of storing `NaN` (e.g. from an emptied numeric input), and `getPageCount`/`getPageOptions` no longer throw when `pageSize` is `0` or negative (reachable via `initialState` or a directly-supplied `pagination` state).
