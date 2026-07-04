---
title: Column Resizing (React) Guide
---

## Examples

Want to skip to the implementation? Check out these React examples:

- [Column Resizing](../examples/column-resizing)
- [Performant Column Resizing](../examples/column-resizing-performant)

### Column Resizing Setup

Here's how you set up your table to use column resizing features. Column resizing depends on column sizing, so add `columnSizingFeature` before `columnResizingFeature`. Adding the column resizing feature enables the related APIs.

```tsx
import {
  useTable,
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const table = useTable({
  features,
  columns,
  data,
})
```

## Column Resizing (React) Guide

TanStack Table provides built-in column resizing state and APIs that allow you to easily implement column resizing in your table UI with a variety of options for UX and performance.

Column resizing builds on column sizing. If you only need to define starting, minimum, or maximum widths, see the [Column Sizing Guide](./column-sizing).

### Enable Column Resizing

To use column resizing, add `columnSizingFeature` and then `columnResizingFeature` to your features. The `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

```tsx
import {
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

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

const table = useTable({
  features,
  columns,
  data,
})
```

### Column Resize Mode

By default, the column resize mode is set to `"onEnd"`. This means that the `column.getSize()` API will not return the new column size until the user has finished resizing (dragging) the column. Usually a small UI indicator will be displayed while the user is resizing the column.

In the React TanStack Table adapter, where achieving 60 fps column resizing renders can be difficult depending on the complexity of your table or web page, the `"onEnd"` column resize mode can be a good default option to avoid stuttering or lagging while the user resizes columns. That is not to say that you cannot achieve 60 fps column resizing renders while using TanStack React Table, but you may have to do some extra memoization or other performance optimizations in order to achieve this.

> Advanced column resizing performance tips will be discussed [down below](#advanced-column-resizing-performance).

If you want to change the column resize mode to `"onChange"` for immediate column resizing renders, you can do so with the `columnResizeMode` table option.

```tsx
const table = useTable({
  //...
  columnResizeMode: 'onChange', // change column resize mode to "onChange"
})
```

### Column Resize Direction

By default, TanStack Table assumes that the table markup is laid out in a left-to-right direction. For right-to-left layouts, you may need to change the column resize direction to `"rtl"`.

```tsx
const table = useTable({
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
      ? `translateX(${table.state.columnResizing.deltaOffset ?? 0}px)`
      : '',
  }}
/>
```

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

You rarely need to manage this transient drag state yourself, but if you do, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can observe the resize state without re-rendering the component that owns the table.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import type { columnResizingState } from '@tanstack/react-table'

const columnResizingAtom = useCreateAtom<columnResizingState>({
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
})

const columnResizing = useSelector(columnResizingAtom) // subscribe wherever it is needed

const table = useTable({
  features,
  columns,
  data,
  atoms: {
    columnResizing: columnResizingAtom,
  },
})
```

Alternatively, the v8-style `state.columnResizing` plus `onColumnResizingChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const [columnResizing, setColumnResizing] = useState<columnResizingState>({
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
})

const table = useTable({
  features,
  columns,
  data,
  state: {
    columnResizing,
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
table.setcolumnResizing((old) => ({
  ...old,
  deltaOffset: 12,
}))

table.resetHeaderSizeInfo()
table.resetHeaderSizeInfo(true)
```

### Advanced Column Resizing Performance

If you are creating large or complex tables with React, an `"onChange"` resize can re-render the whole table on every drag frame, which degrades performance. The [performant column resizing example](../examples/column-resizing-performant) shows how to keep a drag off React's render path entirely, so even a table with expensive cells stays smooth.

The idea is to stop treating column widths as React state during a drag:

1. **Subscribe the table component to no resize state.** Pass a selector that returns a constant (the example uses `() => ({})`) so state changes never re-render the component that owns the table.
2. **Write column widths as CSS variables imperatively.** In a `useLayoutEffect`, subscribe to `table.atoms.columnSizing` and set `--header-<id>-size` and `--col-<id>-size` variables directly on the `<table>` element. Cells reference them with `width: calc(var(--col-firstName-size) * 1px)`, so the browser applies new widths with zero React work per frame. (The core resize handler already coalesces pointer events to one update per animation frame.)
3. **Isolate the few things that must react into `table.Subscribe` islands.** The active resizer's highlight and any live state readout each subscribe to just the slice they need, so a drag re-renders only those small islands, not the table body.

This replaces the older "memoize the table body while resizing" approach. Because the body no longer subscribes to resize state, it does not need to be memoized; it only re-renders when your data changes.
