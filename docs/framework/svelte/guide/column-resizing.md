---
title: Column Resizing (Svelte) Guide
---

## Examples

Want to skip to the implementation? Check out these Svelte examples:

- [Column Resizing](../examples/column-resizing)
- [Performant Column Resizing](../examples/column-resizing-performant)

Use getters for reactive inputs such as `data` when passing Svelte state to `createTable`.

### Svelte Setup

```ts
import { createTable, tableFeatures, columnResizingFeature } from '@tanstack/svelte-table'

const features = tableFeatures({ columnResizingFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

## Column Resizing (Svelte) Guide

TanStack Table provides built-in column resizing state and APIs that allow you to easily implement column resizing in your table UI with a variety of options for UX and performance.

Column resizing builds on column sizing. If you only need to define starting, minimum, or maximum widths, see the [Column Sizing Guide](./column-sizing).

### Enable Column Resizing

To use column resizing, add `columnResizingFeature` to your features. The `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

```ts
import {
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
  createTable,
} from '@tanstack/svelte-table'

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const columns = [
  {
    accessorKey: 'id',
    enableResizing: false, // disable resizing for just this column
    size: 200, // starting column size
  },
  //...
]

const table = createTable({
  features,
  columns,
  data,
})
```

### Column Resize Mode

By default, the column resize mode is set to `"onEnd"`. This means that the `column.getSize()` API will not return the new column size until the user has finished resizing (dragging) the column. Usually a small UI indicator will be displayed while the user is resizing the column.

Svelte's fine-grained rune-based reactivity handles column resizing updates well, but if your table is very large or your cells are expensive to render, the `"onEnd"` column resize mode can still be a good default to avoid stuttering or lagging while the user drags. With `"onChange"`, every drag movement updates the `columnSizing` and `columnResizing` state, so anything reading column sizes will be re-evaluated on every frame of the drag.

> Advanced column resizing performance tips will be discussed [down below](#advanced-column-resizing-performance).

If you want to change the column resize mode to `"onChange"` for immediate column resizing renders, you can do so with the `columnResizeMode` table option.

```ts
const table = createTable({
  //...
  columnResizeMode: 'onChange', // change column resize mode to "onChange"
})
```

### Column Resize Direction

By default, TanStack Table assumes that the table markup is laid out in a left-to-right direction. For right-to-left layouts, you may need to change the column resize direction to `"rtl"`.

```ts
const table = createTable({
  //...
  columnResizeDirection: 'rtl', // change column resize direction to "rtl" for certain locales
})
```

### Connect Column Resizing APIs to UI

There are a few really handy APIs that you can use to hook up your column resizing drag interactions to your UI.

#### Column Size APIs

To apply the size of a column to the column head cells, data cells, or footer cells, you can use the following APIs:

```ts
header.getSize()
column.getSize()
cell.column.getSize()
```

How you apply these size styles to your markup is up to you, but it is pretty common to use either CSS variables or inline styles to apply the column sizes.

```svelte
<th colSpan={header.colSpan} style:width="{header.getSize()}px">
  <!-- header content -->
</th>
```

Though, as discussed in the [advanced column resizing performance section](#advanced-column-resizing-performance), you may want to consider using CSS variables to apply column sizes to your markup.

#### Column Resize APIs

TanStack Table provides a pre-built event handler to make your drag interactions easy to implement. These event handlers are just convenience functions that call other internal APIs to update the column sizing state and re-render the table. Use `header.getResizeHandler()` to connect to your column resize drag interactions, for both mouse and touch events.

```svelte
<div
  class="resizer"
  onmousedown={header.getResizeHandler()}
  ontouchstart={header.getResizeHandler()}
></div>
```

#### Column Resize Indicator with Column Resizing State

TanStack Table keeps track of a `columnResizing` state object that you can use to render a column resize indicator UI.

```svelte
<div
  class="resize-indicator"
  style:transform={header.column.getIsResizing()
    ? `translateX(${table.state.columnResizing.deltaOffset ?? 0}px)`
    : ''}
></div>
```

The `columnResizing` state stores transient drag information:

```ts
type columnResizingState = {
  columnSizingStart: Array<[string, number]>
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  startOffset: null | number
  startSize: null | number
}
```

You rarely need to manage this transient drag state yourself, but if you do, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can observe the resize state without coupling that code to the table instance.

```ts
import { createAtom, useSelector } from '@tanstack/svelte-store'
import type { columnResizingState } from '@tanstack/svelte-table'

const columnResizingAtom = createAtom<columnResizingState>({
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
})

const columnResizing = useSelector(columnResizingAtom) // subscribe wherever it is needed

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
  atoms: {
    columnResizing: columnResizingAtom,
  },
})
```

Alternatively, the v8-style `state.columnResizing` plus `onColumnResizingChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
import { createTableState } from '@tanstack/svelte-table'
import type { columnResizingState } from '@tanstack/svelte-table'

const [columnResizing, setColumnResizing] =
  createTableState<columnResizingState>({
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
})

const table = createTable({
  features,
  columns,
  data,
  state: {
    get columnResizing() {
      return columnResizing()
    },
  },
  onColumnResizingChange: setColumnResizing,
})
```

### Column Resizing APIs

Use `header.getResizeHandler()` to connect mouse or touch events to the resizing logic. Use `column.getCanResize()` to decide whether to render a resize handle, and `column.getIsResizing()` to render active resizing UI.

```ts
header.getResizeHandler()
column.getCanResize()
column.getIsResizing()
```

The table instance exposes APIs for the transient resize state. Note that the current v9 API spelling is `table.setcolumnResizing` with a lowercase `c` in `column`; use that exact name.

```ts
table.setcolumnResizing(old => ({
  ...old,
  deltaOffset: 12,
}))

table.resetHeaderSizeInfo()
table.resetHeaderSizeInfo(true)
```

### Advanced Column Resizing Performance

If you are creating large or complex tables with Svelte, expensive cell markup can still make `"onChange"` resizing feel sluggish, even with Svelte's fine-grained reactivity, because every drag movement invalidates anything that reads column sizes.

We have created a [performant column resizing example](../examples/column-resizing-performant) that demonstrates how to achieve 60 fps column resizing with a complex table that may otherwise update slowly. It is recommended that you just look at that example to see how it is done, but these are the basic things to keep in mind:

1. Narrow the `createTable` selector to only the state your markup needs while resizing (the example selects just `columnSizing` and `columnResizing`), so unrelated state changes do not trigger updates.
2. Don't call `column.getSize()` in every header and every data cell. Instead, calculate all column widths once per sizing change (the example's `getColumnSizeVars` helper loops over `table.getFlatHeaders()` once).
3. Use CSS variables to communicate column widths to your table cells (for example, `width: calc(var(--col-firstName-size) * 1px)`). The browser then handles the width changes without Svelte re-evaluating each cell.

If you follow these steps, you should see significant performance improvements while resizing columns.
