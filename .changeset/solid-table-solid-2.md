---
'@tanstack/solid-table': major
---

Move `@tanstack/solid-table` to Solid 2. The adapter now requires `solid-js` and `@solidjs/web` 2.0. Solid 1 apps stay on v9.

- Table state atoms are Solid 2 signals and memos, so reads track in JSX, memos and effects as before. Writes are applied when Solid flushes, like any Solid 2 write. Table APIs use updater functions, so several updates in one tick compose.
- `FlexRender` calls cell, header and footer templates where they render, so their reads are tracked and a template updates when what it reads changes. Templates are typed as Solid 2's `Element`.
- A Solid store array passed as `data` (for example Solid Query v6 data, which updates in place) updates the table when its items change.
- `createTableHook` contexts use Solid 2 providers. `useHeaderContext()` returns a view of the header that carries the pre-bound header components, so a header and its footer no longer overwrite each other's components.
