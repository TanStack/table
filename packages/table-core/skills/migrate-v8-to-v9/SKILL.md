---
name: migrate-v8-to-v9
description:
  Audit and migrate Table v8 to v9. Inventory affected APIs, follow the shared
  checklist, and read only the required architecture, state, feature, and TypeScript mappings.
metadata:
  type: lifecycle
  library: '@tanstack/table-core'
  library_version: 9.2.5
requires:
  - core
sources:
  - TanStack/table:docs/framework/react/guide/migrating.md
  - TanStack/table:docs/framework/preact/guide/migrating.md
  - TanStack/table:docs/framework/solid/guide/migrating.md
  - TanStack/table:docs/framework/svelte/guide/migrating.md
  - TanStack/table:docs/framework/vue/guide/migrating.md
  - TanStack/table:docs/framework/angular/guide/migrating.md
  - TanStack/table:docs/framework/lit/guide/migrating.md
  - TanStack/table:packages/table-core/src/index.ts
  - TanStack/table:packages/table-core/src/types/TableFeatures.ts
  - TanStack/table:packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts
  - TanStack/table:packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts
  - TanStack/table:packages/react-table/src/legacy.ts
---

# Migrate Table v8 to v9

Read [core](../core/SKILL.md) first. Audit every item below before choosing detailed mappings. This shared checklist owns the complete core migration; the installed adapter's migration skill owns construction, rendering, framework requirements, and reactive wiring.

## Procedure

1. Establish passing tests for the existing table and inventory its enabled interactions, imports, options, and state owners.
2. Follow the whole audit checklist. Read a mapping reference when the audit finds affected code; preserve behavior while migrating features and construction.
3. Load the installed adapter with `intent load <package>#migrate-v8-to-v9` and its `table-state` skill. Substitute the actual adapter package. React, Preact, Solid, Svelte, Vue, Angular, and Lit have migration skills; Alpine, Ember, and Octane have no v8 adapter migration journey.
4. Type-check, exercise every enabled interaction and client/server stage, and complete the explicit v9 setup.

Treat `useLegacyTable` as a deprecated React-only bridge for an existing incremental migration. It bundles every feature, can exceed the v8 bundle, and is not the target architecture. Its only entrypoint is `@tanstack/react-table/legacy`.

## Read mappings for affected code

| Audit finds                                                                                     | Read                                                |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Feature registration, row-model factories, function slots, bound methods, or consumed internals | [Architecture mappings](references/architecture.md) |
| `getState`, `onStateChange`, controlled ownership, observation, or reset changes                | [State mappings](references/state.md)               |
| Aggregation, logical pinning, sizing/resizing, sorting names, or selection predicates           | [Feature API mappings](references/feature-apis.md)  |
| Explicit generics, column helpers, scoped meta, registry augmentation, or `RowData`             | [TypeScript mappings](references/typescript.md)     |

## Complete audit checklist

- [ ] Load the installed framework adapter's migration and table-state skills.
- [ ] Replace the v8 adapter constructor/hook/controller with its v9 entrypoint.
- [ ] Add a stable `features` object to every table.
- [ ] Inventory every feature API used by table, row, column, cell, and header code; register each stock feature the table actually uses.
- [ ] Use `stockFeatures` only as a temporary parity aid and record an explicit-feature follow-up.
- [ ] Remove `getCoreRowModel()` unless supplying a deliberate custom `coreRowModel` slot.
- [ ] Move all remaining `get*RowModel()` options (or a removed `rowModels: {...}` object, if present) to `create*RowModel()` feature slots.
- [ ] Register each dependent feature before its row-model slot.
- [ ] Move `filterFns`, `sortingFns`/`sortFns`, and `aggregationFns` into feature slots, registering individually imported built-ins; pass no registries to factories.
- [ ] Register `rowAggregationFeature` independently and migrate custom aggregation callables to context-based `AggregationFnDef` definitions.
- [ ] Register `columnFilteringFeature` before global filtering and filter/facet dependencies.
- [ ] Register `columnSizingFeature` before `columnResizingFeature`.
- [ ] Replace `table.getState()` and top-level `onStateChange` according to the adapter state guide.
- [ ] Verify every controlled slice has an update path; verify externally owned atoms are reset by their owner.
- [ ] Audit destructured, spread, serialized, or bare-callback instance methods.
- [ ] Replace every column-pinning `left`/`right` key, argument, comparison, method family, and sticky CSS declaration with logical start/end equivalents.
- [ ] Split table-level `enablePinning`; preserve column-def `enablePinning` where intended.
- [ ] Split sizing/resizing features and rename the resizing state, setter, and callback.
- [ ] Replace every `sortingFn`/`SortingFn`/`sortingFns` spelling with its v9 `sort*` spelling.
- [ ] Remove every consumed underscore-prefixed internal API.
- [ ] Recheck indeterminate selection logic against the new "at least one" semantics.
- [ ] Add `TFeatures` to unavoidable explicit core types, helpers, and retained meta augmentation; otherwise restore inference.
- [ ] Replace function-registry and filter-meta declaration merging with per-table slots where appropriate.
- [ ] Ensure every row is a record or array under the stricter `RowData` constraint.
- [ ] Migrate adapter-specific rendering, reactive data inputs, and subscription primitives.
- [ ] Type-check without `any`/casts added merely to suppress migration failures.
- [ ] Test sorting, filtering, faceting, grouping, expansion, pagination, selection, ordering, pinning, sizing, and resizing where enabled.
- [ ] Test client/server ownership for every row-model pipeline stage and ensure manual modes receive already-processed data.
- [ ] Test LTR and RTL layouts when column pinning or resizing is enabled.
- [ ] Remove `useLegacyTable` after the incremental migration step that required it.

## Completion checks

Missing feature APIs must be resolved through registration, not casts. Keep v8 `get*RowModel` configuration and physical pinning names out of the final v9 setup. Remove temporary `stockFeatures` or `useLegacyTable` use when the incremental step no longer needs them.

After behavior parity, consider `tableOptions()` for reusable configuration, `createTableHook()` for app conventions, narrower subscriptions, and scoped meta. These are optional improvements, not extra required breakages. Use the adapter's getting-started skill to reach its app-hook reference when adopting that pattern.

## Installed API discovery

Start at `node_modules/@tanstack/table-core/dist/index.d.ts` and the relevant feature declarations. Resolve the installed package root if the package manager uses another layout. The adapter migration skill names its published declaration route; follow that route for framework APIs instead of applying another adapter's names.
