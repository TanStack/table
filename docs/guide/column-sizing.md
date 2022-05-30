---
title: Column Sizing
---

## Examples

Want to skip to the implementation? Check out these examples:

- [column-sizing](../examples/react/column-sizing)

## API

[Columm Sizing API](../api/column-sizing.md)

## Guide

The column sizing feature allows you to optionally specify the width of each column including min and max widths. It also allows you and your users the ability to dynamically change the width of all columns at will, eg. by dragging the column headers.

Columns by default are given the following measurement options:

```tsx
export const defaultColumnSizing = {
  width: 150,
  minWidth: 20,
  maxWidth: Number.MAX_SAFE_INTEGER,
}
```

These defaults can be overridden by both `tableOptions.defaultColumn` and individual column defs, in that order.

As a headless utility, table logic for column sizing is really only a collection of states that you can apply to your own layouts how you see fit (our example above implements 2 styles of this logic). You can apply these width measurements in a variety of ways:

- `table` elements or any elements being displayed in a table css mode
- `div/span` elements or any elements being displayed in a non-table css mode
  - Block level elements with strict widths
  - Absolutely positioned elements with strict widths
  - Flexbox positioned elements with loose widths
  - Grid positioned elements with loose widths
- Really any layout mechanism that can interpolate cell widths into a table structure.

Each of these approaches has its own tradeoffs and limitations which are usually opinions held by a UI/component library or design system, luckily not you 😉.

TODO
