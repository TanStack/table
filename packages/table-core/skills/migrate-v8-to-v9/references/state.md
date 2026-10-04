# State migration mappings

Read when replacing v8 state access, observation, controlled callbacks, or reset behavior.

## Migrate state reads and whole-state observation

`table.getState()` and the top-level `onStateChange` option are removed. Individual `on[Slice]Change` callbacks remain.

| V8 need                         | V9 shared surface                                   |
| ------------------------------- | --------------------------------------------------- |
| Full current snapshot           | `table.store.state`                                 |
| One current slice               | `table.atoms.<slice>.get()`                         |
| Adapter-selected reactive state | `table.state` where the adapter exposes it          |
| Observe all changes             | Adapter-supported subscription or native tracking   |
| Control one slice               | `state.<slice>` plus `on<Slice>Change`              |
| Externally own one slice        | `atoms.<slice>` with a writable TanStack Store atom |
| Internal state                  | omit both `state.<slice>` and `atoms.<slice>`       |

Load `intent load <package>#table-state` for the installed adapter before choosing reactive reads. The table above describes shared Store snapshots and ownership; framework observation intentionally differs. For example, Ember `table.store.subscribe` is a no-op and native tracking owns reactivity. When both an external atom and `state` provide a slice, the atom wins. Table writes go directly to that atom, and `table.reset()` does not reset externally owned atoms.

## Updates and resets

Read [shared state](../../table-state/SKILL.md) for ownership, initialization, and reset rules. Pair each controlled value with its matching callback and apply both value and updater-function forms. A feature reset uses that updater; `table.reset()` resets internal base atoms, not external owners.

## Installed API discovery

Inspect `node_modules/@tanstack/table-core/dist/core/table/coreTablesFeature.types.d.ts` and the installed adapter's declarations for subscriptions. Load its `table-state` skill before wiring reactive reads.

## Sources

- `TanStack/table:docs/framework/react/guide/migrating.md`
- `TanStack/table:docs/framework/preact/guide/migrating.md`
- `TanStack/table:docs/framework/solid/guide/migrating.md`
- `TanStack/table:docs/framework/svelte/guide/migrating.md`
- `TanStack/table:docs/framework/vue/guide/migrating.md`
- `TanStack/table:docs/framework/angular/guide/migrating.md`
- `TanStack/table:docs/framework/lit/guide/migrating.md`
- `TanStack/table:packages/table-core/src/index.ts`
- `TanStack/table:packages/table-core/src/types/TableFeatures.ts`
- `TanStack/table:packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts`
- `TanStack/table:packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts`
- `TanStack/table:packages/react-table/src/legacy.ts`
