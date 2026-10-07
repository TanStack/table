---
'@tanstack/svelte-table': patch
---

fix(svelte-table): set the `AppTable`/`AppCell`/`AppHeader`/`AppFooter` contexts in their own components, so cells created later (e.g. when showing a column) no longer throw `set_context_after_init` in async mode
