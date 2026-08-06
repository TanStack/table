---
'@tanstack/react-table': patch
---

Column defs built with `legacyCreateColumnHelper` now accept the built-in `filterFn`, `sortFn`, and `aggregationFn` names, matching the registries `useLegacyTable` registers at runtime.
