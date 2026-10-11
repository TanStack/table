---
'@tanstack/react-table': patch
'@tanstack/preact-table': patch
---

Refresh the `AppTable` context when the `useAppTable` owner renders with new options or state, so `useTableContext()` consumers no longer show stale rows after `data` is replaced under a cached (React Compiler, `useMemo`, `memo`) `AppTable` element.
