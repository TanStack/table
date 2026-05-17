---
id: column_getIsLastColumn
title: column_getIsLastColumn
---

# Function: column\_getIsLastColumn()

```ts
function column_getIsLastColumn<TFeatures, TData, TValue>(column, position?): boolean;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L81)

Checks whether this column is the last visible column in a pinning region.

The same `position` semantics as `column_getIndex` apply.

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

### position?

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`boolean`

## Example

```ts
const isLast = column_getIsLastColumn(column, 'right')
```
