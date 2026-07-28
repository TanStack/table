---
'@tanstack/table-core': patch
---

Preserve `undefined` in `DeepValue` accessor value types when a deep string accessor key traverses an optional or nullable parent key. `getValue()` for a path like `user.salary.amount` is now typed as `number | undefined` when `salary` is optional, matching the optional-chaining behavior of the runtime deep accessor.
