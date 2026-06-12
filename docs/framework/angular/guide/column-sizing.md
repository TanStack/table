---
title: Column Sizing (Angular) Guide
---

## Examples

Want to skip to the implementation? Check out these Angular examples:

- [Column Sizing](../examples/column-sizing)

### Angular Setup

```ts
import { signal } from '@angular/core'
import { injectTable, tableFeatures, columnSizingFeature } from '@tanstack/angular-table'

const features = tableFeatures({ columnSizingFeature })

export class App {
  readonly data = signal(defaultData)

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }))
}
```

## Column Sizing (Angular) Guide

The column sizing feature allows you to optionally specify the width of each column including min and max widths.

If you want users to dynamically change column widths by dragging column headers, see the [Column Resizing Guide](./column-resizing).

### Column Widths

Columns by default are given the following measurement options:

```ts
export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}
```

These defaults can be overridden by both `tableOptions.defaultColumn` and individual column defs, in that order.

```ts
const features = tableFeatures({ columnSizingFeature })

const columns = [
  {
    accessorKey: 'col1',
    size: 270, //set column size for this column
  },
  //...
]

readonly table = injectTable(() => ({
  features,
  defaultColumn: {
    size: 200, // starting column size
    minSize: 50, // enforced during column resizing
    maxSize: 500, // enforced during column resizing
  },
  //...
}))
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

```ts
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

```ts
table.getTotalSize()
table.getLeftTotalSize()
table.getCenterTotalSize()
table.getRightTotalSize()
```

If you need to update sizing state directly, use `table.setColumnSizing`. Use `table.resetColumnSizing` to reset to `initialState.columnSizing`, or pass `true` to reset to the feature default.

```ts
table.setColumnSizing({
  firstName: 180,
  age: 80,
})

table.resetColumnSizing()
table.resetColumnSizing(true)
```

### Managing Column Sizing State

If you need to own the `columnSizing` state yourself (for example, to persist user-set column widths), the recommended v9 approach is an external atom (created with `createAtom` from `@tanstack/angular-store`) passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the sizing state without re-running the `injectTable` options initializer on every change.

```ts
import { createAtom } from '@tanstack/angular-store'
import type { ColumnSizingState } from '@tanstack/angular-table'

const features = tableFeatures({ columnSizingFeature })

export class App {
  readonly columnSizingAtom = createAtom<ColumnSizingState>({})

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    atoms: {
      columnSizing: this.columnSizingAtom,
    },
  }))

  // read this.columnSizingAtom.get() wherever you need the value
}
```

Alternatively, the v8-style `state.columnSizing` plus `onColumnSizingChange` pattern is still supported. In Angular this means owning the slice with an Angular signal. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const features = tableFeatures({ columnSizingFeature })

readonly columnSizing = signal<ColumnSizingState>({})

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
  state: {
    columnSizing: this.columnSizing(),
  },
  onColumnSizingChange: (updater) =>
    typeof updater === 'function'
      ? this.columnSizing.update(updater)
      : this.columnSizing.set(updater),
}))
```
