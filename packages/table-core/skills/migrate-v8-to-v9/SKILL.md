---
name: migrate-v8-to-v9
description: >
  Perform a complete TanStack Table v8-to-v9 migration audit: feature registration, row-model and function-registry slots, state/store changes, prototype methods, column pinning and resizing renames, sorting and selection semantics, removed internals, helpers, meta typing, and generic changes. Load this shared inventory before the installed framework adapter's migration skill.
metadata:
  type: lifecycle
  library: '@tanstack/table-core'
  library_version: '9.0.0-beta.47'
requires: ['core', 'table-features', 'typescript']
sources:
  - 'TanStack/table:docs/framework/react/guide/migrating.md'
  - 'TanStack/table:docs/framework/preact/guide/migrating.md'
  - 'TanStack/table:docs/framework/solid/guide/migrating.md'
  - 'TanStack/table:docs/framework/svelte/guide/migrating.md'
  - 'TanStack/table:docs/framework/vue/guide/migrating.md'
  - 'TanStack/table:docs/framework/angular/guide/migrating.md'
  - 'TanStack/table:docs/framework/lit/guide/migrating.md'
  - 'TanStack/table:packages/table-core/src/index.ts'
  - 'TanStack/table:packages/table-core/src/types/TableFeatures.ts'
  - 'TanStack/table:packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts'
  - 'TanStack/table:packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts'
  - 'TanStack/table:packages/react-table/src/legacy.ts'
---

Apply this complete shared inventory before loading the installed adapter's `migrate-v8-to-v9` skill. The adapter skill owns hook/controller construction, reactive inputs, rendering helpers, and framework subscription APIs.

## Migration strategy

1. Make the v8 table pass its existing tests before changing it.
2. Migrate construction and features while preserving behavior.
3. Let TypeScript expose missing features and stale names.
4. Migrate state ownership and rendering through the adapter skill.
5. Test every enabled client/server row-model stage and interaction.
6. Replace temporary `stockFeatures` usage with explicit features when practical.

Treat `useLegacyTable` as a deprecated, React-only emergency bridge. It bundles every feature, can exceed the v8 bundle, and must not become the target architecture. Import it only from `@tanstack/react-table/legacy` when an existing incremental migration requires it.

## Minimal v9 shape

```ts
import {
  createFilteredRowModel,
  createSortedRowModel,
  columnFilteringFeature,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
```

Pass `features` to the adapter's v9 table constructor. Define it statically outside render/setup work when possible.

## Complete shared breaking-change inventory

### 1. Register every non-core feature explicitly

V8 bundled all stock features. V9 exposes an API only when its feature is present in `tableFeatures({...})`.

| Capability                  | V9 feature                |
| --------------------------- | ------------------------- |
| Column faceting             | `columnFacetingFeature`   |
| Column filtering            | `columnFilteringFeature`  |
| Aggregation                 | `aggregationFeature`      |
| Grouping                    | `columnGroupingFeature`   |
| Column ordering             | `columnOrderingFeature`   |
| Column pinning              | `columnPinningFeature`    |
| Interactive column resizing | `columnResizingFeature`   |
| Column sizes and offsets    | `columnSizingFeature`     |
| Column visibility           | `columnVisibilityFeature` |
| Global filtering            | `globalFilteringFeature`  |
| Row expansion               | `rowExpandingFeature`     |
| Pagination                  | `rowPaginationFeature`    |
| Row pinning                 | `rowPinningFeature`       |
| Row selection               | `rowSelectionFeature`     |
| Sorting                     | `rowSortingFeature`       |

The core row model and core table/row/column/header/cell behavior are automatic. `stockFeatures` restores a v8-like all-features surface, but use it as an audit shortcut rather than the default production recommendation.

Honor feature prerequisites in the same `tableFeatures` call:

- `columnResizingFeature` requires `columnSizingFeature`.
- `globalFilteringFeature` requires `columnFilteringFeature`.
- Every row-model or function-registry slot requires its associated feature.
- `aggregationFns` requires `aggregationFeature`; grouped aggregation uses both `aggregationFeature` and `columnGroupingFeature`.
- Put prerequisite feature properties before dependent slots so inference and diagnostics remain clear.

### 2. Move row models into feature slots and rename factories

V8 `get*RowModel()` table options and the earlier-v9-beta `rowModels` object are gone. V9 `create*RowModel()` factories take no registry arguments and are registered as named feature slots.

