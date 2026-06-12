---
title: Column Pinning (Vue) Guide
---

## Examples

Want to skip to the implementation? Check out these Vue examples:

- [Column Pinning](../examples/column-pinning)
- [Column Pinning Split](../examples/column-pinning-split)
- [Sticky Column Pinning](../examples/column-pinning-sticky)

Vue refs can be passed directly where the adapter expects reactive table options.

### Vue Setup

```ts
import { useTable, tableFeatures, columnPinningFeature } from '@tanstack/vue-table'

const features = tableFeatures({ columnPinningFeature })

const table = useTable({
  features,
  columns,
  data,
})
```

## Column Pinning (Vue) Guide

TanStack Table offers state and APIs helpful for implementing column pinning features in your table UI. You can implement column pinning in multiple ways. You can either split pinned columns into their own separate tables, or you can keep all columns in the same table, but use the pinning state to order the columns correctly and use sticky CSS to pin the columns to the left or right.

### How Column Pinning Affects Column Order

There are 3 table features that can reorder columns, which happen in the following order:

1. **Column Pinning** - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2. Manual [Column Ordering](./column-ordering) - A manually specified column order is applied.
3. [Grouping](./grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

The only way to change the order of the pinned columns is in the `columnPinning.left` and `columnPinning.right` state itself. `columnOrder` state will only affect the order of the unpinned ("center") columns.

### Column Pinning State

Managing the `columnPinning` state is optional, and usually not necessary unless you are adding persistent state features. TanStack Table will already keep track of the column pinning state for you. Manage the `columnPinning` state just like any other table state if you need to.

In v9, the recommended way to own a state slice is with an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the pinning state without depending on the table instance.

```ts
import { createAtom, useSelector } from '@tanstack/vue-store'
import { useTable, tableFeatures, columnPinningFeature } from '@tanstack/vue-table'
import type { ColumnPinningState } from '@tanstack/vue-table'

const features = tableFeatures({ columnPinningFeature })

const columnPinningAtom = createAtom<ColumnPinningState>({
  left: [],
  right: [],
})

const columnPinning = useSelector(columnPinningAtom) // subscribe wherever it is needed (a Vue ref)

const table = useTable({
  features,
  //...
  atoms: {
    columnPinning: columnPinningAtom,
  },
  //...
})
```

Alternatively, the v8-style `state.columnPinning` plus `onColumnPinningChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. Pass the current ref value through a getter so the adapter can track it. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const columnPinning = ref<ColumnPinningState>({
  left: [],
  right: [],
})

const table = useTable({
  features,
  //...
  state: {
    get columnPinning() {
      return columnPinning.value
    },
    //...
  },
  onColumnPinningChange: (updater) => {
    columnPinning.value = updater instanceof Function ? updater(columnPinning.value) : updater
  },
  //...
})
```

### Pin Columns by Default

A very common use case is to pin some columns by default. You can do this by either initializing the `columnPinning` state with the pinned columnIds, or by using the `initialState` table option

```ts
const table = useTable({
  features,
  //...
  initialState: {
    columnPinning: {
      left: ['expand-column'],
      right: ['actions-column'],
    },
    //...
  },
  //...
})
```

### Useful Column Pinning APIs

> Note: These APIs are available when using `columnPinningFeature`.

There are a handful of useful Column API methods to help you implement column pinning features:

- `column.getCanPin`: Use to determine if a column can be pinned.
- `column.pin`: Use to pin a column to the left or right. Or use to unpin a column.
- `column.getIsPinned`: Use to determine where a column is pinned.
- `column.getPinnedIndex`: Use to read the column's index within its pinned column group.
- `column.getStart`: Use to provide the correct `left` CSS value for a pinned column.
- `column.getAfter`: Use to provide the correct `right` CSS value for a pinned column.
- `column.getIsLastColumn`: Use to determine if a column is the last column in its pinned group. Useful for adding a box-shadow.
- `column.getIsFirstColumn`: Use to determine if a column is the first column in its pinned group. Useful for adding a box-shadow.

Use `table.setColumnPinning` to update the pinning state directly. Use `table.resetColumnPinning` to reset to `initialState.columnPinning`, or pass `true` to clear both pinned column arrays.

```ts
table.setColumnPinning({
  left: ['firstName'],
  right: ['actions'],
})

table.resetColumnPinning()
table.resetColumnPinning(true)
```

The table instance exposes pinned column and header helpers for each region:

```ts
table.getLeftLeafColumns()
table.getCenterLeafColumns()
table.getRightLeafColumns()

table.getLeftVisibleLeafColumns()
table.getCenterVisibleLeafColumns()
table.getRightVisibleLeafColumns()

table.getLeftHeaderGroups()
table.getCenterHeaderGroups()
table.getRightHeaderGroups()

table.getLeftFooterGroups()
table.getCenterFooterGroups()
table.getRightFooterGroups()

table.getLeftFlatHeaders()
table.getCenterFlatHeaders()
table.getRightFlatHeaders()

table.getLeftLeafHeaders()
table.getCenterLeafHeaders()
table.getRightLeafHeaders()
```

You can also request pinned leaf columns by region with `table.getPinnedLeafColumns(position)` and visible pinned leaf columns with `table.getPinnedVisibleLeafColumns(position)`.

```ts
table.getPinnedLeafColumns('left')
table.getPinnedLeafColumns('center')
table.getPinnedLeafColumns('right')

table.getPinnedVisibleLeafColumns('left')
table.getPinnedVisibleLeafColumns('center')
table.getPinnedVisibleLeafColumns('right')
```

Use `table.getIsSomeColumnsPinned()` to check if any columns are pinned, or pass `'left'` or `'right'` to check one pinned side.

### Split Table Column Pinning

If you are just using sticky CSS to pin columns, you can for the most part, just render the table as you normally would with the `table.getHeaderGroups` and `row.getVisibleCells` methods.

However, if you are splitting up pinned columns into their own separate tables, you can make use of the `table.getLeftHeaderGroups`, `table.getCenterHeaderGroups`, `table.getRightHeaderGroups`, `row.getLeftVisibleCells`, `row.getCenterVisibleCells`, and `row.getRightVisibleCells` methods to only render the columns that are relevant to the current table.
