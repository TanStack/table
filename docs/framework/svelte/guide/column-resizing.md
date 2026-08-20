---
title: Column Resizing (Svelte) Guide
---

## Examples

Want to skip to the implementation? Check out these Svelte examples:

- [Column Resizing](../examples/column-resizing)
- [Performant Column Resizing](../examples/column-resizing-performant)

Use getters for reactive inputs such as `data` when passing Svelte state to `createTable`.

### Column Resizing Setup

Here's how you set up your table to use column resizing features. Column resizing depends on column sizing, so add `columnSizingFeature` before `columnResizingFeature`. Adding the column resizing feature enables the related APIs.

```ts
import {
  createTable,
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
} from '@tanstack/svelte-table'

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

## Column Resizing (Svelte) Guide

TanStack Table provides built-in column resizing state and APIs for implementing column resizing in your table UI with a variety of options for UX and performance.

Column resizing builds on column sizing. If you only need to define starting, minimum, or maximum widths, see the [Column Sizing Guide](./column-sizing).

### Enable Column Resizing

To use column resizing, add `columnSizingFeature` and then `columnResizingFeature` to your features. The `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

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
    ? `translateX(${table.atoms.columnResizing.get().deltaOffset ?? 0}px)`
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

The table instance exposes APIs for the transient resize state through `table.setColumnResizing`.

```ts
table.setColumnResizing((old) => ({
  ...old,
  deltaOffset: 12,
}))

table.resetHeaderSizeInfo()
table.resetHeaderSizeInfo(true)
```

### Advanced Column Resizing Performance

Svelte 5's fine-grained reactivity means a resize does not re-render whole components, but if every header and data cell reads `column.getSize()`, an `"onChange"` drag still invalidates a lot per frame. The [performant column resizing example](../examples/column-resizing-performant) shows how to reduce a drag to a single attribute update.

1. **Derive all column widths in one `$derived` value.** Build a single style string that maps each header and column id to a CSS variable, then bind it on the `<table>` element (`<table style={tableStyle}>`). `header.getSize()` reads the rune-backed `columnSizing` atom, so a drag re-runs only this derived and its single attribute effect.
2. **Reference the variables in cell styles** (`width: calc(var(--col-firstName-size) * 1px)`) so the browser applies new widths without Svelte re-evaluating each cell.

Because nothing in the table body reads resize state, no body memoization is needed; the resizer's highlight is its own narrow inline atom binding.
