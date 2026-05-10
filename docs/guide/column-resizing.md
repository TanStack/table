---
title: Column Resizing Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

<!-- ::start:framework -->

# React

- [Column Resizing](../framework/react/examples/column-resizing)
- [Performant Column Resizing](../framework/react/examples/column-resizing-performant)

# Preact

- [Column Resizing](../framework/preact/examples/column-resizing)
- [Performant Column Resizing](../framework/preact/examples/column-resizing-performant)

# Solid

- [Column Resizing](../framework/solid/examples/column-resizing)
- [Performant Column Resizing](../framework/solid/examples/column-resizing-performant)

# Svelte

- [Column Resizing](../framework/svelte/examples/column-resizing)
- [Performant Column Resizing](../framework/svelte/examples/column-resizing-performant)

# Vue

- [Column Resizing](../framework/vue/examples/column-resizing)
- [Performant Column Resizing](../framework/vue/examples/column-resizing-performant)

# Angular

- [Performant Column Resizing](../framework/angular/examples/column-resizing-performant)

# Lit

- [Column Resizing](../framework/lit/examples/column-resizing)
- [Performant Column Resizing](../framework/lit/examples/column-resizing-performant)

<!-- ::end:framework -->

## Column Resizing Guide

TanStack Table provides built-in column resizing state and APIs that allow you to easily implement column resizing in your table UI with a variety of options for UX and performance.

Column resizing builds on column sizing. If you only need to define starting, minimum, or maximum widths, see the [Column Sizing Guide](./column-sizing).

### Enable Column Resizing

To use column resizing, add `columnResizingFeature` to your features. The `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

```tsx
import {
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

const _features = tableFeatures({
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
  _features,
  _rowModels: {},
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

#### Column Resize Indicator with ColumnSizingInfoState

TanStack Table keeps track of a state object called `columnSizingInfo` that you can use to render a column resize indicator UI.

```jsx
<ColumnResizeIndicator
  style={{
    transform: header.column.getIsResizing()
      ? `translateX(${table.atoms.columnSizingInfo.get().deltaOffset}px)`
      : '',
  }}
/>
```

### Advanced Column Resizing Performance

If you are creating large or complex tables (and using React 😉), you may find that if you do not add proper memoization to your render logic, your users may experience degraded performance while resizing columns.

We have created a [performant column resizing example](../framework/react/examples/column-resizing-performant) that demonstrates how to achieve 60 fps column resizing renders with a complex table that may otherwise have slow renders. It is recommended that you just look at that example to see how it is done, but these are the basic things to keep in mind:

1. Don't use `column.getSize()` on every header and every data cell. Instead, calculate all column widths once upfront, **memoized**!
2. Memoize your Table Body while resizing is in progress.
3. Use CSS variables to communicate column widths to your table cells.

If you follow these steps, you should see significant performance improvements while resizing columns.

If you are not using React, and are using the Svelte, Vue, or Solid adapters instead, you may not need to worry about this as much, but similar principles apply.
