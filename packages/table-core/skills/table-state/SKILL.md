---
name: table-state
description:
  Choose Table v9 state ownership, atoms, initialization, updates, and resets.
  Load for controlled slices or state coordination; use the adapter state skill for reactive
  reads.
metadata:
  type: core
  library: '@tanstack/table-core'
  library_version: 9.2.5
requires:
  - core
sources:
  - TanStack/table:docs/framework/react/guide/table-state.md
  - TanStack/table:packages/table-core/src/core/table/coreTablesFeature.types.ts
  - TanStack/table:packages/table-core/src/core/table/coreTablesFeature.utils.ts
  - TanStack/table:packages/table-core/src/core/reactivity/coreReactivityFeature.utils.ts
---

# Shared table state

Read [core](../core/SKILL.md) first for stable model inputs and feature-gated types. State repair in an existing table can start here without adapter setup guidance.

## Start with internal ownership

Omit `state`, `atoms`, and `on<Slice>Change` for slices that Table should own. Use `initialState` only to customize their initial values.

<!-- skill-snippet:check -->

```ts
import {
  constructTable,
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'

type Person = { id: string; name: string }
const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
  rowPaginationFeature,
})
const helper = createColumnHelper<typeof features, Person>()
const columns = helper.columns([helper.accessor('name', {})])
const data: Person[] = [{ id: '1', name: 'Ada' }]
const table = constructTable({
  features,
  columns,
  data,
  initialState: { pagination: { pageIndex: 0, pageSize: 25 } },
})
table.setPageSize(50)
console.log(table.atoms.pagination.get().pageSize)
table.resetPagination()
console.log(table.atoms.pagination.get().pageSize)
```

This example demonstrates state only. A pagination row-model slot is needed when Table should also slice the data.

## Choose one owner per slice

| Owner           | Configuration                                                   | Update path                                                                 |
| --------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Table           | Omit external values; optionally provide `initialState.<slice>` | Feature setter or interaction handler                                       |
| Framework state | Current `state.<slice>` plus matching `on<Slice>Change`         | Callback applies the updater and the adapter receives the fresh value       |
| External atom   | Stable writable `atoms.<slice>`                                 | Feature setters write directly to that atom; no matching callback is needed |

Prefer the smallest set of externally owned slices. Load the adapter's `table-state` skill before selecting framework state or an external atom package. Native signals, runes, refs, tracked properties, and Store atoms have different adapter wiring.

An updater can be a value or a function of the previous value. In a custom callback, use `functionalUpdate(updater, previousValue)` from `@tanstack/table-core` and write the result to the owner. Supplying only `on<Slice>Change` replaces the internal updater without returning a current controlled value; supplying only `state.<slice>` leaves no effective external update path.

If both `atoms.<slice>` and `state.<slice>` are supplied, the external atom wins. Choose one owner deliberately; writing an internal base atom cannot change a slice resolved from an external atom.

## Distinguish state reads and writes

- `table.baseAtoms` contains internal writable atoms created from resolved initial state. Prefer feature setters; direct base-atom writes bypass feature-specific behavior.
- `table.atoms` contains readonly resolved atoms per registered slice. `table.atoms.pagination.get()` reads whichever owner supplies pagination.
- `table.store` is the readonly flat combination of resolved slices. `table.store.state` reads its current snapshot.
- `table.state`, where an adapter exposes it, is adapter-selected state. Its presence and subscription behavior are not shared core contracts.

A feature must be registered before its state appears in `initialState`, `state`, `atoms`, `baseAtoms`, or `store`. Let the concrete feature registry infer `TableState`; import a slice type such as `PaginationState` for an external owner instead of widening the complete state.

A direct atom/store read is not a portable framework subscription. Its tracking depends on the adapter and the scope of the read. For reactive UI, load `intent load <package>#table-state` using the installed adapter package, for example `intent load @tanstack/react-table#table-state`. Use that skill's supported read and subscription APIs.

## Initialization and resets

`initialState` resolves at construction. Changing the supplied object later does not reset the table. Keep the registered features and external atom identities stable for the instance lifetime.

Feature resets such as `resetPagination()` use `table.initialState` by default. Many accept `true` to use the feature's blank/default state. They run through the feature updater and can therefore reset a controlled slice or external atom when its owner accepts the update.

`table.reset()` resets internal base atoms and transient feature instance data. It does not reset external atoms or make an external controlled owner forget its value. Use the feature reset or the external owner's reset for those slices.

## Installed API discovery

Inspect `node_modules/@tanstack/table-core/dist/core/table/coreTablesFeature.types.d.ts`, `dist/types/TableState.d.ts`, and the relevant feature's `*.types.d.ts`. Follow the adapter skill for reactive consumption and commit timing.
