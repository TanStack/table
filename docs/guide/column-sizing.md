---
title: Column Sizing Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

<!-- ::start:framework -->

# React

- [Column Sizing](../framework/react/examples/column-sizing)

# Preact

- [Column Sizing](../framework/preact/examples/column-sizing)

# Solid

- [Column Sizing](../framework/solid/examples/column-sizing)

# Svelte

- [Column Sizing](../framework/svelte/examples/column-sizing)

# Vue

- [Column Sizing](../framework/vue/examples/column-sizing)

# Lit

- [Column Sizing](../framework/lit/examples/column-sizing)

<!-- ::end:framework -->

## Column Sizing Guide

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
const columns = [
  {
    accessorKey: 'col1',
    size: 270, //set column size for this column
  },
  //...
]

const table = useTable({
  _features: tableFeatures({ columnSizingFeature }),
  _rowModels: {},
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
