# Alpine Table reactivity

Read for Alpine subscription boundaries, shared state, or updates that require more than the default rendering behavior.

This reference inherits the version of its owning skill.

## Gate broad binding updates

By default, the table proxy subscribes to the full store and increments one reactive version counter. Every binding that touches the table depends on that counter. A narrow atom read selects a value but does not isolate the binding from other state updates.

The optional second `createTable` argument shallow-compares selected state before bumping the counter. Options changes, including new data, still reevaluate bindings. Select every slice that the affected bindings must observe.

For high-frequency updates such as column resizing, use `() => ({})` only after explicit `table.atoms.<slice>.subscribe()` side effects own the required updates and their cleanup. Otherwise, opting out freezes state-driven bindings.

## Controlled getters and external atoms

When `Alpine.reactive` owns a slice, keep a getter in `state` and resolve every callback into the reactive owner. Capturing `state: { pagination: local.pagination }` misses later object replacements.

When an external atom owns the slice, pass it in `atoms` and write it through feature APIs or the external atom. Supplying controlled `state` for the same slice does not create two-way synchronization; the atom takes precedence.

## Read inside the binding

Use `x-text="table.atoms.pagination.get().pageIndex + 1"` or read Table APIs inside an Alpine getter. Event handlers can read the current value directly. A value copied outside tracked execution stays a snapshot.

The adapter has no `table.Subscribe` component. Keep interactive markup in Alpine templates and use the reactive table proxy there.

## API discovery

Inspect `node_modules/@tanstack/alpine-table/dist/index.d.ts`, `createTable.d.ts`, and `reactivity.d.ts`. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.

## Sources

- `TanStack/table:docs/framework/alpine/guide/table-state.md`
- `TanStack/table:examples/alpine/basic-create-table`
- `TanStack/table:packages/alpine-table/src/createTable.ts`
