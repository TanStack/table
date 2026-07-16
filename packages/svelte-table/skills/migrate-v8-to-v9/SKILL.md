---
name: migrate-v8-to-v9
description: >
  Complete Svelte v8-to-v9 migration reference: Svelte 5, createTable, explicit features and row-model slots, atom/rune state, rendering helpers, prototype methods, type generics, sorting, sizing, selection, and logical pinning.
metadata:
  type: lifecycle
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: '9.0.0-beta.50'
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/svelte/guide/migrating.md'
  - 'TanStack/table:packages/svelte-table/src/index.ts'
  - 'TanStack/table:examples/svelte/basic-create-table'
---

Use this as the complete breaking-change checklist, not merely a quick start. V9 is treated as the current API. Migrate the app to Svelte 5 before migrating Table; the v9 adapter has no Svelte 3/4 compatibility layer.

Framework prerequisite: Svelte 5 (`svelte ^5.0.0`).

## Recommended Migration Order

1. Upgrade to Svelte 5 and replace v8 stores with runes/getters.
2. Rename `createSvelteTable` to `createTable`.
3. Define explicit `tableFeatures`, then move row models and registries into it.
4. Update state reads/ownership and rendering.
5. Apply every shared API and type rename below.
6. Use `stockFeatures` only as a temporary audit bridge; explicit features are the production target.

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

## Construction and Feature Registration

| v8                                           | v9                                                         |
| -------------------------------------------- | ---------------------------------------------------------- |
| `createSvelteTable(options)`                 | `createTable(options, selector?)`                          |
| All features bundled                         | Required `features: tableFeatures({...})`                  |
| `getCoreRowModel()` option                   | Remove; the core row model is automatic                    |
| `get*RowModel()` table options               | `create*RowModel()` slots in `tableFeatures`               |
| `sortingFns` table option                    | `sortFns` feature slot                                     |
| `filterFns` / `aggregationFns` table options | Same-named feature slots                                   |
| Top-level `onStateChange`                    | Per-slice callbacks, external atoms, or store subscription |

Available feature imports are `columnFilteringFeature`, `globalFilteringFeature`, `rowSortingFeature`, `rowPaginationFeature`, `rowSelectionFeature`, `rowExpandingFeature`, `rowPinningFeature`, `columnPinningFeature`, `columnVisibilityFeature`, `columnOrderingFeature`, `columnSizingFeature`, `columnResizingFeature`, `rowAggregationFeature`, `columnGroupingFeature`, and `columnFacetingFeature`. An API does not exist unless its feature is registered. Put a feature before its dependent slot in the same `tableFeatures` call. Aggregation is independent from grouping: register `rowAggregationFeature` for aggregation APIs and add `columnGroupingFeature` only for grouped rows.

### Row-model mapping

| v8 option                  | v9 slot and factory                                                 |
| -------------------------- | ------------------------------------------------------------------- |
| `getFilteredRowModel()`    | `filteredRowModel: createFilteredRowModel()` after column filtering |
| `getSortedRowModel()`      | `sortedRowModel: createSortedRowModel()` after row sorting          |
| `getPaginationRowModel()`  | `paginatedRowModel: createPaginatedRowModel()` after pagination     |
| `getExpandedRowModel()`    | `expandedRowModel: createExpandedRowModel()` after expanding        |
| `getGroupedRowModel()`     | `groupedRowModel: createGroupedRowModel()` after grouping           |
| `getFacetedRowModel()`     | `facetedRowModel: createFacetedRowModel()` after faceting           |
| `getFacetedMinMaxValues()` | `facetedMinMaxValues: createFacetedMinMaxValues()`                  |
| `getFacetedUniqueValues()` | `facetedUniqueValues: createFacetedUniqueValues()`                  |

Factories take no arguments. Register `filterFns`, `sortFns`, and `aggregationFns` as sibling feature slots holding individually imported built-ins (`filterFn_includesString`, `sortFn_alphanumeric`, `aggregationFn_sum`) under their conventional keys. The full registry objects still work but bundle every built-in.

## Svelte State Migration

