---
name: migrate-v8-to-v9
description: >
  Perform a complete @tanstack/react-table v8-to-v9 migration: hook and feature architecture, row-model slots, React state and subscriptions, rendering, composable tables, type helpers, and every shared API rename and semantic change. Use for migration plans, implementation, or audits. Treat useLegacyTable only as a deprecated temporary bridge.
metadata:
  type: lifecycle
  library: '@tanstack/react-table'
  library_version: '9.0.0-beta.52'
  framework: react
requires:
  - '@tanstack/table-core#migrate-v8-to-v9'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/react/guide/migrating.md'
  - 'TanStack/table:packages/react-table/src/index.ts'
  - 'TanStack/table:packages/react-table/src/legacy.ts'
  - 'TanStack/table:examples/react/basic-use-table'
---

Read `@tanstack/table-core#migrate-v8-to-v9`, `getting-started`, and `table-state`. Use this skill as the exhaustive migration checklist, not as general API documentation. Inspect the installed `src` files before writing APIs for a different v9 beta.

Framework prerequisite: React 18 or newer (`react >=18`).

## Target architecture

```tsx
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

const table = useTable({ features, columns, data })
```

Prefer explicit features as the end state. `stockFeatures` is a useful kitchen-sink migration shortcut, but bundles every stock feature. Do not target `useLegacyTable`: it is deprecated, React-only, exported from `@tanstack/react-table/legacy`, and intended only to keep an existing migration moving temporarily.

## Complete breaking-change map

### Construction and feature registration

| v8                                             | v9                                                              |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `useReactTable(options)`                       | `useTable({ ...options, features })`                            |
| Every feature bundled automatically            | Register used `*Feature` objects with `tableFeatures()`         |
| `getCoreRowModel()` option                     | Remove it; the core row model is automatic                      |
| `getFilteredRowModel()` option                 | `filteredRowModel: createFilteredRowModel()` feature slot       |
| `getSortedRowModel()` option                   | `sortedRowModel: createSortedRowModel()` feature slot           |
| `getPaginationRowModel()` option               | `paginatedRowModel: createPaginatedRowModel()` feature slot     |
| `getExpandedRowModel()` option                 | `expandedRowModel: createExpandedRowModel()` feature slot       |
| `getGroupedRowModel()` option                  | `groupedRowModel: createGroupedRowModel()` feature slot         |
| `getFacetedRowModel()` option                  | `facetedRowModel: createFacetedRowModel()` feature slot         |
| `getFacetedMinMaxValues()` option              | `facetedMinMaxValues: createFacetedMinMaxValues()` feature slot |
| `getFacetedUniqueValues()` option              | `facetedUniqueValues: createFacetedUniqueValues()` feature slot |
| `sortingFns` table option                      | `sortFns` slot in `tableFeatures()`                             |
| `filterFns` table option/factory argument      | `filterFns` slot in `tableFeatures()`                           |
| `aggregationFns` table option/factory argument | `aggregationFns` slot in `tableFeatures()`                      |
| Early-v9-beta `rowModels: { ... }`             | Named row-model slots directly in `tableFeatures()`             |

In the registry slots, register individually imported built-ins (`filterFn_includesString`, `sortFn_alphanumeric`, `aggregationFn_sum`, and so on) under their conventional keys alongside custom functions; the full `filterFns`/`sortFns`/`aggregationFns` registry objects still work but bundle every built-in.

Declare each prerequisite feature before its row-model slot in the same `tableFeatures()` call. Available stock features are `columnFilteringFeature`, `globalFilteringFeature`, `rowSortingFeature`, `rowPaginationFeature`, `rowSelectionFeature`, `rowExpandingFeature`, `rowPinningFeature`, `columnPinningFeature`, `columnVisibilityFeature`, `columnOrderingFeature`, `columnSizingFeature`, `columnResizingFeature`, `rowAggregationFeature`, `columnGroupingFeature`, and `columnFacetingFeature`. Aggregation is independent from grouping: register `rowAggregationFeature` for aggregation APIs and add `columnGroupingFeature` only for grouped rows.

### State and React subscriptions

| v8                        | v9                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `table.getState()`        | `table.state`, `table.store.state`, or `table.atoms.<slice>.get()`                                                                                     |
| Top-level `onStateChange` | Per-slice `onSortingChange`, `onPaginationChange`, etc., or `table.store.subscribe()` for all changes                                                  |
| Broad component updates   | Default `useTable` selector still subscribes to all registered state; narrow with a selector, `table.Subscribe`, or `useSelector(table.atoms.<slice>)` |
| Framework state only      | Optional writable atoms through `options.atoms`                                                                                                        |

