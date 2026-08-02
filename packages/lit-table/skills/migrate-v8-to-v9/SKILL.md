---
name: migrate-v8-to-v9
description: >
  Complete Lit v8-to-v9 migration reference: TableController construction, explicit features and row-model slots, selected/atom state, FlexRender, createTableHook, type generics, prototype methods, sorting, sizing, selection, and logical pinning.
metadata:
  type: lifecycle
  library: '@tanstack/lit-table'
  framework: lit
  library_version: '9.0.0-beta.70'
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/lit/guide/migrating.md'
  - 'TanStack/table:packages/lit-table/src/index.ts'
  - 'TanStack/table:examples/lit/basic-table-controller'
---

Use this as the complete breaking-change checklist. V9 is the current API. The central Lit change is a stable controller constructed with the host, while current options are passed to `.table(...)` during render.

Framework prerequisites: Lit 3.1.3 or newer within v3 (`lit ^3.1.3`) and
`@lit/context ^1.1.0`.

## Recommended Migration Order

1. Replace the v8 controller options thunk with a host-only typed `TableController`.
2. Pass current options to `controller.table(options, selector?)` in render.
3. Move features, row models, and registries into `tableFeatures`.
4. Update selected state, controlled ownership, and rendering.
5. Apply every shared API and type rename below.
6. Treat `stockFeatures` as a temporary audit bridge; explicit features are the production target.

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

class PeopleTable extends LitElement {
  private controller = new TableController<typeof features, Person>(this)

  protected render() {
    const table = this.controller.table({ features, columns, data: this.data })
    return html`<span>${table.getRowModel().rows.length} rows</span>`
  }
}
```

## Construction and Feature Registration

| v8                                         | v9                                                         |
| ------------------------------------------ | ---------------------------------------------------------- |
| `new TableController(this, () => options)` | `new TableController<typeof features, TData>(this)`        |
| `controller.table` property                | `controller.table(options, selector?)` call in render      |
| All features bundled                       | Required `features: tableFeatures({...})`                  |
| `getCoreRowModel()` option                 | Remove; core row model is automatic                        |
| `get*RowModel()` table options             | `create*RowModel()` slots in `tableFeatures`               |
| `sortingFns` table option                  | `sortFns` feature slot                                     |
| Top-level `onStateChange`                  | Per-slice callbacks, external atoms, or store subscription |

Feature imports are `cellSelectionFeature`, `columnFilteringFeature`, `globalFilteringFeature`, `rowSortingFeature`, `rowPaginationFeature`, `rowSelectionFeature`, `rowExpandingFeature`, `rowPinningFeature`, `columnPinningFeature`, `columnVisibilityFeature`, `columnOrderingFeature`, `columnSizingFeature`, `columnResizingFeature`, `rowAggregationFeature`, `columnGroupingFeature`, and `columnFacetingFeature`. APIs are feature-gated. Put a feature before its dependent slot in one `tableFeatures` call. Aggregation is independent from grouping: register `rowAggregationFeature` for aggregation APIs and add `columnGroupingFeature` only for grouped rows.

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

## Lit State Migration

- `table.getState().sorting` becomes `table.state.sorting`, `table.store.state.sorting`, or narrow `table.atoms.sorting.get()`.
- `table.state` contains all registered slices by default. Pass a second-argument selector to `controller.table(...)` only to narrow the render-selected surface.
- Use `table.subscribe(table.store, stableSelector, renderCallback)` for selected template state. Keep the selector reference stable outside render.
- Controlled state uses Lit `@state()` fields and matching `on[State]Change` callbacks that resolve value-or-function updaters.
- Top-level `onStateChange` is removed. Use per-slice callbacks, external atoms, or `table.store.subscribe` for all changes.
- External atoms come from `@tanstack/store` and are provided through `atoms`. Never provide both `atoms.pagination` and `state.pagination`.
- The controller requests host updates for table and option-store changes; do not create a new controller in render.
- Treat `table.baseAtoms` as internal writable state; prefer feature APIs or external atoms.

## Rendering and Composition

| v8                         | v9                                                                            |
| -------------------------- | ----------------------------------------------------------------------------- |
| `flexRender(def, context)` | `FlexRender({ cell })`, `FlexRender({ header })`, or `FlexRender({ footer })` |
| Standalone helper only     | `table.FlexRender({ cell })` is also available                                |
| Repeated raw options       | `tableOptions(...)` composition                                               |
| Repeated conventions       | `createTableHook({ features, ... })`                                          |

`createTableHook` returns a host-bound app table helper and pre-bound column helper. Construct the app helper with the Lit host, then call its `.table()` during render. It is optional and intended for recurring application conventions.

## Complete Shared Breaking-Change Map

### Instance methods

Row, cell, column, header, and related methods now live on shared prototypes and use `this`. Call them on their instances. Do not destructure/pass them bare or expect them in object spread, `Object.keys`, or JSON. Table methods are not affected.

### Logical column pinning

Beta.38 has no `left`/`right` aliases.

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

Prefer CSS logical inset properties; logical names do not set DOM direction. `columnResizeDirection` is unchanged.

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

- Add `TFeatures` first: `ColumnDef<typeof features, Person>`, `Column<typeof features, Person>`, `Row<typeof features, Person>`, `Table<typeof features, Person>`.
- Replace `createColumnHelper<Person>()` with `createColumnHelper<typeof features, Person>()`; use `columnHelper.columns([...])` for inference.
- Use `StockFeatures` when using `stockFeatures`.
- Existing `TableMeta`/`ColumnMeta` declaration merging must add `TFeatures` first. Prefer per-table `tableMeta`/`columnMeta: metaHelper<...>()` slots.
- Replace global `FilterFns`, `SortFns`, `AggregationFns`, and `FilterMeta` augmentation with registry slots and `filterMeta: metaHelper<...>()`; registered keys become valid strings.
- `RowData` is restricted to records or arrays; prefer explicit object row types.

## Common Migration Failures

### CRITICAL: Keeping the v8 controller shape

The controller constructor takes only the host in v9. Pass options to `.table(...)` while rendering.

### HIGH: Recreating the controller in render

Keep one stable controller field so subscriptions and host lifecycle remain attached.

### HIGH: Leaving row models on table options

Move each row model beside its prerequisite feature in `tableFeatures`.

### HIGH: Unstable table.subscribe selector

Define the selector as a class field or outside render to prevent avoidable update churn.

### HIGH: Destructuring instance methods

Use `row.getValue('name')`; prototype methods require the original instance and are absent from shallow clones.

## Final Checklist

- [ ] `TableController` is host-only, stable, typed with features/data, and options move to `.table(...)`.
- [ ] Features, row models, and registries are in `tableFeatures`; core row model is removed.
- [ ] State reads use selected state, atoms, or store intentionally; selectors are stable.
- [ ] `onStateChange` is replaced; controlled and external-atom ownership do not overlap.
- [ ] Rendering uses the v9 `FlexRender` object helpers.
- [ ] Prototype methods, pinning, sizing/resizing, sorting, row, and selection changes are audited.
- [ ] Helpers, types, meta, registries, and `RowData` use v9 shapes.
- [ ] Temporary `stockFeatures` usage has an explicit removal plan.

## API Discovery

Inspect `node_modules/@tanstack/lit-table/dist/index.d.ts` and `TableController.d.ts`. Verify feature slots and exact beta APIs in `node_modules/@tanstack/table-core/dist/`; do not reconstruct v9 from v8 memory.