| V8 table option                                    | V9 `tableFeatures` slot                | V9 factory                                     |
| -------------------------------------------------- | -------------------------------------- | ---------------------------------------------- |
| `getCoreRowModel: getCoreRowModel()`               | automatic; omit for the built-in model | built-in `createCoreRowModel()` is the default |
| `getFilteredRowModel: getFilteredRowModel()`       | `filteredRowModel`                     | `createFilteredRowModel()`                     |
| `getSortedRowModel: getSortedRowModel()`           | `sortedRowModel`                       | `createSortedRowModel()`                       |
| `getPaginationRowModel: getPaginationRowModel()`   | `paginatedRowModel`                    | `createPaginatedRowModel()`                    |
| `getExpandedRowModel: getExpandedRowModel()`       | `expandedRowModel`                     | `createExpandedRowModel()`                     |
| `getGroupedRowModel: getGroupedRowModel()`         | `groupedRowModel`                      | `createGroupedRowModel()`                      |
| `getFacetedRowModel: getFacetedRowModel()`         | `facetedRowModel`                      | `createFacetedRowModel()`                      |
| `getFacetedMinMaxValues: getFacetedMinMaxValues()` | `facetedMinMaxValues`                  | `createFacetedMinMaxValues()`                  |
| `getFacetedUniqueValues: getFacetedUniqueValues()` | `facetedUniqueValues`                  | `createFacetedUniqueValues()`                  |

For a custom core model, use the `coreRowModel` slot rather than restoring the v8 table option.

Move registries from table options or factory arguments into these feature slots:

| V8               | V9               |
| ---------------- | ---------------- |
| `sortingFns`     | `sortFns`        |
| `filterFns`      | `filterFns`      |
| `aggregationFns` | `aggregationFns` |

Register only the built-ins the table references by string name, importing each individually (`filterFn_includesString`, `sortFn_alphanumeric`, `aggregationFn_sum`, and so on) alongside any custom functions. The full registry objects (`filterFns`, `sortFns`, `aggregationFns` exports) still work but bundle every built-in. A slot's keys become the valid string names in column definitions, and `'auto'` resolves only registered functions.

Aggregation is independent from grouping. Add `aggregationFeature` for
`aggregationFn`, `aggregatedCell`, `column.getAggregationValue(rows?)`, and
`cell.getIsAggregated`. A root total does not require grouping. Convert legacy
custom callables `(columnId, leafRows, childRows) => result` to
`constructAggregationFn({ aggregate: (context) => result, merge? })`
definitions. Replace `column.getAggregationFn()` with
`column.getAggregationFns()`; arrays in `aggregationFn` return keyed objects.
Replace the old `AggregationFn` and `CreatedAggregationFn` types with
`AggregationFnDef`.

### 3. Migrate state reads and whole-state observation

`table.getState()` and the top-level `onStateChange` option are removed. Individual `on[Slice]Change` callbacks remain.

| V8 need                         | V9 shared surface                                   |
| ------------------------------- | --------------------------------------------------- |
| Full current snapshot           | `table.store.state`                                 |
| One current slice               | `table.atoms.<slice>.get()`                         |
| Adapter-selected reactive state | `table.state` where the adapter exposes it          |
| Observe all changes             | `table.store.subscribe(...)`                        |
| Control one slice               | `state.<slice>` plus `on<Slice>Change`              |
| Externally own one slice        | `atoms.<slice>` with a writable TanStack Store atom |
| Internal state                  | omit both `state.<slice>` and `atoms.<slice>`       |

Load the adapter `table-state` skill before choosing reactive reads; adapters intentionally differ. When both an external atom and `state` provide a slice, the atom wins. Table writes go directly to that atom, and `table.reset()` does not reset externally owned atoms.

### 4. Keep instance methods bound

Row, cell, column, header, and related object methods moved to shared prototypes. Destructuring, passing a bare callback, spreading, `Object.keys`, and `JSON.stringify` no longer preserve or reveal those methods.

```ts
// v8 code that breaks
const { getValue } = row
rows.map(row.getVisibleCells)

// v9
const value = row.getValue('name')
rows.map((row) => row.getVisibleCells())
```

Audit all methods extracted from rows, cells, columns, headers, and header groups. Table-instance methods are not subject to this specific migration rule.

### 5. Replace physical column pinning with logical pinning

V9 beta.38 has no `left`/`right` aliases. Replace all state keys, return-value comparisons, arguments, and API families:

