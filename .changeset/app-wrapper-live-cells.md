---
'@tanstack/svelte-table': patch
'@tanstack/vue-table': patch
---

Keep `AppCell`, `AppHeader`, and `AppFooter` in sync with their `cell`/`header` prop. When `data` or `columns` are replaced, a keyed `{#each}` or `v-for` reuses the wrapper with a new instance that has the same id. The wrapper kept the first instance, so the snippet/slot value and `useCellContext()`/`useHeaderContext()` showed stale values. The wrappers now read the current prop, and the context forwards to it.
