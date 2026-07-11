---
title: Column Resizing (Ember) Guide
---

## Examples

Want to skip to the implementation? Check out these Ember examples:

- [Column Resizing](../examples/column-resizing)
- [Performant Column Resizing](../examples/column-resizing-performant)

### Column Resizing Setup

Here's how you set up your table to use column resizing features. Column resizing depends on column sizing, so add `columnSizingFeature` before `columnResizingFeature`. Adding the column resizing feature enables the related APIs.

```ts
import {
  useTable,
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
} from '@tanstack/ember-table'

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})

const table = useTable(() => ({
  features,
  columns,
  data,
}))
```

## Column Resizing (Ember) Guide

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
} from '@tanstack/ember-table'

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

const table = useTable(() => ({
  features,
  columns,
  data,
}))
```

### Column Resize Mode

By default, the column resize mode is set to `"onEnd"`. This means that the `column.getSize()` API will not return the new column size until the user has finished resizing (dragging) the column. Usually a small UI indicator will be displayed while the user is resizing the column.

In the Ember TanStack Table adapter, where achieving 60 fps column resizing renders can be difficult depending on the complexity of your table or web page, the `"onEnd"` column resize mode can be a good default option to avoid stuttering or lagging while the user resizes columns. That is not to say that you cannot achieve 60 fps column resizing renders while using TanStack Ember Table, but you may have to do some extra memoization or other performance optimizations in order to achieve this.

> Advanced column resizing performance tips will be discussed [down below](#advanced-column-resizing-performance).

If you want to change the column resize mode to `"onChange"` for immediate column resizing renders, you can do so with the `columnResizeMode` table option.

```ts
const table = useTable(() => ({
  //...
  columnResizeMode: 'onChange', // change column resize mode to "onChange"
}))
```

### Column Resize Direction

By default, TanStack Table assumes that the table markup is laid out in a left-to-right direction. For right-to-left layouts, you may need to change the column resize direction to `"rtl"`.

```ts
const table = useTable(() => ({
  //...
  columnResizeDirection: 'rtl', // change column resize direction to "rtl" for certain locales
}))
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

Because Ember templates extract method references without binding them, wrap these size reads in small module-scope helper functions, then call the helpers from your markup:

```ts
const getHeaderSize = (header: Header<typeof features, Person>): number =>
  header.getSize()

const getCellColumnSize = (cell: Cell<typeof features, Person>): number =>
  cell.column.getSize()
```

How you apply these size styles to your markup is up to you, but it is pretty common to use either CSS variables or inline styles to apply the column sizes.

```hbs
<th colspan={{header.colSpan}} style='width:{{getHeaderSize header}}px'>
```

