---
'@tanstack/table-devtools': patch
'@tanstack/react-table-devtools': patch
'@tanstack/preact-table-devtools': patch
'@tanstack/solid-table-devtools': patch
'@tanstack/vue-table-devtools': patch
'@tanstack/angular-table-devtools': patch
---

Prevent table state updates from remounting the devtools panel, subscribe only
while the panel is open, cache generated styles by theme, and keep adapter
registration and production entrypoints reactive and stable.