| V8                                                                                         | V9                                                            |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `columnPinning.left` / `.right`                                                            | `.start` / `.end`                                             |
| `column.pin('left' \| 'right')`                                                            | `column.pin('start' \| 'end')`                                |
| `column.getIsPinned() === 'left' \| 'right'`                                               | compare with `'start' \| 'end'`                               |
| `row.getLeftVisibleCells()` / `getRightVisibleCells()`                                     | `getStartVisibleCells()` / `getEndVisibleCells()`             |
| `table.getLeftHeaderGroups()` / `getRightHeaderGroups()`                                   | `getStartHeaderGroups()` / `getEndHeaderGroups()`             |
| `table.getLeftFooterGroups()` / `getRightFooterGroups()`                                   | `getStartFooterGroups()` / `getEndFooterGroups()`             |
| `table.getLeftFlatHeaders()` / `getRightFlatHeaders()`                                     | `getStartFlatHeaders()` / `getEndFlatHeaders()`               |
| `table.getLeftLeafHeaders()` / `getRightLeafHeaders()`                                     | `getStartLeafHeaders()` / `getEndLeafHeaders()`               |
| `table.getLeftLeafColumns()` / `getRightLeafColumns()`                                     | `getStartLeafColumns()` / `getEndLeafColumns()`               |
| `table.getLeftVisibleLeafColumns()` / `getRightVisibleLeafColumns()`                       | `getStartVisibleLeafColumns()` / `getEndVisibleLeafColumns()` |
| `table.getLeftTotalSize()` / `getRightTotalSize()`                                         | `getStartTotalSize()` / `getEndTotalSize()`                   |
| `'left' \| 'right'` passed to `getStart`, `getAfter`, `getIndex`, or pinned-region helpers | `'start' \| 'end'`                                            |

This names logical regions; it does not automatically apply DOM direction or sticky CSS. Use logical CSS such as `inset-inline-start`/`insetInlineStart` and `inset-inline-end`/`insetInlineEnd`. `columnResizeDirection` remains `'ltr' | 'rtl'`.

### 6. Split column sizing from resizing

V8's combined sizing feature became two tree-shakeable features:

- Register `columnSizingFeature` for sizes, offsets, and total-size APIs.
- Also register `columnResizingFeature` for drag handles and transient interaction state.
- `columnResizingFeature` cannot stand alone.

| V8                         | V9                       |
| -------------------------- | ------------------------ |
| `columnSizingInfo` state   | `columnResizing` state   |
| `setColumnSizingInfo(...)` | `setColumnResizing(...)` |
| `onColumnSizingInfoChange` | `onColumnResizingChange` |

The current source spelling is `setColumnResizing` with an uppercase `C`.

### 7. Rename sorting APIs

| V8                          | V9                       |
| --------------------------- | ------------------------ |
| column-def `sortingFn`      | `sortFn`                 |
| `column.getSortingFn()`     | `column.getSortFn()`     |
| `column.getAutoSortingFn()` | `column.getAutoSortFn()` |
| `SortingFn`                 | `SortFn`                 |
| `SortingFns`                | `SortFns`                |
| built-in `sortingFns`       | `sortFns`                |

Also move the registry to `tableFeatures`, as described above.

### 8. Split the table-level pinning switch

Replace the v8 table option `enablePinning` with `enableColumnPinning` and/or `enableRowPinning`. Do not mechanically rename a column definition's `enablePinning`: that column-level option still exists.

### 9. Remove internal APIs and use public surfaces

All underscore-prefixed internals are unsupported and removed. Known migration points include:

| Removed v8 internal               | V9 public direction                                           |
| --------------------------------- | ------------------------------------------------------------- |
| `row._getAllCellsByColumnId()`    | `row.getAllCellsByColumnId()`                                 |
| `table._getPinnedRows()`          | `table.getTopRows()`, `getCenterRows()`, or `getBottomRows()` |
| `table._getFacetedRowModel()`     | public faceting APIs on the relevant column/table             |
| `table._getFacetedMinMaxValues()` | `getFacetedMinMaxValues()`                                    |
| `table._getFacetedUniqueValues()` | `getFacetedUniqueValues()`                                    |

For any other `_` API, do not guess. Inspect the installed v9 package source for the public replacement or redesign the integration.

### 10. Update row-selection predicates

`getIsSomeRowsSelected()` and `getIsSomePageRowsSelected()` now mean **at least one**, including the all-selected case. They no longer mean “some but not all.” Build an indeterminate checkbox with both predicates:

```ts
const indeterminate =
  table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
```

For a page checkbox, use `table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()`.

### 11. Update TypeScript feature generics and helpers

Most core types add `TFeatures` before their data/value parameters:

| V8                            | V9                                       |
| ----------------------------- | ---------------------------------------- |
| `Column<TData>`               | `Column<TFeatures, TData, TValue>`       |
| `ColumnDef<TData>`            | `ColumnDef<TFeatures, TData, TValue>`    |
| `Table<TData>`                | `Table<TFeatures, TData>`                |
| `Row<TData>`                  | `Row<TFeatures, TData>`                  |
| `Cell<TData, TValue>`         | `Cell<TFeatures, TData, TValue>`         |
| `createColumnHelper<TData>()` | `createColumnHelper<TFeatures, TData>()` |

Prefer inference. Use `typeof features` only where an explicit type boundary is necessary; use `StockFeatures` when that is genuinely the selected feature set. Wrap column arrays with `columnHelper.columns([...])` to preserve individual and nested `TValue` inference.

