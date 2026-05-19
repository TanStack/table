---
id: column_getAfter
title: column_getAfter
---

# Function: column\_getAfter()

```ts
function column_getAfter<TFeatures, TData, TValue>(column, position): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L132)

Computes the offset from the end edge of a pinning region after this column.

The value is the sum of all following visible leaf column sizes in the
requested region.

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
const rightOffset = column_getAfter(column, 'right')
```
