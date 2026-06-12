---
title: Column Resizing (Lit) Guide
---

## Examples

Want to skip to the implementation? Check out these Lit examples:

- [Column Resizing](../examples/column-resizing)
- [Performant Column Resizing](../examples/column-resizing-performant)

### Lit Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TableController, tableFeatures, columnResizingFeature } from '@tanstack/lit-table'

const features = tableFeatures({ columnResizingFeature })

@customElement('my-table')
class MyTable extends LitElement {
  @state()
  private data = defaultData

  private tableController = new TableController(this)

  protected render() {
    const table = this.tableController.table({
      features,
      columns,
      data: this.data,
    })

    return html`...`
  }
}
```

## Column Resizing (Lit) Guide

TanStack Table provides built-in column resizing state and APIs that allow you to easily implement column resizing in your table UI with a variety of options for UX and performance.

Column resizing builds on column sizing. If you only need to define starting, minimum, or maximum widths, see the [Column Sizing Guide](./column-sizing).

### Enable Column Resizing

To use column resizing, add `columnResizingFeature` to your features. The `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

```ts
import {
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
  TableController,
} from '@tanstack/lit-table'

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

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
})
```

### Column Resize Mode

By default, the column resize mode is set to `"onEnd"`. This means that the `column.getSize()` API will not return the new column size until the user has finished resizing (dragging) the column. Usually a small UI indicator will be displayed while the user is resizing the column.

With the `"onChange"` resize mode, every pixel of drag movement triggers a host update, which means Lit re-runs your `render` method and re-evaluates your templates on every frame. For large or complex tables this can be hard to keep at 60 fps, so the `"onEnd"` column resize mode can be a good default option to avoid stuttering or lagging while the user resizes columns. That is not to say that you cannot achieve smooth `"onChange"` resizing with Lit, but you may need to lean on CSS variables and keyed templates to keep per-frame work small.

> Advanced column resizing performance tips will be discussed [down below](#advanced-column-resizing-performance).

If you want to change the column resize mode to `"onChange"` for immediate column resizing renders, you can do so with the `columnResizeMode` table option.

```ts
const table = this.tableController.table({
  //...
  columnResizeMode: 'onChange', // change column resize mode to "onChange"
})
```

### Column Resize Direction

By default, TanStack Table assumes that the table markup is laid out in a left-to-right direction. For right-to-left layouts, you may need to change the column resize direction to `"rtl"`.

```ts
const table = this.tableController.table({
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

```ts
html`
  <th colspan=${header.colSpan} style="width: ${header.getSize()}px">
    <!-- header content -->
  </th>
`
```

Though, as discussed in the [advanced column resizing performance section](#advanced-column-resizing-performance), you may want to consider using CSS variables to apply column sizes to your markup.

#### Column Resize APIs

TanStack Table provides a pre-built event handler to make your drag interactions easy to implement. These event handlers are just convenience functions that call other internal APIs to update the column sizing state and re-render the table. Use `header.getResizeHandler()` to connect to your column resize drag interactions, for both mouse and touch events.

```ts
html`
  <div
    class="resizer"
    @mousedown=${header.getResizeHandler()}
    @touchstart=${header.getResizeHandler()}
  ></div>
`
```

#### Column Resize Indicator with Column Resizing State

TanStack Table keeps track of a `columnResizing` state object that you can use to render a column resize indicator UI.

```ts
html`
  <div
    class="resize-indicator"
    style="transform: ${header.column.getIsResizing()
      ? `translateX(${table.state.columnResizing.deltaOffset ?? 0}px)`
      : ''}"
  ></div>
`
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

You rarely need to manage this transient drag state yourself, but if you do, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can observe the resize state without going through the component that owns the table.

```ts
import { createAtom } from '@tanstack/store'
import type { columnResizingState } from '@tanstack/lit-table'

// create a stable atom at module scope (or in a shared store module)
const columnResizingAtom = createAtom<columnResizingState>({
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
})

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  atoms: {
    columnResizing: columnResizingAtom,
  },
})
```

Alternatively, the v8-style `state.columnResizing` plus `onColumnResizingChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
@state()
private columnResizing: columnResizingState = {
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
}

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  state: {
    columnResizing: this.columnResizing,
  },
  onColumnResizingChange: (updater) => {
    this.columnResizing = typeof updater === 'function' ? updater(this.columnResizing) : updater
  },
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

If you are creating large or complex tables with Lit, every host update during a resize drag re-evaluates your templates, and your users may experience degraded performance while resizing columns if each cell does its own size work.

We have created a [performant column resizing example](../examples/column-resizing-performant) that demonstrates how to achieve smooth column resizing renders with a complex table that may otherwise have slow renders. It is recommended that you just look at that example to see how it is done, but these are the basic things to keep in mind:

1. Don't use `column.getSize()` on every header and every data cell. Instead, calculate all column widths once per render from `table.getFlatHeaders()` and expose them as CSS variables on the table wrapper.
2. Reference those CSS variables (e.g. `width: calc(var(--col-firstName-size) * 1px)`) in your cell styles so resizing only changes the variable values, not the cell templates.
3. Use Lit's `repeat` directive with stable keys for header groups, rows, and cells so Lit reuses DOM instead of re-creating it on every drag frame, and keep the selector you pass to `tableController.table` limited to the state you actually render.

If you follow these steps, you should see significant performance improvements while resizing columns.
