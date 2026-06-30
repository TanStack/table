---
title: Column Resizing (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Column Resizing](../examples/column-resizing)
- [Performant Column Resizing](../examples/column-resizing-performant)

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Column Resizing Setup

Here's how you set up your table to use column resizing features. Column resizing depends on column sizing, so add `columnSizingFeature` before `columnResizingFeature`. Adding the column resizing feature enables the related APIs.

```ts
import { createTable, tableFeatures, columnSizingFeature, columnResizingFeature } from '@tanstack/alpine-table'

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

## Column Resizing (Alpine) Guide

TanStack Table provides built-in column resizing state and APIs that allow you to easily implement column resizing in your table UI with a variety of options for UX and performance.

Column resizing builds on column sizing. If you only need to define starting, minimum, or maximum widths, see the [Column Sizing Guide](./column-sizing).

### Enable Column Resizing

To use column resizing, add `columnSizingFeature` and then `columnResizingFeature` to your features. The `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

```ts
import {
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
  createTable,
} from '@tanstack/alpine-table'

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
  get data() {
    return local.data
  },
})
```

### Column Resize Mode

By default, the column resize mode is set to `"onEnd"`. This means that the `column.getSize()` API will not return the new column size until the user has finished resizing (dragging) the column. Usually a small UI indicator will be displayed while the user is resizing the column.

The `"onEnd"` default exists because immediate resize updates can be expensive in large or complex tables: every drag movement updates the `columnSizing` state, and anything that reads column widths recomputes. Alpine's per-binding reactivity helps here, since only the bindings that actually read the sizing state re-run, but if every header and cell reads `column.getSize()` directly, a complex table can still stutter during an `"onChange"` drag. The `"onEnd"` mode sidesteps this by deferring the size update until the drag finishes.

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

How you apply these size styles to your markup is up to you, but it is pretty common to use either CSS variables or inline styles to apply the column sizes. Because table reads are reactive inside Alpine bindings, a `:style` that reads `header.getSize()` updates automatically as the size changes:

```html
<th
  :colspan="header.colSpan"
  :style="'width:' + header.getSize() + 'px'"
></th>
```

