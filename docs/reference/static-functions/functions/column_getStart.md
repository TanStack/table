---
id: column_getStart
title: column_getStart
---

# Function: column\_getStart()

```ts
function column_getStart<TFeatures, TData, TValue>(column, position): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L91)

Computes the offset from the start edge of a pinning region to this column.

The value is the sum of all previous visible leaf column sizes in the
requested `'left'`, `'center'`, or `'right'` region.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

### position

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`number`

## Example

```ts
const leftOffset = column_getStart(column, 'left')
```
