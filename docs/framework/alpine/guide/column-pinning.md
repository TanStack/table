---
title: Column Pinning (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Column Pinning](../examples/column-pinning)
- [Column Pinning Split](../examples/column-pinning-split)
- [Sticky Column Pinning](../examples/column-pinning-sticky)

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Column Pinning Setup

Here's how you set up your table to use column pinning features. Adding the column pinning feature enables the related APIs.

```ts
import {
  createTable,
  tableFeatures,
  columnPinningFeature,
} from '@tanstack/alpine-table'

const features = tableFeatures({ columnPinningFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

## Column Pinning (Alpine) Guide

TanStack Table offers state and APIs helpful for implementing column pinning features in your table UI. You can implement column pinning in multiple ways. You can either split pinned columns into their own separate tables, or you can keep all columns in the same table, but use the pinning state to order the columns correctly and use sticky CSS to pin the columns to the start or end.

`start` and `end` are logical pinning regions. In LTR languages/layouts, `start` usually corresponds to left and `end` to right. In RTL languages/layouts, `start` usually corresponds to right and `end` to left.

### How Column Pinning Affects Column Order

There are 3 table features that can reorder columns, which happen in the following order:

1. **Column Pinning** - If pinning, columns are split into start, center (unpinned), and end pinned columns.
2. Manual [Column Ordering](./column-ordering) - A manually specified column order is applied.
3. [Grouping](./grouping) - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

The only way to change the order of the pinned columns is in the `columnPinning.start` and `columnPinning.end` state itself. `columnOrder` state will only affect the order of the unpinned ("center") columns.

### Column Pinning State

Managing the `columnPinning` state is optional, and usually not necessary unless you are adding persistent state features. TanStack Table will already keep track of the column pinning state for you. Manage the `columnPinning` state just like any other table state if you need to.

In v9, the recommended way to own a state slice is with an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the pinning state without going through the component that owns the table. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available.

```ts
import { createAtom } from '@tanstack/store'
import {
  createTable,
  tableFeatures,
  columnPinningFeature,
} from '@tanstack/alpine-table'
import type { ColumnPinningState } from '@tanstack/alpine-table'

const features = tableFeatures({ columnPinningFeature })

const columnPinningAtom = createAtom<ColumnPinningState>({
  start: [],
  end: [],
})

// subscribe wherever it is needed
columnPinningAtom.subscribe(() => {
  // react to pinning changes
})

const table = createTable({
  features,
  //...
  atoms: {
    columnPinning: columnPinningAtom,
  },
  //...
})
```

Alternatively, the v8-style `state.columnPinning` plus `onColumnPinningChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const local = Alpine.reactive({
  columnPinning: { start: [], end: [] } as ColumnPinningState,
})

const table = createTable({
  features,
  //...
  state: {
    get columnPinning() {
      return local.columnPinning // connect the reactive slice back down to the table
    },
    //...
  },
  onColumnPinningChange: (updater) => {
    local.columnPinning =
      typeof updater === 'function' ? updater(local.columnPinning) : updater
  },
  //...
})
```

### Pin Columns by Default

A very common use case is to pin some columns by default. You can do this by either initializing the `columnPinning` state with the pinned columnIds, or by using the `initialState` table option:

```ts
const table = createTable({
  features,
  //...
  initialState: {
    columnPinning: {
      start: ['expand-column'],
      end: ['actions-column'],
    },
    //...
  },
  //...
})
```

### Useful Column Pinning APIs

> [!NOTE]
> These APIs are available when using `columnPinningFeature`.

There are a handful of useful Column API methods to help you implement column pinning features:

- `column.getCanPin`: Use to determine if a column can be pinned.
- `column.pin`: Use to pin a column to the start or end. Or use to unpin a column.
- `column.getIsPinned`: Use to determine where a column is pinned.
- `column.getPinnedIndex`: Use to read the column's index within its pinned column group.
- `column.getStart`: Use to provide the correct `start` CSS value for a pinned column.
- `column.getAfter`: Use to provide the correct `end` CSS value for a pinned column.
- `column.getIsLastColumn`: Use to determine if a column is the last column in its pinned group. Useful for adding a box-shadow.
- `column.getIsFirstColumn`: Use to determine if a column is the first column in its pinned group. Useful for adding a box-shadow.

Use `table.setColumnPinning` to update the pinning state directly. Use `table.resetColumnPinning` to reset to `initialState.columnPinning`, or pass `true` to clear both pinned column arrays.

```ts
table.setColumnPinning({
  start: ['firstName'],
  end: ['actions'],
})

table.resetColumnPinning()
table.resetColumnPinning(true)
```

The table instance exposes pinned column and header helpers for each region:

```ts
table.getStartLeafColumns()
table.getCenterLeafColumns()
table.getEndLeafColumns()

table.getStartVisibleLeafColumns()
table.getCenterVisibleLeafColumns()
table.getEndVisibleLeafColumns()

table.getStartHeaderGroups()
table.getCenterHeaderGroups()
table.getEndHeaderGroups()

table.getStartFooterGroups()
table.getCenterFooterGroups()
table.getEndFooterGroups()

table.getStartFlatHeaders()
table.getCenterFlatHeaders()
table.getEndFlatHeaders()

table.getStartLeafHeaders()
table.getCenterLeafHeaders()
table.getEndLeafHeaders()
```

You can also request pinned leaf columns by region with `table.getPinnedLeafColumns(position)` and visible pinned leaf columns with `table.getPinnedVisibleLeafColumns(position)`.

```ts
table.getPinnedLeafColumns('start')
table.getPinnedLeafColumns('center')
table.getPinnedLeafColumns('end')

table.getPinnedVisibleLeafColumns('start')
table.getPinnedVisibleLeafColumns('center')
table.getPinnedVisibleLeafColumns('end')
```

Use `table.getIsSomeColumnsPinned()` to check if any columns are pinned, or pass `'start'` or `'end'` to check one pinned side.

### Wiring up the pinning UI

Because Alpine does not initialize directives inside content set with `x-html`, render the header content with `x-html="FlexRender({ header })"` and attach the pin handlers to real `<button>` elements next to it. Use `x-show` to display only the relevant pin actions for a column's current pinned state.

```html
<th :colspan="header.colSpan">
  <div class="nowrap">
    <template x-if="!header.isPlaceholder">
      <span x-html="FlexRender({ header })"></span>
    </template>
  </div>
  <template x-if="!header.isPlaceholder && header.column.getCanPin()">
    <div class="pin-actions">
      <button
        x-show="header.column.getIsPinned() !== 'start'"
        @click="header.column.pin('start')"
      >
        &lt;=
      </button>
      <button
        x-show="header.column.getIsPinned()"
        @click="header.column.pin(false)"
      >
        X
      </button>
      <button
        x-show="header.column.getIsPinned() !== 'end'"
        @click="header.column.pin('end')"
      >
        =&gt;
      </button>
    </div>
  </template>
</th>
```

### Split Table Column Pinning

If you are just using sticky CSS to pin columns, you can for the most part, just render the table as you normally would with the `table.getHeaderGroups` and `row.getVisibleCells` methods.

However, if you are splitting up pinned columns into their own separate tables, you can make use of the `table.getStartHeaderGroups`, `table.getCenterHeaderGroups`, `table.getEndHeaderGroups`, `row.getStartVisibleCells`, `row.getCenterVisibleCells`, and `row.getEndVisibleCells` methods to only render the columns that are relevant to the current table.
