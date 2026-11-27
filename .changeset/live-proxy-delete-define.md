---
'@tanstack/svelte-table': patch
'@tanstack/vue-table': patch
---

Forward `delete` and `Object.defineProperty` on `useCellContext()`/`useHeaderContext()` values to the current cell or header, matching assignment. Previously `delete` left the property in place and `Object.defineProperty` wrote to the proxy's internal object, so later reads could return stale values or throw. `Object.preventExtensions` on these values is now rejected, because the underlying cell or header can change.
