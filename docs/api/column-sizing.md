---
name: Column Sizing
route: /api/column-sizing
menu: API
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents**

- [name: Column Sizing
  route: /api/column-sizing
  menu: API](#name-column-sizing%0Aroute-apicolumn-sizing%0Amenu-api)
- [Examples](#examples)
- [State](#state)
- [Column Definition Options](#column-definition-options)
- [Column API](#column-api)
- [Table Options](#table-options)
- [Table Instance API](#table-instance-api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Examples

Want to skip to the implementation? Check out these examples:

- [column-sizing](../examples/column-sizing)

The column sizing feature allows you to optionally specify the width of each column including min and max widths. It also allows you and your users the ability to dynamically change the width of all columns at will, eg. by dragging the column headers.

Columns by default are given the following measurement options:

```tsx
export const defaultColumnSizing = {
  width: 150,
  minWidth: 20,
  maxWidth: Number.MAX_SAFE_INTEGER,
}
```

These defaults can be overridden by both `tableOptions.defaultColumn` and individual column definitions, in that order.

As a headless utility, table logic for column sizing is really only a collection of states that you can apply to your own layouts how you see fit (our example above implements 2 styles of this logic). You can apply these width measurements in a variety of ways:

- `table` elements or any elements being displayed in a table css mode
- `div/span` elements or any elements being displayed in a non-table css mode
  - Block level elements with strict widths
  - Absolutely positioned elements with strict widths
  - Flexbox positioned elements with loose widths
  - Grid positioned elements with loose widths
- Really any layout mechanism that can interpolate cell widths into a table structure.

Each of these approaches has its own tradeoffs and limitations which are usually opinions held by a UI/component library or design system, luckily not you 😉.

## State

Column sizing state is stored on the table instance using the following shape:

```tsx
export type ColumnSizingTableState = {
  columnSizing: ColumnSizing
  columnSizingInfo: ColumnSizingInfoState
}

export type ColumnSizing = Record<string, number>

export type ColumnSizingInfoState = {
  startOffset: null | number
  startSize: null | number
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  columnSizingStart: [string, number][]
}
```

## Column Definition Options

TODO

## Column API

TODO

## Table Options

TODO

## Table Instance API

TODO
