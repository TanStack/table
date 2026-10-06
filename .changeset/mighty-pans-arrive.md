---
'@tanstack/solid-table': patch
---

Deprecate table.Subscribe in the Solid adapter. Read table APIs or atoms directly inside JSX, createMemo, or createEffect; Solid tracks these reads natively. Keep the wrapper for compatibility and update examples and guidance to use direct reads.
