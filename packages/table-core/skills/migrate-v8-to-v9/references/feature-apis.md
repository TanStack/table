# Feature API migration mappings

Read the affected sections when migrating aggregation, pinning, sizing/resizing, sorting, or row-selection interactions.

## Aggregation

Aggregation is independent from grouping. Add `rowAggregationFeature` for
`aggregationFn`, `aggregatedCell`, `column.getAggregationValue(options?)`, and
`cell.getIsAggregated`. A root total does not require grouping. Convert legacy
custom callables `(columnId, leafRows, childRows) => result` to
`constructAggregationFn({ aggregate: (context) => result, merge? })`
definitions. Replace `column.getAggregationFn()` with
`column.getAggregationFns()`; arrays in `aggregationFn` return keyed objects.
Replace the old `AggregationFn` and `CreatedAggregationFn` types with
`AggregationFnDef`. Aggregation row selection is shared across every definition
on a column: `maxAggregationDepth` defaults to `0`, while `1` selects direct
sub-rows and `Infinity` selects terminal rows. Explicit totals can override it
with the single object signature
`column.getAggregationValue({ rows, maxDepth })`; positional row and depth
arguments are not supported. All built-ins consume the same selected `rows`.
Custom definitions can inspect grouped `subRows`, and `merge` receives matching
`subRowResults`. Use `table.getMaxSubRowDepth()` when a depth should derive from
the deepest structural row in the core model.

## Replace physical column pinning with logical pinning

V9 has no `left`/`right` aliases. Replace all state keys, return-value comparisons, arguments, and API families:

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

## Split column sizing from resizing

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

## Rename sorting APIs

| V8                          | V9                       |
| --------------------------- | ------------------------ |
| column-def `sortingFn`      | `sortFn`                 |
| `column.getSortingFn()`     | `column.getSortFn()`     |
| `column.getAutoSortingFn()` | `column.getAutoSortFn()` |
| `SortingFn`                 | `SortFn`                 |
| `SortingFns`                | `SortFns`                |
| built-in `sortingFns`       | `sortFns`                |

Also move the registry to `tableFeatures`, as described above.

## Split the table-level pinning switch

Replace the v8 table option `enablePinning` with `enableColumnPinning` and/or `enableRowPinning`. Do not mechanically rename a column definition's `enablePinning`: that column-level option still exists.

## Update row-selection predicates

`getIsSomeRowsSelected()` and `getIsSomePageRowsSelected()` now mean **at least one**, including the all-selected case. They no longer mean "some but not all." Build an indeterminate checkbox with both predicates:

```ts
const indeterminate =
  table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
```

For a page checkbox, use `table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()`.

## Installed API discovery

Inspect the affected `node_modules/@tanstack/table-core/dist/features/<feature>/` declarations for exact options and methods. The feature architecture skill routes to detailed behavior references when the migrated interaction needs repair.

## Sources

- `TanStack/table:docs/framework/react/guide/migrating.md`
- `TanStack/table:docs/framework/preact/guide/migrating.md`
- `TanStack/table:docs/framework/solid/guide/migrating.md`
- `TanStack/table:docs/framework/svelte/guide/migrating.md`
- `TanStack/table:docs/framework/vue/guide/migrating.md`
- `TanStack/table:docs/framework/angular/guide/migrating.md`
- `TanStack/table:docs/framework/lit/guide/migrating.md`
- `TanStack/table:packages/table-core/src/index.ts`
- `TanStack/table:packages/table-core/src/types/TableFeatures.ts`
- `TanStack/table:packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts`
- `TanStack/table:packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts`
- `TanStack/table:packages/react-table/src/legacy.ts`
