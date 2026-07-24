---
name: migrate-v8-to-v9
description: >
  Perform a complete Preact TanStack Table v8-to-v9 migration: remove React-through-preact/compat usage, adopt the native adapter, explicit features and row-model slots, Preact state and atoms, rendering, composition, types, and every shared API rename and semantic change. Use for migration plans, implementation, or audits.
metadata:
  type: lifecycle
  library: '@tanstack/preact-table'
  library_version: '9.0.0-beta.56'
  framework: preact
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/preact/guide/migrating.md'
  - 'TanStack/table:packages/preact-table/src/index.ts'
  - 'TanStack/table:examples/preact/basic-use-table'
---

Read `@tanstack/table-core#migrate-v8-to-v9`, `getting-started`, and `table-state`. Use this as the exhaustive Preact migration checklist. Verify exact APIs in the installed declarations before assuming another v9 beta has the same surface.

Framework prerequisite: Preact 10 or newer (`preact >=10`).

## Target architecture

```tsx
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
const table = useTable({ features, columns, data })
```

V8 did not have a first-party Preact adapter; many Preact apps used `@tanstack/react-table` through `preact/compat`. V9 uses native `@tanstack/preact-table`. Remove compatibility aliases that existed only for Table after replacing the imports. Prefer explicit features as the end state; `stockFeatures` is only a kitchen-sink migration shortcut.

## Complete breaking-change map

### Adapter, construction, and features

| v8                                                        | v9                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| `@tanstack/react-table` through `preact/compat`           | Native `@tanstack/preact-table`                                     |
| `useReactTable(options)`                                  | `useTable({ ...options, features })`                                |
| Every feature bundled                                     | Register used `*Feature` objects with `tableFeatures()`             |
| `getCoreRowModel()` option                                | Remove it; core is automatic                                        |
| `getFilteredRowModel()`                                   | `filteredRowModel: createFilteredRowModel()`                        |
| `getSortedRowModel()`                                     | `sortedRowModel: createSortedRowModel()`                            |
| `getPaginationRowModel()`                                 | `paginatedRowModel: createPaginatedRowModel()`                      |
| `getExpandedRowModel()`                                   | `expandedRowModel: createExpandedRowModel()`                        |
| `getGroupedRowModel()`                                    | `groupedRowModel: createGroupedRowModel()`                          |
| `getFacetedRowModel()`                                    | `facetedRowModel: createFacetedRowModel()`                          |
| `getFacetedMinMaxValues()`                                | `facetedMinMaxValues: createFacetedMinMaxValues()`                  |
| `getFacetedUniqueValues()`                                | `facetedUniqueValues: createFacetedUniqueValues()`                  |
| Table/factory `sortingFns`, `filterFns`, `aggregationFns` | `sortFns`, `filterFns`, `aggregationFns` slots in `tableFeatures()` |
| Early-beta `rowModels: { ... }`                           | Direct named slots in `tableFeatures()`                             |

In the registry slots, register individually imported built-ins (`filterFn_includesString`, `sortFn_alphanumeric`, `aggregationFn_sum`, and so on) under their conventional keys alongside custom functions; the full `filterFns`/`sortFns`/`aggregationFns` registry objects still work but bundle every built-in.

Register each prerequisite feature before its row-model slot. Stock features are `columnFilteringFeature`, `globalFilteringFeature`, `rowSortingFeature`, `rowPaginationFeature`, `rowSelectionFeature`, `rowExpandingFeature`, `rowPinningFeature`, `columnPinningFeature`, `columnVisibilityFeature`, `columnOrderingFeature`, `columnSizingFeature`, `columnResizingFeature`, `rowAggregationFeature`, `columnGroupingFeature`, and `columnFacetingFeature`. Aggregation is independent from grouping: register `rowAggregationFeature` for aggregation APIs and add `columnGroupingFeature` only for grouped rows.

### Preact state and subscriptions