- Reactive option inputs must remain live: use getters for rune values such as `data` and controlled state slices.
- `table.getState().sorting` becomes `table.state.sorting`, `table.store.state.sorting`, or the narrow `table.atoms.sorting.get()`.
- `table.state` contains all registered state by default. Pass a second-argument selector to `createTable` only to narrow its reactive surface.
- `subscribeTable(table.atoms.pagination, selector?)` exposes `.current` for fine-grained template subscriptions.
- For Svelte-owned controlled slices, use `createTableState` and matching `onSortingChange`, `onPaginationChange`, and other per-slice callbacks.
- For shared ownership, provide atoms created by `@tanstack/svelte-store` through `atoms`. Never provide both `atoms.pagination` and `state.pagination`.
- Subscribe to `table.store` to observe every state change. Do not port the removed top-level `onStateChange`.
- Treat `table.baseAtoms` as internal writable state; prefer feature APIs or external atoms.

## Rendering and Composition

| v8                                       | v9                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `flexRender(...)` / `<svelte:component>` | `<FlexRender {cell} />`, `<FlexRender {header} />`, or `<FlexRender {footer} />` |
| Component returned directly              | `renderComponent(Component, props)`                                              |
| Svelte snippet content                   | `renderSnippet(snippet, props)`                                                  |
| Repeated raw options                     | `tableOptions(...)` composition                                                  |
| Repeated table conventions               | `createTableHook({ features, ... })` and its pre-bound helpers                   |

`createTableHook` returns a feature-bound table creator and column helper; use it for application-wide conventions, not as a required migration step.

## Complete Shared Breaking-Change Map

### Instance methods

Row, cell, column, header, and related object methods now live on shared prototypes and use `this`. Call `row.getValue(...)`, `cell.getContext()`, `column.getCanSort()`, and `header.getContext()` on their instances. Do not destructure them or pass them as bare callbacks. They are not own enumerable properties, so object spread, `Object.keys`, and JSON serialization do not preserve them. Table methods are not affected.

### Logical column pinning

There are no `left`/`right` aliases in beta.38.

| old                                                            | new                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| `columnPinning.left` / `.right`                                | `.start` / `.end`                                             |
| `column.pin('left' \| 'right')`                                | `column.pin('start' \| 'end')`                                |
| `getIsPinned() === 'left' \| 'right'`                          | `'start' \| 'end'`                                            |
| `row.getLeftVisibleCells()` / `getRightVisibleCells()`         | `getStartVisibleCells()` / `getEndVisibleCells()`             |
| `getLeftHeaderGroups()` / `getRightHeaderGroups()`             | `getStartHeaderGroups()` / `getEndHeaderGroups()`             |
| `getLeftFooterGroups()` / `getRightFooterGroups()`             | `getStartFooterGroups()` / `getEndFooterGroups()`             |
| `getLeftFlatHeaders()` / `getRightFlatHeaders()`               | `getStartFlatHeaders()` / `getEndFlatHeaders()`               |
| `getLeftLeafHeaders()` / `getRightLeafHeaders()`               | `getStartLeafHeaders()` / `getEndLeafHeaders()`               |
| `getLeftLeafColumns()` / `getRightLeafColumns()`               | `getStartLeafColumns()` / `getEndLeafColumns()`               |
| `getLeftVisibleLeafColumns()` / `getRightVisibleLeafColumns()` | `getStartVisibleLeafColumns()` / `getEndVisibleLeafColumns()` |
| `getLeftTotalSize()` / `getRightTotalSize()`                   | `getStartTotalSize()` / `getEndTotalSize()`                   |
| `column.getStart('left')`                                      | `column.getStart('start')`                                    |
| `column.getAfter('right')`                                     | `column.getAfter('end')`                                      |
| `column.getIndex('left' \| 'right')`                           | `column.getIndex('start' \| 'end')`                           |

This is logical region naming, not automatic DOM direction handling. Prefer CSS `inset-inline-start`/`inset-inline-end`. `columnResizeDirection` is unchanged.

### Feature and state splits

