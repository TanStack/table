---
'@tanstack/svelte-table': patch
'@tanstack/vue-table': patch
---

`delete` and `Object.defineProperty` on `useCellContext()`/`useHeaderContext()` values are now forwarded to the current cell or header. Previously `delete` left the property in place and `Object.defineProperty` wrote to the proxy's internal object, so later reads could return stale values or throw. New properties are defined as configurable, explicitly non-configurable definitions are rejected, and `Object.preventExtensions` is refused, because the underlying cell or header can change.
