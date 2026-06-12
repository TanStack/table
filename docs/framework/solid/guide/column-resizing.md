---
title: Column Resizing (Solid) Guide
---

## Examples

Want to skip to the implementation? Check out these Solid examples:

- [Column Resizing](../examples/column-resizing)
- [Performant Column Resizing](../examples/column-resizing-performant)

Use getters for reactive inputs such as `data` when passing Solid signals to `createTable`.

### Solid Setup

```tsx
import { createTable, tableFeatures, columnResizingFeature } from '@tanstack/solid-table'

const features = tableFeatures({ columnResizingFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

## Column Resizing (Solid) Guide

TanStack Table provides built-in column resizing state and APIs that allow you to easily implement column resizing in your table UI with a variety of options for UX and performance.

Column resizing builds on column sizing. If you only need to define starting, minimum, or maximum widths, see the [Column Sizing Guide](./column-sizing).

### Enable Column Resizing

To use column resizing, add `columnResizingFeature` to your features. The `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

```tsx
import {
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
  createTable,
} from '@tanstack/solid-table'

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

The `"onEnd"` default exists because immediate resize updates can be expensive in large or complex tables: every drag movement updates the `columnSizing` state, and anything that reads column widths recomputes. Solid's fine-grained reactivity helps here, since only the computations that actually read the sizing state re-run, but if every header and cell reads `column.getSize()` directly, a complex table can still stutter during an `"onChange"` drag. The `"onEnd"` mode sidesteps this by deferring the size update until the drag finishes.

> Advanced column resizing performance tips will be discussed [down below](#advanced-column-resizing-performance).

If you want to change the column resize mode to `"onChange"` for immediate column resizing renders, you can do so with the `columnResizeMode` table option.

```tsx
const table = createTable({
  //...
  columnResizeMode: 'onChange', // change column resize mode to "onChange"
})
```

### Column Resize Direction

By default, TanStack Table assumes that the table markup is laid out in a left-to-right direction. For right-to-left layouts, you may need to change the column resize direction to `"rtl"`.

```tsx
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

```tsx
<th
  key={header.id}
  colSpan={header.colSpan}
  style={{ width: `${header.getSize()}px` }}
>
```

Though, as discussed in the [advanced column resizing performance section](#advanced-column-resizing-performance), you may want to consider using CSS variables to apply column sizes to your markup.

#### Column Resize APIs

TanStack Table provides a pre-built event handler to make your drag interactions easy to implement. These event handlers are just convenience functions that call other internal APIs to update the column sizing state and re-render the table. Use `header.getResizeHandler()` to connect to your column resize drag interactions, for both mouse and touch events.

```tsx
<ColumnResizeHandle
  onMouseDown={header.getResizeHandler()} // for desktop
  onTouchStart={header.getResizeHandler()} // for mobile
/>
```

#### Column Resize Indicator with Column Resizing State

TanStack Table keeps track of a `columnResizing` state object that you can use to render a column resize indicator UI.

```tsx
<ColumnResizeIndicator
  style={{
    transform: header.column.getIsResizing()
      ? `translateX(${table.atoms.columnResizing.get().deltaOffset ?? 0}px)`
      : '',
  }}
/>
```

Because the table's state atoms are backed by Solid signals, the `table.atoms.columnResizing.get()` read inside JSX is reactive and the indicator follows the drag. This is the same pattern the [Column Resizing example](../examples/column-resizing) uses.

The `columnResizing` state stores transient drag information:

```tsx
type columnResizingState = {
  columnSizingStart: Array<[string, number]>
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  startOffset: null | number
  startSize: null | number
}
```

You rarely need to manage this transient drag state yourself, but if you do, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can observe the resize state without going through the component that owns the table.

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'
import type { columnResizingState } from '@tanstack/solid-table'

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
  data,
  atoms: {
    columnResizing: columnResizingAtom,
  },
})
```

Alternatively, the v8-style `state.columnResizing` plus `onColumnResizingChange` pattern is still supported with Solid signals. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const [columnResizing, setColumnResizing] = createSignal<columnResizingState>({
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
      return columnResizing() // connect the signal back down to the table
    },
  },
  onColumnResizingChange: setColumnResizing,
})
```

### Column Resizing APIs

Use `header.getResizeHandler()` to connect mouse or touch events to the resizing logic. Use `column.getCanResize()` to decide whether to render a resize handle, and `column.getIsResizing()` to render active resizing UI.

```tsx
header.getResizeHandler()
column.getCanResize()
column.getIsResizing()
```

The table instance exposes APIs for the transient resize state. Note that the current v9 API spelling is `table.setcolumnResizing` with a lowercase `c` in `column`; use that exact name.

```tsx
table.setcolumnResizing(old => ({
  ...old,
  deltaOffset: 12,
}))

table.resetHeaderSizeInfo()
table.resetHeaderSizeInfo(true)
```

### Advanced Column Resizing Performance

Solid's fine-grained reactivity means you usually do not have to fight whole-component re-renders the way React users do. But in a large or complex table where every header and every data cell reads `column.getSize()` directly, an `"onChange"` resize drag still triggers a lot of recomputation per frame.

We have created a [performant column resizing example](../examples/column-resizing-performant) that demonstrates how to keep column resizing smooth with a complex table that has artificially slow cell renders. It is recommended that you just look at that example to see how it is done, but these are the basic things to keep in mind:

1. Don't read `column.getSize()` in every header and every data cell. Instead, calculate all column widths once in a single `createMemo` that maps header and column ids to CSS variable values.
2. Use CSS variables (e.g. `width: calc(var(--col-firstName-size) * 1px)`) to communicate column widths to your table cells. During a drag, only the memo that produces the variables re-runs and the browser applies the new widths; the cell JSX itself never re-executes.

If you follow these steps, you should see significant performance improvements while resizing columns.