- `enablePinning` splits into `enableColumnPinning` and `enableRowPinning`.
- Interactive resizing requires both `columnSizingFeature` and `columnResizingFeature`; fixed widths need only sizing.
- `columnSizingInfo` becomes `columnResizing`.
- `setColumnSizingInfo()` becomes `setColumnResizing()`.
- `onColumnSizingInfoChange` becomes `onColumnResizingChange`.

### Sorting, rows, and selection

| v8                             | v9                            |
| ------------------------------ | ----------------------------- |
| `sortingFn`                    | `sortFn`                      |
| `sortingFns`                   | `sortFns`                     |
| `getSortingFn()`               | `getSortFn()`                 |
| `getAutoSortingFn()`           | `getAutoSortFn()`             |
| `SortingFn` / `SortingFns`     | `SortFn` / `SortFns`          |
| `row._getAllCellsByColumnId()` | `row.getAllCellsByColumnId()` |

All other `_`-prefixed internal APIs are removed, including `_getPinnedRows`, `_getFacetedRowModel`, `_getFacetedMinMaxValues`, and `_getFacetedUniqueValues`; do not seek replacements unless a public API is documented.

`getIsSomeRowsSelected()` and `getIsSomePageRowsSelected()` now mean at least one, including all. For an indeterminate checkbox, combine “some” with `!getIsAllRowsSelected()` or `!getIsAllPageRowsSelected()`.

## TypeScript Migration

- Core types now take `TFeatures` first: `ColumnDef<typeof features, Person>`, `Column<typeof features, Person>`, `Row<typeof features, Person>`, `Table<typeof features, Person>`.
- Replace `createColumnHelper<Person>()` with `createColumnHelper<typeof features, Person>()`; wrap arrays in `columnHelper.columns([...])` for inference.
- With `stockFeatures`, use `StockFeatures` as the feature type.
- `TableMeta` and `ColumnMeta` declaration merging still works only after adding `TFeatures` first. Prefer per-table `tableMeta`/`columnMeta: metaHelper<...>()` slots.
- Replace global `FilterFns`, `SortFns`, `AggregationFns`, and `FilterMeta` augmentation with `filterFns`, `sortFns`, `aggregationFns`, and `filterMeta: metaHelper<...>()` slots. Registered keys become valid string references.
- Prefer explicit object row types; `RowData` is restricted to records or arrays.

## Common Migration Failures

### CRITICAL: Running v9 on Svelte 3/4

Upgrade to Svelte 5 first. Writable-store-era table setup is not a supported v9 adapter contract.

### HIGH: Moving the feature but not its row model

Register both the feature and its `create*RowModel()` slot. Leaving `get*RowModel` on table options silently leaves the v9 processing pipeline incomplete.

### HIGH: Snapshotting a rune value

Use `get data() { return data }`; a one-time `data` snapshot does not remain reactive.

### HIGH: Destructuring instance methods

Keep calls bound to row/cell/column/header instances; shallow copies do not contain prototype methods.

## Final Checklist

- [ ] Svelte is version 5+; old writable-store patterns are removed.
- [ ] `createSvelteTable` is replaced by `createTable`.
- [ ] Explicit features, row models, and function registries are in `tableFeatures`.
- [ ] `getCoreRowModel` and the separate `rowModels` shape are removed.
- [ ] Reactive inputs and controlled slices use getters/runes; state reads use v9 surfaces.
- [ ] `onStateChange` is replaced; atom/state ownership does not overlap.
- [ ] Rendering uses `FlexRender`, `renderComponent`, or `renderSnippet`.
- [ ] Prototype method calls, pinning, sizing/resizing, sorting, row, and selection semantics are audited.
- [ ] Helpers, types, meta, registries, and `RowData` use the v9 generic/slot shapes.
- [ ] Temporary `stockFeatures` usage has an explicit removal plan.

## API Discovery

Verify the installed target in `node_modules/@tanstack/svelte-table/src/index.ts` and its adapter sources. Verify feature slots and exact beta APIs in `node_modules/@tanstack/table-core/src`; do not reconstruct v9 APIs from v8 memory.
