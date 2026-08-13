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
import {
  createTable,
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
} from '@tanstack/alpine-table'

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
<th :colspan="header.colSpan" :style="'width:' + header.getSize() + 'px'"></th>
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

Alpine bridges table reactivity through a single version counter, so by default any table state change re-evaluates every binding that reads the table. During an `"onChange"` drag on a large table that is a lot of work per frame. The [performant column resizing example](../examples/column-resizing-performant) shows how to keep a drag off Alpine's reactivity entirely.

1. **Opt the table out of state-driven re-evaluation.** Pass a selector to `createTable` that returns a constant (`() => ({})`). Alpine then re-evaluates table bindings only when your data or options change, not on every resize tick. (Data changes such as Regenerate still re-render normally.)
2. **Write column widths as CSS variables imperatively.** In the component's `init()`, subscribe to `table.atoms.columnSizing` and set `--header-<id>-size` and `--col-<id>-size` variables directly on the `<table>` element. Cells reference them with `width: calc(var(--col-firstName-size) * 1px)`, so the browser applies new widths with no Alpine work per frame. Unsubscribe in `destroy()`.
3. **Drive the resizer highlight and any live state readout from subscriptions too**, toggling classes or text imperatively rather than through `x-` bindings.

The example sets up the subscriptions in `init()` and references the table element with `x-ref`:

```ts
Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(200) })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
      },
      defaultColumn: { minSize: 60, maxSize: 800 },
      columnResizeMode: 'onChange',
    },
    () => ({}), // opt out of state-driven re-evaluation; the drag is handled by the subscriptions below
  )

  let subscriptions: Array<{ unsubscribe: () => void }> = []

  return {
    table,
    FlexRender,
    local,
    init(this: { $refs: Record<string, HTMLElement> }) {
      const tableEl = this.$refs.tableEl

      const writeColumnSizeVars = () => {
        for (const header of table.getFlatHeaders()) {
          tableEl.style.setProperty(
            `--header-${header.id}-size`,
            String(header.getSize()),
          )
          tableEl.style.setProperty(
            `--col-${header.column.id}-size`,
            String(header.column.getSize()),
          )
        }
        tableEl.style.width = `${table.getTotalSize()}px`
      }

      writeColumnSizeVars() // initial paint
      subscriptions = [table.atoms.columnSizing.subscribe(writeColumnSizeVars)]
    },
    destroy() {
      subscriptions.forEach((subscription) => subscription.unsubscribe())
      subscriptions = []
    },
  }
})
```

```html
<table x-ref="tableEl" style="display: grid">
  <thead style="display: grid">
    <template
      x-for="headerGroup in table.getHeaderGroups()"
      :key="headerGroup.id"
    >
      <tr style="display: flex; width: 100%; height: 30px">
        <template x-for="header in headerGroup.headers" :key="header.id">
          <th
            :colspan="header.colSpan"
            :style="'display:flex;flex-shrink:0;width:calc(var(--header-' + header.id + '-size) * 1px)'"
          >
            <template x-if="!header.isPlaceholder">
              <span x-html="FlexRender({ header })"></span>
            </template>
            <div
              class="resizer"
              :class="header.column.getIsResizing() ? 'isResizing' : ''"
              @dblclick="header.column.resetSize()"
              @mousedown="header.getResizeHandler()($event)"
              @touchstart="header.getResizeHandler()($event)"
            ></div>
          </th>
        </template>
      </tr>
    </template>
  </thead>
  <tbody style="display: grid">
    <template x-for="row in table.getRowModel().rows" :key="row.id">
      <tr style="display: flex; width: 100%; height: 30px">
        <template x-for="cell in row.getAllCells()" :key="cell.id">
          <td
            :style="'display:flex;flex-shrink:0;width:calc(var(--col-' + cell.column.id + '-size) * 1px)'"
            x-text="cell.renderValue()"
          ></td>
        </template>
      </tr>
    </template>
  </tbody>
</table>
```

> [!NOTE]
> with the `() => ({})` selector, the `:class` binding on the resizer above will not update during a drag (the table is opted out of state-driven re-evaluation). The example instead toggles the `isResizing` class imperatively from a `table.atoms.columnResizing` subscription. Keeping the `:class` binding is fine if you accept the highlight only reflecting resize state on the next data-driven re-render.

If you follow these steps, you should see significant performance improvements while resizing columns.
