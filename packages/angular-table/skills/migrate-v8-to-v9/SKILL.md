---
name: migrate-v8-to-v9
description: >
  Complete Angular v8-to-v9 migration reference: injectTable and injection context, explicit features and row-model slots, signal/atom state, FlexRender directives, type generics, prototype methods, sorting, sizing, selection, and logical pinning.
metadata:
  type: lifecycle
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.2.4'
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/angular/guide/migrating.md'
  - 'TanStack/table:packages/angular-table/src/index.ts'
  - 'TanStack/table:examples/angular/basic-inject-table'
---

Use this as the complete breaking-change checklist. V9 is the current API; construction, feature registration, state, rendering, and types must migrate together.

Framework prerequisite: Angular 19 or newer (`@angular/core >=19`).

## Recommended Migration Order

1. Replace `createAngularTable` with `injectTable` inside an Angular injection context.
2. Hoist static/expensive features and columns outside the reactive initializer.
3. Move features, row models, and function registries into `tableFeatures`.
4. Update signal/atom state reads and FlexRender usage.
5. Apply every shared API and type rename below.
6. Treat `stockFeatures` as a temporary audit bridge; explicit features are the production target.

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

class TableCmp {
  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }))
}
```

## Construction and Feature Registration

| v8                                  | v9                                                         |
| ----------------------------------- | ---------------------------------------------------------- |
| `createAngularTable(() => options)` | `injectTable(() => options)` in injection context          |
| All features bundled                | Required `features: tableFeatures({...})`                  |
| `getCoreRowModel()` option          | Remove; core row model is automatic                        |
| `get*RowModel()` table options      | `create*RowModel()` slots in `tableFeatures`               |
| `sortingFns` table option           | `sortFns` feature slot                                     |
| Top-level `onStateChange`           | Per-slice callbacks, external atoms, or store subscription |

The initializer reruns when signals read inside it change and calls `setOptions`; do not rebuild columns or features there.

Feature imports are `cellSelectionFeature`, `columnFilteringFeature`, `globalFilteringFeature`, `rowSortingFeature`, `rowPaginationFeature`, `rowSelectionFeature`, `rowExpandingFeature`, `rowPinningFeature`, `columnPinningFeature`, `columnVisibilityFeature`, `columnOrderingFeature`, `columnSizingFeature`, `columnResizingFeature`, `rowAggregationFeature`, `columnGroupingFeature`, and `columnFacetingFeature`. APIs are feature-gated. Put a feature before its dependent slot in the same `tableFeatures` call. Aggregation is independent from grouping: register `rowAggregationFeature` for aggregation APIs and add `columnGroupingFeature` only for grouped rows.

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

Factories take no arguments. `filterFns`, `sortFns`, and `aggregationFns` are sibling feature slots; register individually imported built-ins (`filterFn_includesString`, `sortFn_alphanumeric`, `aggregationFn_sum`) under their conventional keys. The full registry objects still work but bundle every built-in.

## Angular State Migration

- `table.getState().sorting` becomes `table.atoms.sorting.get()` for narrow signal-backed reads.
- Use `table.store.get()` only for a full flat snapshot/debug output.
- Derive selected slices with Angular `computed`; use `shallow` equality for recreated object/array slices when appropriate.
- Controlled Angular signals are read in `state` and updated through matching `on[State]Change` callbacks; resolve value-or-function updaters.
- Top-level `onStateChange` is removed. Use per-slice callbacks, external atoms, or `table.store.subscribe` for all changes.
- Prefer external atoms from `@tanstack/angular-store` through `atoms` for app-owned shared slices. Never provide both an atom and `state` for one slice.
- Treat `table.baseAtoms` as internal; prefer feature APIs or external atoms.

## Angular Rendering and Composition

- Import `FlexRender`/the current `*flexRender` directives from the adapter.
- Prefer `*flexRenderCell="cell; let value"`, `*flexRenderHeader="header; let value"`, and `*flexRenderFooter="footer; let value"`; they choose the definition and context automatically.
- General `*flexRender` supports primitives, `TemplateRef`, component types, and `flexRenderComponent(...)` wrappers.
- Column render functions run in an Angular injection context and may call `inject()` or use signals.
- Components mounted by FlexRender can call `injectFlexRenderContext()` for the render props.
- Use `flexRenderComponent(Component, { inputs, outputs, injector, bindings, directives })` for explicit component configuration; creation-time `bindings`/`directives` require the supported Angular version.
- `tableOptions(...)` composes partial options and may omit data, columns, or features until final assembly.
- `createTableHook` is optional for repeated application conventions; it returns `injectAppTable` and a feature-bound `createAppColumnHelper`.

## Complete Shared Breaking-Change Map

### Instance methods

Row, cell, column, header, and related methods now live on shared prototypes and use `this`. Call them on their instances. Do not destructure/pass them bare or expect them in object spread, `Object.keys`, or JSON. Table methods are not affected.

### Logical column pinning

V9 has no physical aliases.

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

Prefer CSS logical inset properties. Logical names do not set DOM direction. `columnResizeDirection` is unchanged.

### Pinning, sizing, and resizing

- `enablePinning` splits into `enableColumnPinning` and `enableRowPinning`.
- Interactive resizing requires `columnSizingFeature` and `columnResizingFeature`; fixed sizing needs only sizing.
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

`getIsSomeRowsSelected()` and `getIsSomePageRowsSelected()` mean at least one, including all. Use `getIsSomeRowsSelected() && !getIsAllRowsSelected()` or `getIsSomePageRowsSelected() && !getIsAllPageRowsSelected()` for indeterminate UI.

## TypeScript Migration

- Most types add `TFeatures` first: `Column<TFeatures, TData, TValue>`, `ColumnDef<TFeatures, TData, TValue>`, `Table<TFeatures, TData>`, `Row<TFeatures, TData>`, and `Cell<TFeatures, TData, TValue>`.
- Replace `createColumnHelper<Person>()` with `createColumnHelper<typeof features, Person>()`; use `columnHelper.columns([...])` for inference.
- A `createTableHook` column helper already binds features and needs only `<Person>`.
- Use `StockFeatures` when using `stockFeatures`.
- Existing `TableMeta`/`ColumnMeta` declaration merging must add `TFeatures` first. Prefer per-table meta slots using `metaHelper`.
- Replace global `FilterFns`, `SortFns`, `AggregationFns`, and `FilterMeta` augmentation with registry slots and `filterMeta`; registered keys become typed string references.
- `RowData` is now `Record<string, any> | Array<any>` rather than `unknown`.

## Common Migration Failures

### CRITICAL: Calling injectTable outside injection context

Create it in a component/directive/service field initializer or another valid Angular injection context so ownership and cleanup bind correctly.

### HIGH: Rebuilding static inputs reactively

Hoist `features` and `columns`; the initializer reruns for tracked signals.

### HIGH: Leaving row models on table options

Move each row model beside its prerequisite feature in `tableFeatures`.

### HIGH: Destructuring instance methods

Use `row.getValue('name')`; prototype methods require the original instance and are absent from shallow clones.

## Final Checklist

- [ ] `createAngularTable` is replaced by `injectTable` in injection context.
- [ ] Static inputs are stable outside the signal-tracked initializer.
- [ ] Features, row models, and registries are in `tableFeatures`; core row model is removed.
- [ ] State reads use atom-backed signals or store intentionally; `onStateChange` is gone.
- [ ] Controlled state and external atom ownership do not overlap.
- [ ] FlexRender directives/helpers are migrated and imported.
- [ ] Prototype methods, pinning, sizing/resizing, sorting, row, and selection changes are audited.
- [ ] Helpers, types, meta, registries, and `RowData` use v9 shapes.
- [ ] Temporary `stockFeatures` usage has an explicit removal plan.

## API Discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for the bundled public API; do not reconstruct v9 from v8 memory.