Controlled `state` plus per-slice callbacks remains valid:

```tsx
const [sorting, setSorting] = useState<SortingState>([])
const table = useTable({
  features,
  columns,
  data,
  state: { sorting },
  onSortingChange: setSorting,
})
```

For fine-grained rendering, pass a selector as the second `useTable` argument or select closer to the consumer:

```tsx
const table = useTable(options, () => null)

<table.Subscribe selector={state => state.pagination}>
  {pagination => <span>Page {pagination.pageIndex + 1}</span>}
</table.Subscribe>
```

External atoms override the same slice in `state`; table setters write directly to them, and `table.reset()` does not reset them. Do not supply an atom, controlled value, and callback for the same slice without intentionally applying that precedence.

### Rendering and composition

- `flexRender(def, context)` still works. Prefer `<table.FlexRender cell={cell} />`, `<table.FlexRender header={header} />`, or the standalone `<FlexRender ... />` for the v9 component form.
- Use `tableOptions()` to type reusable partial option objects.
- Use `createTableHook()` only when several tables share features, row models, defaults, and registered components. It returns app-specific helpers such as `useAppTable`, `createAppColumnHelper`, and table/cell/header context hooks; it is not required for one-off tables.
- Invoke row, cell, column, header, and related methods through their instance. Their methods now live on prototypes, so destructuring, object spread, `Object.keys`, and `JSON.stringify` do not preserve/expose them. Table-instance methods are not affected.

### TypeScript and helper changes

| v8                                                             | v9                                                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `createColumnHelper<Person>()`                                 | `createColumnHelper<typeof features, Person>()`                                             |
| Plain column array                                             | Prefer `columnHelper.columns([...])` to preserve each nested column's `TValue`              |
| `ColumnDef<TData>`                                             | `ColumnDef<TFeatures, TData, TValue>`                                                       |
| `Column<TData>`                                                | `Column<TFeatures, TData, TValue>`                                                          |
| `Table<TData>` / `Row<TData>`                                  | `Table<TFeatures, TData>` / `Row<TFeatures, TData>`                                         |
| `Cell<TData, TValue>`                                          | `Cell<TFeatures, TData, TValue>`                                                            |
| Global `TableMeta<TData>` / `ColumnMeta<TData, TValue>`        | Add `TFeatures` first, or register per-table `tableMeta` / `columnMeta` with `metaHelper()` |
| Augment `FilterFns`, `SortFns`, `AggregationFns`, `FilterMeta` | Register `filterFns`, `sortFns`, `aggregationFns`, and `filterMeta` slots                   |
| `RowData = unknown`                                            | Row data must be a record or array                                                          |

Infer `TFeatures` with `typeof features`. If deliberately using `stockFeatures`, use `StockFeatures`. Do not manually propagate generics when a helper can infer them.

### Shared API and behavior changes

Column pinning now uses logical regions, with no deprecated aliases:

| v8 / pre-beta.38                                               | v9 beta.38+                                                   |
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

This is logical table positioning, not automatic DOM-direction styling. Use CSS logical inset properties for sticky layouts. `columnResizeDirection` is unchanged.

Other exact changes:

| v8                                        | v9                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| Table option `enablePinning`              | `enableColumnPinning` plus `enableRowPinning`; per-column `enablePinning` remains |
| Combined `ColumnSizing`                   | `columnSizingFeature`; add `columnResizingFeature` for interaction                |
| `columnSizingInfo`                        | `columnResizing`                                                                  |
| `setColumnSizingInfo()`                   | `setColumnResizing()`                                                             |
| `onColumnSizingInfoChange`                | `onColumnResizingChange`                                                          |
| `sortingFn`                               | `sortFn`                                                                          |
| `column.getSortingFn()`                   | `column.getSortFn()`                                                              |
| `column.getAutoSortingFn()`               | `column.getAutoSortFn()`                                                          |
| `SortingFn` / `SortingFns` / `sortingFns` | `SortFn` / `SortFns` / `sortFns`                                                  |
| `row._getAllCellsByColumnId()`            | `row.getAllCellsByColumnId()`                                                     |
| `table._getPinnedRows()`                  | `getTopRows()`, `getCenterRows()`, or `getBottomRows()`                           |
| `table._getFacetedRowModel()`             | Public faceting APIs on the relevant column/table                                 |
| `table._getFacetedMinMaxValues()`         | `getFacetedMinMaxValues()`                                                        |
| `table._getFacetedUniqueValues()`         | `getFacetedUniqueValues()`                                                        |

