---
title: Column Sizing (Solid) Guide
---

## Examples

Want to skip to the implementation? Check out these Solid examples:

- [Column Sizing](../examples/column-sizing)

Use getters for reactive inputs such as `data` when passing Solid signals to `createTable`.

### Solid Setup

```tsx
import { createTable, tableFeatures, columnSizingFeature } from '@tanstack/solid-table'

const features = tableFeatures({ columnSizingFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

## Column Sizing (Solid) Guide

The column sizing feature allows you to optionally specify the width of each column including min and max widths.

If you want users to dynamically change column widths by dragging column headers, see the [Column Resizing Guide](./column-resizing).

### Column Widths

Columns by default are given the following measurement options:

```tsx
export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}
```

These defaults can be overridden by both `tableOptions.defaultColumn` and individual column defs, in that order.

```tsx
const features = tableFeatures({ columnSizingFeature })

const columns = [
  {
    accessorKey: 'col1',
    size: 270, //set column size for this column
  },
  //...
]

const table = createTable({
  features,
  defaultColumn: {
    size: 200, // starting column size
    minSize: 50, // enforced during column resizing
    maxSize: 500, // enforced during column resizing
  },
  //...
})
```

The column "sizes" are stored in the table state as numbers, and are usually interpreted as pixel unit values, but you can hook up these column sizing values to your css styles however you see fit.

As a headless utility, table logic for column sizing is really only a collection of states that you can apply to your own layouts how you see fit (our example above implements 2 styles of this logic). You can apply these width measurements in a variety of ways:

- semantic `table` elements or any elements being displayed in a table css mode
- `div/span` elements or any elements being displayed in a non-table css mode
  - Block level elements with strict widths
  - Absolutely positioned elements with strict widths
  - Flexbox positioned elements with loose widths
  - Grid positioned elements with loose widths
- Really any layout mechanism that can interpolate cell widths into a table structure.

Each of these approaches has its own tradeoffs and limitations which are usually opinions held by a UI/component library or design system, luckily not you 😉.

### Column Sizing APIs

Use the column and header APIs to read the calculated size and offsets for rendering. These values come from the `columnSizing` state and the column definition defaults.

```tsx
column.getSize()
header.getSize()

column.getStart() // left offset in the current column flow
column.getStart('left')
column.getStart('center')
column.getStart('right')

column.getAfter() // right offset in the current column flow
column.getAfter('left')
column.getAfter('center')
column.getAfter('right')

column.resetSize()
```

The table instance also exposes total size helpers. These are useful when building scroll containers, split pinned-column tables, or CSS variables for column widths.

```tsx
table.getTotalSize()
table.getLeftTotalSize()
table.getCenterTotalSize()
table.getRightTotalSize()
```

If you need to update sizing state directly, use `table.setColumnSizing`. Use `table.resetColumnSizing` to reset to `initialState.columnSizing`, or pass `true` to reset to the feature default.

```tsx
table.setColumnSizing({
  firstName: 180,
  age: 80,
})

table.resetColumnSizing()
table.resetColumnSizing(true)
```

### Managing Column Sizing State

If you need to own the `columnSizing` state yourself (for example, to persist user-set column widths), the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the sizing state without going through the component that owns the table.

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'
import type { ColumnSizingState } from '@tanstack/solid-table'

const features = tableFeatures({ columnSizingFeature })

const columnSizingAtom = createAtom<ColumnSizingState>({})

const columnSizing = useSelector(columnSizingAtom) // subscribe wherever it is needed

const table = createTable({
  features,
  columns,
  data,
  atoms: {
    columnSizing: columnSizingAtom,
  },
})
```

Alternatively, the v8-style `state.columnSizing` plus `onColumnSizingChange` pattern is still supported with Solid signals. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const features = tableFeatures({ columnSizingFeature })

const [columnSizing, setColumnSizing] = createSignal<ColumnSizingState>({})

const table = createTable({
  features,
  columns,
  data,
  state: {
    get columnSizing() {
      return columnSizing() // connect the signal back down to the table
    },
  },
  onColumnSizingChange: setColumnSizing,
})
```