| v8                          | v9                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `table.getState()`          | Reactive `table.state`, snapshot `table.store.state`, or `table.atoms.<slice>.get()` |
| Top-level `onStateChange`   | Per-slice callbacks or `table.store.subscribe()`                                     |
| Whole-component state reads | Custom second-argument selector, `table.Subscribe`, or atom source                   |

The default `useTable` selector subscribes the component to all registered state. Pass a selector for `table.state`, or `() => null` and subscribe lower:

```tsx
const table = useTable(options, () => null)

<table.Subscribe source={table.atoms.rowSelection}>
  {selection => <span>{Object.keys(selection).length} selected</span>}
</table.Subscribe>
```

Controlled `state` plus per-slice `on[State]Change` remains supported. For app-owned atoms, use `useCreateAtom`/`useSelector` from `@tanstack/preact-store` and pass them through `options.atoms`. An external atom wins over `state` for the same slice; do not mirror both ownership models.

### Rendering and composition

- Replace React-adapter `flexRender(def, context)` with `<table.FlexRender cell={cell} />` or standalone `<FlexRender ... />`; the function remains for advanced cases.
- Use `tableOptions()` for typed reusable option fragments.
- Use `createTableHook({ features, ...defaults })` for repeated app table conventions; it returns native app helpers such as `useAppTable` and `createAppColumnHelper`.
- Call row/cell/column/header methods on their instance. Prototype methods lose `this` when destructured and do not appear in object spread, `Object.keys`, or JSON. Table-instance methods are not affected.

### TypeScript and helpers

| v8                                                                             | v9                                                                                     |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `createColumnHelper<Person>()`                                                 | `createColumnHelper<typeof features, Person>()`                                        |
| Plain arrays that widen nested values                                          | `columnHelper.columns([...])`                                                          |
| `ColumnDef<TData>`                                                             | `ColumnDef<TFeatures, TData, TValue>`                                                  |
| `Column<TData>`, `Row<TData>`, `Table<TData>`                                  | Add `TFeatures` first                                                                  |
| `Cell<TData, TValue>`                                                          | `Cell<TFeatures, TData, TValue>`                                                       |
| React module augmentation                                                      | Target `@tanstack/preact-table`                                                        |
| `TableMeta<TData>` / `ColumnMeta<TData, TValue>`                               | Add `TFeatures`, or use per-table `tableMeta` / `columnMeta` slots with `metaHelper()` |
| Global `FilterFns`, `SortFns`, `AggregationFns`, and `FilterMeta` augmentation | `filterFns`, `sortFns`, `aggregationFns`, and `filterMeta` feature slots               |
| `RowData = unknown`                                                            | Record or array row data                                                               |

Infer with `typeof features`; use `StockFeatures` only for deliberate `stockFeatures` typing.

### Shared API and semantic changes

| v8 / pre-beta.38 pinning                                       | v9 beta.38+                                                   |
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

Logical pinning does not style DOM direction automatically; use logical CSS insets. `columnResizeDirection` is unchanged.

| v8                                              | v9                                                                         |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| Table `enablePinning`                           | `enableColumnPinning` plus `enableRowPinning`; column-level option remains |
| Combined sizing/resizing                        | `columnSizingFeature` plus `columnResizingFeature` for drag resizing       |
| `columnSizingInfo` / `onColumnSizingInfoChange` | `columnResizing` / `onColumnResizingChange`                                |
| `setColumnSizingInfo()`                         | `setColumnResizing()`                                                      |
| `sortingFn` / `sortingFns`                      | `sortFn` / `sortFns`                                                       |
| `getSortingFn()` / `getAutoSortingFn()`         | `getSortFn()` / `getAutoSortFn()`                                          |
| `SortingFn` / `SortingFns`                      | `SortFn` / `SortFns`                                                       |
| `row._getAllCellsByColumnId()`                  | `row.getAllCellsByColumnId()`                                              |
| `table._getPinnedRows()`                        | `getTopRows()`, `getCenterRows()`, or `getBottomRows()`                    |
| `table._getFacetedRowModel()`                   | Public faceting APIs on the relevant column/table                          |
| `table._getFacetedMinMaxValues()`               | `getFacetedMinMaxValues()`                                                 |
| `table._getFacetedUniqueValues()`               | `getFacetedUniqueValues()`                                                 |