All other underscore-prefixed internals are removed. `getIsSomeRowsSelected()` and `getIsSomePageRowsSelected()` now mean **at least one**, including when all are selected. Compute indeterminate state with `getIsSomeRowsSelected() && !getIsAllRowsSelected()` or `getIsSomePageRowsSelected() && !getIsAllPageRowsSelected()`.

## Migration procedure

1. Upgrade imports and replace `useReactTable` with `useTable`.
2. Inventory every used state slice, table/column/row method, row model, function registry, and internal `_` API.
3. Build `tableFeatures()` with the corresponding features first, followed by row-model and registry slots; remove `getCoreRowModel`.
4. Apply every mapping above, including physical-to-logical pinning and the sizing/resizing split.
5. Add `typeof features` to helpers and explicit public types; migrate meta and function registry augmentation.
6. Replace `getState()` and `onStateChange`; choose internal, controlled per-slice, or external-atom ownership deliberately.
7. Audit destructured object methods and shallow clones of rows/cells/columns/headers.
8. Migrate rendering and optionally introduce `tableOptions`, `table.Subscribe`, or `createTableHook` where they solve an actual composition/render boundary.
9. Type-check, then exercise sorting, filtering, grouping, pagination, expansion, pinning, resizing, selection, and controlled/server-side flows that the table uses.
10. Remove `stockFeatures` after the feature audit if bundle specificity matters; remove `useLegacyTable` rather than treating it as the destination.

## Final migration checklist

- [ ] Replace `useReactTable` with `useTable`; remove any temporary `useLegacyTable` endpoint.
- [ ] Register every used stock feature explicitly and put each prerequisite before its dependent slot.
- [ ] Remove `getCoreRowModel`; move all eight optional row-model factories into `tableFeatures`.
- [ ] Move `filterFns`, `sortFns`, `aggregationFns`, and `filterMeta` into feature slots.
- [ ] Replace `table.getState()` and top-level `onStateChange`; choose selectors, per-slice callbacks, store subscription, or external atoms deliberately.
- [ ] Audit external-atom precedence/reset ownership and every controlled slice update path.
- [ ] Replace destructured, spread, serialized, or bare-callback row/cell/column/header methods.
- [ ] Replace every pinning state key, argument, comparison, method family, and sticky CSS use of left/right with start/end.
- [ ] Split `enablePinning`; split sizing/resizing and rename its state, setter, and callback.
- [ ] Apply every sorting option, method, type, interface, and built-in registry rename.
- [ ] Remove each listed underscore-prefixed internal API and use the public replacement.
- [ ] Rebuild indeterminate selection checks with the matching all-selected predicate.
- [ ] Update helpers and explicit public types for `TFeatures`; use `columns()` and `StockFeatures` where applicable.
- [ ] Update meta generics or per-table meta slots; replace function/meta augmentation with registry slots.
- [ ] Ensure `RowData` is a record or array.
- [ ] Migrate FlexRender usage; adopt `tableOptions` or `createTableHook` only where repeated composition warrants it.
- [ ] Type-check and test every enabled client/manual feature flow, including LTR/RTL pinning and resizing.
- [ ] Audit away temporary `stockFeatures` usage when explicit tree-shaking is the intended end state.

## Common migration failures

- An API is missing because its feature was not registered, not because v9 removed it.
- A row model is placed in table options or an obsolete `rowModels` object instead of its feature slot.
- A controlled value is supplied without its matching per-slice callback, freezing that slice.
- A React parent still re-renders for every table update because the default selector was retained while assuming atom reads alone narrowed it.
- An extracted `row.getValue`, `cell.getContext`, or column/header method loses `this`.
- Sticky pinning is renamed in state but not in CSS or every header/row sizing call.
- An indeterminate selection checkbox stays indeterminate when all rows are selected.

## API discovery

Inspect `node_modules/@tanstack/react-table/src/index.ts` and `node_modules/@tanstack/table-core/src/index.ts` for the installed v9 exports and types. Inspect `src/legacy.ts` only to identify temporary bridge code that remains to be removed.
