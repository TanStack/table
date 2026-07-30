---
name: migrate-v8-to-v9
description: >
  Perform a complete @tanstack/solid-table v8-to-v9 migration: createTable, explicit features and row-model slots, getter-based Solid reactivity, atom state, rendering, composable tables, type helpers, and every shared API rename and semantic change. Use for migration plans, implementation, or audits.
metadata:
  type: lifecycle
  library: '@tanstack/solid-table'
  library_version: '9.0.0-beta.61'
  framework: solid
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/solid/guide/migrating.md'
  - 'TanStack/table:packages/solid-table/src/index.tsx'
  - 'TanStack/table:examples/solid/basic-use-table'
---

Read `@tanstack/table-core#migrate-v8-to-v9`, `getting-started`, and `table-state`. Use this as the exhaustive Solid migration checklist. Check the installed declarations before emitting APIs for another beta.

Framework prerequisite: Solid 1.3 or newer (`solid-js >=1.3`).

## Target architecture

```tsx
import {
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/solid-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

Keep static features and columns outside reactive component work. Prefer explicit features as the end state; `stockFeatures` is a kitchen-sink migration shortcut.

## Complete breaking-change map

### Construction and feature registration

| v8                                                        | v9                                                      |
| --------------------------------------------------------- | ------------------------------------------------------- |
| `createSolidTable(options)`                               | `createTable({ ...options, features })`                 |
| Every feature bundled                                     | Register used `*Feature` objects with `tableFeatures()` |
| `getCoreRowModel()` option                                | Remove it; core is automatic                            |
| `getFilteredRowModel()`                                   | `filteredRowModel: createFilteredRowModel()`            |
| `getSortedRowModel()`                                     | `sortedRowModel: createSortedRowModel()`                |
| `getPaginationRowModel()`                                 | `paginatedRowModel: createPaginatedRowModel()`          |
| `getExpandedRowModel()`                                   | `expandedRowModel: createExpandedRowModel()`            |
| `getGroupedRowModel()`                                    | `groupedRowModel: createGroupedRowModel()`              |
| `getFacetedRowModel()`                                    | `facetedRowModel: createFacetedRowModel()`              |
| `getFacetedMinMaxValues()`                                | `facetedMinMaxValues: createFacetedMinMaxValues()`      |
| `getFacetedUniqueValues()`                                | `facetedUniqueValues: createFacetedUniqueValues()`      |
| Table/factory `sortingFns`, `filterFns`, `aggregationFns` | `sortFns`, `filterFns`, `aggregationFns` feature slots  |
| Early-beta `rowModels: { ... }`                           | Direct named slots in `tableFeatures()`                 |

In the registry slots, register individually imported built-ins (`filterFn_includesString`, `sortFn_alphanumeric`, `aggregationFn_sum`, and so on) under their conventional keys alongside custom functions; the full `filterFns`/`sortFns`/`aggregationFns` registry objects still work but bundle every built-in.

Place each prerequisite feature before its row-model slot. Stock features are `columnFilteringFeature`, `globalFilteringFeature`, `rowSortingFeature`, `rowPaginationFeature`, `rowSelectionFeature`, `rowExpandingFeature`, `rowPinningFeature`, `columnPinningFeature`, `columnVisibilityFeature`, `columnOrderingFeature`, `columnSizingFeature`, `columnResizingFeature`, `rowAggregationFeature`, `columnGroupingFeature`, and `columnFacetingFeature`. Aggregation is independent from grouping: register `rowAggregationFeature` for aggregation APIs and add `columnGroupingFeature` only for grouped rows.

### Solid state and reactivity

| v8                             | v9                                                                          |
| ------------------------------ | --------------------------------------------------------------------------- |
| `table.getState()`             | `table.atoms.<slice>.get()` in tracked scopes, or broad `table.store.get()` |
| Top-level `onStateChange`      | Per-slice callbacks or `table.store.subscribe()`                            |
| Eager signal values in options | Getters for reactive `data` and controlled state slices                     |
| Whole-state rendering          | Narrow atom reads, `createMemo`, or `table.Subscribe`                       |

```tsx
const [sorting, setSorting] = createSignal<SortingState>([])
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  state: {
    get sorting() {
      return sorting()
    },
  },
  onSortingChange: setSorting,
})
```

`table.Subscribe` passes atoms to its child. A Solid component child body is untracked, so read atoms inside JSX expressions or a thunk invoked by JSX:

```tsx
<table.Subscribe>
  {(atoms) => <span>Page {atoms.pagination.get().pageIndex + 1}</span>}