Though, as discussed in the [advanced column resizing performance section](#advanced-column-resizing-performance), you may want to consider using CSS variables to apply column sizes to your markup.

#### Column Resize APIs

TanStack Table provides a pre-built event handler to make your drag interactions easy to implement. These event handlers are just convenience functions that call other internal APIs to update the column sizing state and re-render the table. Use `header.getResizeHandler()` to connect to your column resize drag interactions, for both mouse and touch events.

```ts
const getResizeHandler = (header: Header<typeof features, Person>) => {
  return (event: Event) => header.getResizeHandler()?.(event)
}
```

```hbs
<div
  class='resizer'
  {{on 'mousedown' (getResizeHandler header)}}
  {{on 'touchstart' (getResizeHandler header)}}
></div>
```

#### Column Resize Indicator with Column Resizing State

TanStack Table keeps track of a `columnResizing` state object that you can use to render a column resize indicator UI. Use `column.getIsResizing()` to know when to show it, and read the transient drag offset from `table.store.state.columnResizing`.

```ts
const getIsResizing = (column: Column<typeof features, Person>): boolean =>
  column.getIsResizing()
```

```hbs
<div
  class='resizer {{if (getIsResizing header.column) "isResizing"}}'
  {{on 'mousedown' (getResizeHandler header)}}
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

You rarely need to manage this transient drag state yourself, but if you do, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can observe the resize state without re-rendering the component that owns the table.

```gts
import { useTable, createAtom } from '@tanstack/ember-table'
import type { columnResizingState } from '@tanstack/ember-table'

export default class MyTable extends Component {
  columnResizingAtom = createAtom<columnResizingState>({
    columnSizingStart: [],
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    startOffset: null,
    startSize: null,
  })

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    atoms: {
      columnResizing: this.columnResizingAtom,
    },
  }))

  // read the atom wherever it is needed
  get columnResizing() {
    return this.columnResizingAtom.get()
  }
}
```

Alternatively, the v8-style `state.columnResizing` plus `onColumnResizingChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```gts
export default class MyTable extends Component {
  @tracked columnResizing: columnResizingState = {
    columnSizingStart: [],
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
    startOffset: null,
    startSize: null,
  }

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    state: {
      columnResizing: this.columnResizing,
    },
    onColumnResizingChange: (updater) => {
      this.columnResizing =
        typeof updater === 'function' ? updater(this.columnResizing) : updater
    },
  }))
}
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

If you are creating large or complex tables with Ember, an `"onChange"` resize can re-render the whole table on every drag frame, which degrades performance. The [performant column resizing example](../examples/column-resizing-performant) shows how to keep a drag off Ember's render path entirely, so even a table with expensive cells stays smooth.

The idea is to stop reading a per-cell `getSize()` on every render during a drag:

1. **Publish all column widths once as CSS variables on the table wrapper.** A single `@cached` getter reads `table.store.state.columnSizing` to establish reactivity, then iterates `table.getFlatHeaders()` to build a style string of `--header-<id>-size` and `--col-<id>-size` variables.
2. **Have each header and cell read its width from the matching variable by id.** Cells reference them with `width: calc(var(--col-firstName-size) * 1px)`, so the browser applies new widths with the variables already computed. (The core resize handler already coalesces pointer events to one update per animation frame.)
3. **Keep the resize indicator reading the narrow slice it needs.** Only the active resizer's highlight reads `column.getIsResizing()`, so a drag updates only those small pieces, not the whole table body.

```gts
import { cached } from '@glimmer/tracking'

const headerWidthStyle = (header: Header<typeof features, Person>): string =>
  `width: calc(var(--header-${header.id}-size) * 1px)`

const colWidthStyle = (cell: Cell<typeof features, Person>): string =>
  `width: calc(var(--col-${cell.column.id}-size) * 1px)`

export default class MyTable extends Component {
  table = useTable(() => ({
    features,
    columns,
    data: this.data,
    columnResizeMode: 'onChange' as const,
    defaultColumn: { minSize: 60, maxSize: 800 },
  }))

  get totalSize() {
    return this.table.getTotalSize()
  }

  // Calculate all column sizes at once at the root table level and expose them
  // as a CSS-variable style string applied to the table wrapper. Reading
  // store.state.columnSizing establishes reactivity so the vars recompute on
  // resize, while the individual header/cell widths simply read the variables.
  @cached
  get columnSizeVars(): string {
    void this.table.store.state.columnSizing
    const headers = this.table.getFlatHeaders()
    const parts: Array<string> = []
    let i = headers.length
    while (--i >= 0) {
      const header = headers[i]!
      parts.push(`--header-${header.id}-size: ${header.getSize()}`)
      parts.push(`--col-${header.column.id}-size: ${header.column.getSize()}`)
    }
    return parts.join('; ')
  }

  get tableStyle(): string {
    return `${this.columnSizeVars}; width: ${this.totalSize}px`
  }
}
```

This replaces the older "memoize the table body while resizing" approach. Because the body reads widths from CSS variables rather than subscribing to resize state, it does not need to be memoized; it only re-renders when your data changes.
