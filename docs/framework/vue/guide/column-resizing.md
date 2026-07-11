---
title: Column Resizing (Vue) Guide
---

## Examples

Want to skip to the implementation? Check out these Vue examples:

- [Column Resizing](../examples/column-resizing)
- [Performant Column Resizing](../examples/column-resizing-performant)

Vue refs can be passed directly where the adapter expects reactive table options.

### Column Resizing Setup

Here's how you set up your table to use column resizing features. Column resizing depends on column sizing, so add `columnSizingFeature` before `columnResizingFeature`. Adding the column resizing feature enables the related APIs.

```ts
import {
  useTable,
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
} from '@tanstack/vue-table'

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

## Column Resizing (Vue) Guide

TanStack Table provides built-in column resizing state and APIs that allow you to easily implement column resizing in your table UI with a variety of options for UX and performance.

Column resizing builds on column sizing. If you only need to define starting, minimum, or maximum widths, see the [Column Sizing Guide](./column-sizing).

### Enable Column Resizing

To use column resizing, add `columnSizingFeature` and then `columnResizingFeature` to your features. The `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

```ts
import {
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

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

Vue's reactivity tracks dependencies per component, so a drag that updates the `columnResizing` state on every mouse move re-renders every component whose template reads column sizes. For large or complex tables, the `"onEnd"` column resize mode can be a good default option to avoid stuttering or lagging while the user resizes columns. That is not to say that you cannot achieve 60 fps column resizing renders with the Vue adapter, but you may need to keep size reads scoped (computed values, `table.Subscribe`, or CSS variables) so each drag frame touches as little of the template as possible.

> Advanced column resizing performance tips will be discussed [down below](#advanced-column-resizing-performance).

If you want to change the column resize mode to `"onChange"` for immediate column resizing renders, you can do so with the `columnResizeMode` table option.

```ts
const table = useTable({
  //...
  columnResizeMode: 'onChange', // change column resize mode to "onChange"
})
```

### Column Resize Direction

By default, TanStack Table assumes that the table markup is laid out in a left-to-right direction. For right-to-left layouts, you may need to change the column resize direction to `"rtl"`.

```ts
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

```vue
<th :colSpan="header.colSpan" :style="{ width: header.getSize() + 'px' }">
  <!-- header content -->
</th>
```

Though, as discussed in the [advanced column resizing performance section](#advanced-column-resizing-performance), you may want to consider using CSS variables to apply column sizes to your markup.

#### Column Resize APIs

TanStack Table provides a pre-built event handler to make your drag interactions easy to implement. These event handlers are just convenience functions that call other internal APIs to update the column sizing state and re-render the table. Use `header.getResizeHandler()` to connect to your column resize drag interactions, for both mouse and touch events.

```vue
<div
  class="resizer"
  @mousedown="header.getResizeHandler()?.($event)"
  @touchstart="header.getResizeHandler()?.($event)"
/>
```

#### Column Resize Indicator with Column Resizing State

TanStack Table keeps track of a `columnResizing` state object that you can use to render a column resize indicator UI.

```vue
<div
  class="resize-indicator"
  :style="{
    transform: header.column.getIsResizing()
      ? `translateX(${table.atoms.columnResizing.get().deltaOffset ?? 0}px)`
      : '',
  }"
/>
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

You rarely need to manage this transient drag state yourself, but if you do, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can observe the resize state without depending on the table instance.

```ts
import { createAtom, useSelector } from '@tanstack/vue-store'
import type { columnResizingState } from '@tanstack/vue-table'

const columnResizingAtom = createAtom<columnResizingState>({
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
})

const columnResizing = useSelector(columnResizingAtom) // subscribe wherever it is needed (a Vue ref)

const table = useTable({
  features,
  columns,
  data,
  atoms: {
    columnResizing: columnResizingAtom,
  },
})
```

Alternatively, the v8-style `state.columnResizing` plus `onColumnResizingChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. Pass the current ref value through a getter so the adapter can track it. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const columnResizing = ref<columnResizingState>({
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
    get columnResizing() {
      return columnResizing.value
    },
  },
  onColumnResizingChange: (updater) => {
    columnResizing.value =
      updater instanceof Function ? updater(columnResizing.value) : updater
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

Vue tracks reactivity per component render effect, so reading `columnResizing` or `columnSizing` anywhere in a component re-renders that whole component on every `"onChange"` drag frame. The [performant column resizing example](../examples/column-resizing-performant) shows how to keep a drag off the root component's render path.

The idea is to keep resize state out of the component that renders your rows:

1. **Do not read `column.getSize()` per cell in the root template.** Reading it there ties every frame's re-render to the whole table.
2. **Write column widths as CSS variables imperatively.** In `onMounted`, subscribe to `table.atoms.columnSizing` and set `--header-<id>-size` and `--col-<id>-size` variables directly on the `<table>` element via a template ref. Cells reference them with `width: calc(var(--col-firstName-size) * 1px)`, so the browser applies new widths with no Vue work per frame.
3. **Isolate the few things that must react into small child components.** The example renders the active resizer's highlight and the live state readout as functional components, each with its own render effect, so a drag re-renders only those, never the table body.

Because the root template no longer reads resize state, the body only re-renders when your data changes.