All other underscore-prefixed internals are removed. `getIsSomeRowsSelected()` and `getIsSomePageRowsSelected()` now stay true when all applicable rows are selected. Use `getIsSomeRowsSelected() && !getIsAllRowsSelected()` or `getIsSomePageRowsSelected() && !getIsAllPageRowsSelected()` for indeterminate UI.

## Migration procedure

1. Replace React adapter imports and `useReactTable`; remove Table-only `preact/compat` configuration.
2. Inventory used features, row models, registries, state slices, methods, and `_` internals.
3. Build `tableFeatures()` in prerequisite order; remove `getCoreRowModel` and old/early-beta row-model placement.
4. Apply all pinning, sizing, sorting, row, and selection mappings above.
5. Update helpers/types with `typeof features`, retarget augmentation, and prefer feature registry/meta slots.
6. Replace `getState()`/`onStateChange`; explicitly choose internal, per-slice controlled, or external-atom ownership.
7. Replace unbound row/cell/column/header methods and migrate rendering.
8. Add `tableOptions`, subscriptions, or `createTableHook` only where reusable composition or render isolation needs them.
9. Type-check and exercise every enabled client- and server-side flow.
10. Audit away `stockFeatures` if the production table should remain tree-shakable.

## Final migration checklist

- [ ] Replace React-adapter imports/useReactTable with native Preact imports/useTable and remove Table-only compat aliases.
- [ ] Register every used stock feature explicitly and put prerequisites before dependent slots.
- [ ] Remove `getCoreRowModel`; move all eight optional row-model factories into `tableFeatures`.
- [ ] Move `filterFns`, `sortFns`, `aggregationFns`, and `filterMeta` into feature slots.
- [ ] Replace `table.getState()` and top-level `onStateChange`; choose Preact selectors, Subscribe, per-slice callbacks, store subscription, or external atoms.
- [ ] Audit controlled/external ownership and atom precedence.
- [ ] Replace unbound or copied row/cell/column/header methods.
- [ ] Apply the entire left/right to start/end pinning map and logical sticky CSS.
- [ ] Split pinning options and sizing/resizing; rename resizing state, setter, and callback.
- [ ] Apply every sorting option/API/type/registry rename.
- [ ] Remove all listed underscore-prefixed internals and use public replacements.
- [ ] Pair each some-selected check with its all-selected predicate for indeterminate UI.
- [ ] Update TFeatures helpers/types, `columns()`, `StockFeatures`, meta slots, registries, and RowData.
- [ ] Migrate Preact FlexRender and adopt tableOptions/createTableHook only where useful.
- [ ] Type-check and test every enabled client/manual feature plus LTR/RTL layout behavior.
- [ ] Remove temporary stockFeatures after the explicit-feature audit when tree-shaking matters.

## Common migration failures

- Keeping React imports or compatibility aliases after adopting the native Preact adapter.
- Registering a row model without its feature, or leaving it on table options.
- Assuming `table.atoms` narrows parent renders while the default full selector is still active.
- Supplying controlled state without its per-slice change handler.
- Destructuring prototype-backed methods.
- Renaming pinning state without updating sticky CSS and all region APIs.
- Using the changed “some selected” semantics directly as checkbox indeterminate state.

## API discovery

Inspect `node_modules/@tanstack/preact-table/dist/index.d.ts` and `node_modules/@tanstack/table-core/dist/index.d.ts`. Do not copy React adapter APIs merely because the v8 app used `preact/compat`.
