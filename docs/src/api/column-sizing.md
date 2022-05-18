---
name: Column Sizing
id: column-sizing
---

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
