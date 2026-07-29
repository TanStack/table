---
name: migrate-v8-to-v9
description: >
  Complete Vue v8-to-v9 migration reference: useTable, explicit features and row-model slots, ref/atom state, FlexRender shorthand, prototype methods, type generics, sorting, sizing, selection, and logical pinning.
metadata:
  type: lifecycle
  library: '@tanstack/vue-table'
  framework: vue
  library_version: '9.0.0-beta.59'
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/vue/guide/migrating.md'
  - 'TanStack/table:packages/vue-table/src/index.ts'
  - 'TanStack/table:examples/vue/basic-use-table'
---

Use this as the complete breaking-change checklist. V9 is the current API; do not stop after renaming the Vue composable.

Framework prerequisite: Vue 3.2 or newer (`vue >=3.2`).

## Recommended Migration Order

1. Replace `useVueTable` with `useTable` while preserving reactive inputs.
2. Define explicit features, then move row models and registries into `tableFeatures`.
3. Update state reads, controlled ownership, and rendering.
4. Apply every shared API and type rename below.
5. Use `stockFeatures` only as a temporary audit bridge; explicit features are the production target.

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
const data = ref(makeData())
const table = useTable({ features, columns, data })
```

## Construction and Feature Registration

| v8                                           | v9                                                         |
| -------------------------------------------- | ---------------------------------------------------------- |
| `useVueTable(options)`                       | `useTable(options)`                                        |
| All features bundled                         | Required `features: tableFeatures({...})`                  |
| `getCoreRowModel()` option                   | Remove; core row model is automatic                        |
| `get*RowModel()` table options               | `create*RowModel()` slots in `tableFeatures`               |
| `sortingFns` table option                    | `sortFns` feature slot                                     |
| `filterFns` / `aggregationFns` table options | Same-named feature slots                                   |
| Top-level `onStateChange`                    | Per-slice callbacks, external atoms, or store subscription |

Available feature imports are `columnFilteringFeature`, `globalFilteringFeature`, `rowSortingFeature`, `rowPaginationFeature`, `rowSelectionFeature`, `rowExpandingFeature`, `rowPinningFeature`, `columnPinningFeature`, `columnVisibilityFeature`, `columnOrderingFeature`, `columnSizingFeature`, `columnResizingFeature`, `rowAggregationFeature`, `columnGroupingFeature`, and `columnFacetingFeature`. APIs are feature-gated. Put every feature before its dependent slot in the same `tableFeatures` call. Aggregation is independent from grouping: register `rowAggregationFeature` for aggregation APIs and add `columnGroupingFeature` only for grouped rows.

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

## Vue State Migration

- Pass a `ref` or `computed` as `data`; the adapter unwraps and syncs it. Do not pass `data.value`, which is only a snapshot. A getter returning `data.value` is also supported.
- `table.getState().sorting` becomes the narrow `table.atoms.sorting.get()`. Use `table.store.get()` only for a full snapshot/debug output.
- Wrap atom reads in Vue `computed` when deriving template values.
- In JSX/render functions, `table.Subscribe` provides a fine-grained boundary. Pass the callback as the explicit `children` prop because Vue JSX element children become slots.
- Controlled refs need getter-backed state slices plus per-slice callbacks that resolve value-or-function `Updater`s.
- The top-level `onStateChange` is removed. Use per-slice callbacks, external atoms, or `table.store.subscribe` to observe everything.
- External atoms come from `@tanstack/vue-store` and are supplied through `atoms`. Never provide both `atoms.pagination` and `state.pagination`.
- `table.baseAtoms` is internal writable state; prefer feature APIs or external atoms.

## Rendering and Composition

| v8                                                                               | v9 target                                                  |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />` | `<FlexRender :cell="cell" />`                              |
| Manual header/footer render props                                                | `<FlexRender :header="header" />` / `:footer="footer"`     |
| Repeated raw options                                                             | `tableOptions(...)` composition                            |
| Repeated table conventions                                                       | `createTableHook({ features, ... })` and pre-bound helpers |

The old `render`/`props` FlexRender shape still compiles, but shorthand is the migration target. `createTableHook` is optional and intended for application-wide conventions.

## Complete Shared Breaking-Change Map

### Instance methods

Row, cell, column, header, and related methods now live on shared prototypes and use `this`. Call them on their instances. Do not destructure them, pass them bare, or expect them in object spread, `Object.keys`, or JSON. Table methods are not affected.

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

Use CSS `inset-inline-start`/`inset-inline-end`; logical names do not automatically set DOM direction. `columnResizeDirection` is unchanged.

### Pinning, sizing, and resizing

- `enablePinning` splits into `enableColumnPinning` and `enableRowPinning`.
- Interactive resizing requires `columnSizingFeature` plus `columnResizingFeature`; fixed sizing needs only the former.
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

Other `_`-prefixed internals are removed, including `_getPinnedRows`, `_getFacetedRowModel`, `_getFacetedMinMaxValues`, and `_getFacetedUniqueValues`.

`getIsSomeRowsSelected()` and `getIsSomePageRowsSelected()` now mean at least one, including all. Indeterminate UI must also check `!getIsAllRowsSelected()` or `!getIsAllPageRowsSelected()`.

## TypeScript Migration

- Add `TFeatures` first: `ColumnDef<typeof features, Person>`, `Column<typeof features, Person>`, `Row<typeof features, Person>`, `Table<typeof features, Person>`.
- Replace `createColumnHelper<Person>()` with `createColumnHelper<typeof features, Person>()`; use `columnHelper.columns([...])` for nested-array inference.
- Use `StockFeatures` when `stockFeatures` is the configuration.
- Existing `TableMeta`/`ColumnMeta` declaration merging must add `TFeatures` first. Prefer per-table `tableMeta`/`columnMeta: metaHelper<...>()` slots.
- Replace global `FilterFns`, `SortFns`, `AggregationFns`, and `FilterMeta` augmentation with registry slots and `filterMeta: metaHelper<...>()`; registered keys become valid strings in column defs.
- `RowData` is restricted to records or arrays; prefer explicit object row types.

## Common Migration Failures

### HIGH: Renaming only the composable

`useTable({ getSortedRowModel: ... })` is still a v8 configuration. Move the row model and its prerequisite feature into `tableFeatures`.

### HIGH: Unwrapping refs before useTable

Pass `data`, not `data.value`, or use a getter. Preserve the reactive source.

### HIGH: Passing prototype methods bare

Use `row.getValue('name')`, not `const read = row.getValue`; shallow copies also lose methods.

### MEDIUM: JSX children as slots

For `table.Subscribe`, use `children={(atoms) => ...}` explicitly.

## Final Checklist

- [ ] `useVueTable` is replaced with `useTable`; refs/computed inputs remain reactive.
- [ ] Features, row models, and registries are in `tableFeatures`; core row model is removed.
- [ ] State reads use atoms/computed or the store intentionally; `onStateChange` is removed.
- [ ] External atom and controlled state ownership do not overlap.
- [ ] FlexRender shorthand is adopted where applicable.
- [ ] Prototype methods, pinning, sizing/resizing, sorting, row, and selection changes are audited.
- [ ] Helpers, types, meta, registries, and `RowData` use v9 shapes.
- [ ] Temporary `stockFeatures` usage has an explicit removal plan.

## API Discovery

Inspect `node_modules/@tanstack/vue-table/dist/index.d.ts` and `useTable.d.ts`; verify feature slots and exact beta APIs in `node_modules/@tanstack/table-core/dist/`. Do not reconstruct v9 from v8 memory.