Though, as discussed in the [advanced column resizing performance section](#advanced-column-resizing-performance), you may want to consider using CSS variables to apply column sizes to your markup.

#### Column Resize APIs

TanStack Table provides a pre-built event handler to make your drag interactions easy to implement. These event handlers are just convenience functions that call other internal APIs to update the column sizing state and re-render the table. Use `header.getResizeHandler()` to connect to your column resize drag interactions, for both mouse and touch events. The handler is returned by `getResizeHandler()` and called with the event, so the pattern in markup is `header.getResizeHandler()($event)`.

```html
<div
  class="resizer"
  @dblclick="header.column.resetSize()"
  @mousedown="header.getResizeHandler()($event)"
  @touchstart="header.getResizeHandler()($event)"
></div>
```

#### Column Resize Indicator with Column Resizing State

TanStack Table keeps track of a `columnResizing` state object that you can use to render a column resize indicator UI. Read it with `table.atoms.columnResizing.get()`. The `:style` binding that uses `header.column.getIsResizing()` and the resizing state stays reactive, so the indicator follows the drag.

When using the `"onEnd"` resize mode, the size only updates when the drag finishes, so you translate the resize handle by the live `deltaOffset` while dragging. A method on your `Alpine.data` object is a convenient place to compute that transform:

```ts
Alpine.data('table', () => {
  const local = Alpine.reactive({
    data: makeData(10),
    columnResizeMode: 'onEnd' as ColumnResizeMode,
    columnResizeDirection: 'ltr' as ColumnResizeDirection,
  })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    get columnResizeMode() {
      return local.columnResizeMode
    },
    get columnResizeDirection() {
      return local.columnResizeDirection
    },
  })

  return {
    table,
    FlexRender,
    local,
    // Translate the resizer while dragging when using the "onEnd" resize mode.
    resizerTransform(header: any) {
      if (local.columnResizeMode === 'onEnd' && header.column.getIsResizing()) {
        const delta = table.atoms.columnResizing.get().deltaOffset ?? 0
        const dir = local.columnResizeDirection === 'rtl' ? -1 : 1
        return `transform: translateX(${dir * delta}px)`
      }
      return ''
    },
  }
})
```

```html
<div
  class="resizer"
  :class="local.columnResizeDirection + (header.column.getIsResizing() ? ' is-resizing' : '')"
  :style="resizerTransform(header)"
  @dblclick="header.column.resetSize()"
  @mousedown="header.getResizeHandler()($event)"
  @touchstart="header.getResizeHandler()($event)"
></div>
```

This is the same pattern the [Column Resizing example](../examples/column-resizing) uses.

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

You rarely need to manage this transient drag state yourself, but if you do, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can observe the resize state without going through the component that owns the table. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available.

```ts
import { createAtom } from '@tanstack/store'
import type { columnResizingState } from '@tanstack/alpine-table'

const columnResizingAtom = createAtom<columnResizingState>({
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
})

// subscribe wherever it is needed
columnResizingAtom.subscribe(() => {
  // react to resize state changes
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  atoms: {
    columnResizing: columnResizingAtom,
  },
})
```

Alternatively, the v8-style `state.columnResizing` plus `onColumnResizingChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const local = Alpine.reactive({
  columnResizing: {
    columnSizingStart: [],
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    startOffset: null,
    startSize: null,
  } as columnResizingState,
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  state: {
    get columnResizing() {
      return local.columnResizing // connect the reactive slice back down to the table
    },
  },
  onColumnResizingChange: (updater) => {
    local.columnResizing =
      typeof updater === 'function' ? updater(local.columnResizing) : updater
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
table.setcolumnResizing((old) => ({
  ...old,
  deltaOffset: 12,
}))

table.resetHeaderSizeInfo()
table.resetHeaderSizeInfo(true)
```

### Advanced Column Resizing Performance

Alpine's per-binding reactivity means you usually do not have to fight whole-component re-renders the way React users do. But in a large or complex table where every header and every data cell reads `column.getSize()` directly, an `"onChange"` resize drag still triggers a lot of recomputation per frame.

We have created a [performant column resizing example](../examples/column-resizing-performant) that demonstrates how to keep column resizing smooth with a complex table that has artificially slow cell renders. It is recommended that you just look at that example to see how it is done, but these are the basic things to keep in mind:

1. Don't read `column.getSize()` in every header and every data cell. Instead, calculate all column widths once in a single method that maps header and column ids to CSS variable values. Touch `table.atoms.columnResizing.get()` inside that method so Alpine tracks it as a dependency and recomputes the variables while a column is being resized.
2. Use CSS variables (e.g. `width: calc(var(--col-firstName-size) * 1px)`) to communicate column widths to your table cells. During a drag, only the binding that produces the variables re-runs and the browser applies the new widths; the cell bindings themselves do not recompute their width.

The example computes the variables in a method on the `Alpine.data` object and binds them once on the table container:

```ts
Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(200) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    defaultColumn: { minSize: 60, maxSize: 800 },
    columnResizeMode: 'onChange',
  })

  return {
    table,
    FlexRender,
    columnSizeVars(): string {
      // touch the resizing state so Alpine tracks it as a dependency
      void table.atoms.columnResizing.get().columnSizingStart
      const headers = table.getFlatHeaders()
      const styles: Array<string> = []
      for (const header of headers) {
        styles.push(`--header-${header.id}-size:${header.getSize()}`)
        styles.push(`--col-${header.column.id}-size:${header.column.getSize()}`)
      }
      styles.push(`width:${table.getTotalSize()}px`)
      return styles.join(';')
    },
  }
})
```

```html
<div class="divTable" :style="columnSizeVars()">
  <div class="thead">
    <template
      x-for="headerGroup in table.getHeaderGroups()"
      :key="headerGroup.id"
    >
      <div class="tr">
        <template x-for="header in headerGroup.headers" :key="header.id">
          <div
            class="th"
            :style="'width:calc(var(--header-' + header.id + '-size) * 1px)'"
          >
            <template x-if="!header.isPlaceholder">
              <span x-html="FlexRender({ header })"></span>
            </template>
            <div
              class="resizer"
              :class="header.column.getIsResizing() ? 'is-resizing' : ''"
              @dblclick="header.column.resetSize()"
              @mousedown="header.getResizeHandler()($event)"
              @touchstart="header.getResizeHandler()($event)"
            ></div>
          </div>
        </template>
      </div>
    </template>
  </div>
  <div class="tbody">
    <template x-for="row in table.getRowModel().rows" :key="row.id">
      <div class="tr">
        <template x-for="cell in row.getAllCells()" :key="cell.id">
          <div
            class="td"
            :style="'width:calc(var(--col-' + cell.column.id + '-size) * 1px)'"
            x-text="cell.renderValue()"
          ></div>
        </template>
      </div>
    </template>
  </div>
</div>
```

If you follow these steps, you should see significant performance improvements while resizing columns.