`RowData` is now `Record<string, any> | Array<any>`, not `unknown`. Wrap primitive records in an object or array shape.

Global `TableMeta`/`ColumnMeta` declaration merging can remain, but add `TFeatures` as the first generic. Prefer per-table type-only slots where isolation helps:

```ts
const features = tableFeatures({
  columnFilteringFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
  filterMeta: metaHelper<MyFilterMeta>(),
})
```

Replace global `FilterFns`, `SortFns`, and `AggregationFns` augmentation with the matching registry slots; their object keys supply the string-literal names. Replace `FilterMeta` augmentation with the `filterMeta` slot unless global behavior is intentional.

### 12. Migrate adapter construction and rendering separately

The following are breaking but not shared core mappings: adapter hook/factory/controller names, Svelte 5 requirements, reactive getter rules, state-selection components/helpers, and `FlexRender` syntax. Load the installed adapter's migration skill and follow its exact source. Do not apply React names to Preact, Solid, Svelte, Vue, Angular, or Lit.

## Optional v9 adoption after parity

Do not confuse new capabilities with required breakages. After the table works, consider `tableOptions()` for reusable partial configuration, `createTableHook()` for app-level table conventions, per-slice atoms/subscriptions for narrower rendering, per-table meta slots, and explicit features for smaller bundles.

## Complete audit checklist

- [ ] Load the installed framework adapter's migration and table-state skills.
- [ ] Replace the v8 adapter constructor/hook/controller with its v9 entrypoint.
- [ ] Add a stable `features` object to every table.
- [ ] Inventory every feature API used by table, row, column, cell, and header code; register all 14 required stock features.
- [ ] Use `stockFeatures` only as a temporary parity aid and record an explicit-feature follow-up.
- [ ] Remove `getCoreRowModel()` unless supplying a deliberate custom `coreRowModel` slot.
- [ ] Move all remaining `get*RowModel()` options or earlier-beta `rowModels` entries to `create*RowModel()` feature slots.
- [ ] Register each dependent feature before its row-model slot.
- [ ] Move `filterFns`, `sortingFns`/`sortFns`, and `aggregationFns` into feature slots, registering individually imported built-ins; pass no registries to factories.
- [ ] Register `aggregationFeature` independently and migrate custom aggregation callables to context-based `AggregationFnDef` definitions.
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
- [ ] Recheck indeterminate selection logic against the new “at least one” semantics.
- [ ] Add `TFeatures` to unavoidable explicit core types, helpers, and retained meta augmentation; otherwise restore inference.
- [ ] Replace function-registry and filter-meta declaration merging with per-table slots where appropriate.
- [ ] Ensure every row is a record or array under the stricter `RowData` constraint.
- [ ] Migrate adapter-specific rendering, reactive data inputs, and subscription primitives.
- [ ] Type-check without `any`/casts added merely to suppress migration failures.
- [ ] Test sorting, filtering, faceting, grouping, expansion, pagination, selection, ordering, pinning, sizing, and resizing—only where enabled.
- [ ] Test client/server ownership for every row-model pipeline stage and ensure manual modes receive already-processed data.
- [ ] Test LTR and RTL layouts when column pinning or resizing is enabled.
- [ ] Remove `useLegacyTable` after the incremental migration step that required it.

## Common migration failures

### [CRITICAL] Silencing a missing API instead of registering its feature

If `table.nextPage`, `column.toggleSorting`, or a state slice disappears, add the associated feature. Do not cast the table to a broader type.

### [CRITICAL] Mixing v8, early-v9-beta, and beta.38 configuration

Do not combine v8 `get*RowModel` options, an earlier beta's `rowModels` object, or physical pinning names with the current `tableFeatures` slots.

### [HIGH] Treating `stockFeatures` or `useLegacyTable` as the finished migration

Both obscure missing feature decisions; `useLegacyTable` is deprecated and React-only. Reach behavior parity, then complete the explicit v9 setup.

### [HIGH] Copying one adapter's state or rendering API into another

Core concepts are shared, but reactive reads, constructors, and rendering helpers are not. Load the package-local adapter skills.

## Installed-source API discovery

Use the installed version, not main-branch memory:

1. Inspect `node_modules/@tanstack/table-core/src/index.ts` for exports.
2. Inspect `src/types/TableFeatures.ts` for valid slots and prerequisites.
3. Inspect `src/features/<feature>/*.types.ts` for current options, state, and APIs.
4. Inspect the installed adapter's `src/index.ts` and its migration skill for entrypoints and rendering.
5. Inspect `src/legacy.ts` only to remove an existing bridge, never to design new v9 code.

If package-manager layout prevents that exact path, resolve the installed package root first. Do not substitute APIs from a different v9 beta.
