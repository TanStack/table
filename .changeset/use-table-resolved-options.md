---
'@tanstack/react-table': patch
'@tanstack/preact-table': patch
'@tanstack/octane-table': patch
---

`table.options` on the table returned by `useTable` now includes feature defaults from `getDefaultTableOptions`, matching `row.table.options`. It used to be the raw options passed to the hook.