</table.Subscribe>
```

Use `createAtom`/`useSelector` from `@tanstack/solid-store` for externally owned slices. An external atom wins over `state` for the same slice; do not combine ownership models accidentally.

### Rendering and composition

- Replace `flexRender(def, context)` with `<FlexRender header={header} />` or `<table.FlexRender cell={cell} />`.
- Use `tableOptions()` for typed reusable option fragments.
- Use `createTableHook({ features, ...defaults })` for repeated conventions; it returns helpers such as `createAppTable` and `createAppColumnHelper`.
- Invoke row/cell/column/header methods through their instance. Prototype methods lose `this` when extracted and are absent from object spread, `Object.keys`, and JSON. Table-instance methods are not affected.

### TypeScript and helper changes

| v8                                                                             | v9                                                                               |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `createColumnHelper<Person>()`                                                 | `createColumnHelper<typeof features, Person>()`                                  |
| Plain nested column arrays                                                     | `columnHelper.columns([...])` for `TValue` inference                             |
| `ColumnDef<TData>`                                                             | `ColumnDef<TFeatures, TData, TValue>`                                            |
| `Column<TData>`, `Row<TData>`, `Table<TData>`                                  | Add `TFeatures` first                                                            |
| `Cell<TData, TValue>`                                                          | `Cell<TFeatures, TData, TValue>`                                                 |
| `TableMeta<TData>` / `ColumnMeta<TData, TValue>`                               | Add `TFeatures`, or use per-table `tableMeta` / `columnMeta` with `metaHelper()` |
| Global `FilterFns`, `SortFns`, `AggregationFns`, and `FilterMeta` augmentation | `filterFns`, `sortFns`, `aggregationFns`, and `filterMeta` slots                 |
| `RowData = unknown`                                                            | Record or array row data                                                         |

Infer with `typeof features`; use `StockFeatures` only when deliberately typing `stockFeatures`.

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

Logical pinning does not implement DOM direction styling; use logical CSS insets. `columnResizeDirection` is unchanged.

| v8                                              | v9                                                                         |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| Table `enablePinning`                           | `enableColumnPinning` plus `enableRowPinning`; column-level option remains |
| Combined sizing/resizing                        | `columnSizingFeature`; add `columnResizingFeature` for interaction         |
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

All other underscore-prefixed internals are removed. `getIsSomeRowsSelected()` and `getIsSomePageRowsSelected()` now mean at least one even when all are selected. Use `getIsSomeRowsSelected() && !getIsAllRowsSelected()` or `getIsSomePageRowsSelected() && !getIsAllPageRowsSelected()` for checkbox indeterminate state.

## Migration procedure

1. Replace `createSolidTable` with `createTable` and inventory used features, processing, state, and APIs.
2. Build `tableFeatures()` in prerequisite order; remove `getCoreRowModel` and old/early-beta row-model placement.
3. Apply all pinning, sizing, sorting, row, and selection mappings above.
4. Update helpers/types with `typeof features`; migrate meta and function augmentation to per-feature slots where appropriate.
5. Preserve Solid tracking with getters for `data` and controlled state; replace `getState()` and `onStateChange`.
6. Choose internal, controlled-signal, or external-atom ownership per slice.
7. Replace unbound row/cell/column/header methods and migrate rendering.
8. Add `tableOptions`, `table.Subscribe`, or `createTableHook` only where composition or fine-grained rendering calls for them.
9. Type-check and exercise every enabled client- and server-side flow.
10. Audit away `stockFeatures` when production tree-shaking matters.

## Final migration checklist

- [ ] Replace createSolidTable with createTable and preserve reactive inputs through getters.
- [ ] Register every used stock feature explicitly and order prerequisites before slots.
- [ ] Remove `getCoreRowModel`; move all eight optional row models into `tableFeatures`.
- [ ] Move `filterFns`, `sortFns`, `aggregationFns`, and `filterMeta` into feature slots.
- [ ] Replace `table.getState()` and onStateChange with tracked atom/store reads, per-slice callbacks, subscriptions, or external atoms.
- [ ] Audit Solid tracking scopes, controlled getters, atom precedence, and reset ownership.
- [ ] Replace unbound/copied row, cell, column, and header methods.
- [ ] Apply the complete logical pinning map and CSS changes.
- [ ] Split pinning options and sizing/resizing; rename the resizing state, setter, and callback.
- [ ] Apply every sorting rename and remove each listed internal API.
- [ ] Pair some-selected with the matching all-selected predicate.
- [ ] Update TFeatures helpers/types, `columns()`, `StockFeatures`, meta/registry slots, and RowData.
- [ ] Migrate Solid FlexRender and use tableOptions/createTableHook only for repeated conventions.
- [ ] Type-check and exercise every enabled client/manual feature and LTR/RTL layout flow.
- [ ] Audit away temporary stockFeatures usage when explicit tree-shaking is intended.

## Common migration failures

- Calling `createTable({ data: data() })` and freezing the initial array instead of providing a getter.
- Leaving row models in table options or omitting their prerequisite feature.
- Reading atoms in an untracked component child body and expecting Solid updates.
- Supplying controlled state without getter properties or per-slice callbacks.
- Destructuring prototype-backed object methods.
- Updating pinning state names but not CSS and region APIs.
- Treating changed “some selected” semantics as checkbox indeterminate state.

## API discovery

Inspect `node_modules/@tanstack/solid-table/dist/index.d.ts` and `node_modules/@tanstack/table-core/dist/index.d.ts`. Compare v8 names only against the migration guide, not current main-branch assumptions.
