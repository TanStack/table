---
id: column_getIsLastColumn
title: column_getIsLastColumn
---

# Function: column\_getIsLastColumn()

```ts
function column_getIsLastColumn<TFeatures, TData, TValue>(column, position?): boolean;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:79](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L79)

Returns is last column for a column.

This derives the value from the column definition, table options, and the feature state atoms registered on the table.

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
const value = column_getIsLastColumn(column)
```
