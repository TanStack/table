---
id: column_getIsResizing
title: column_getIsResizing
---

# Function: column\_getIsResizing()

```ts
function column_getIsResizing<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L68)

Returns is resizing for a column.

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

## Returns

`boolean`

## Example

```ts
const value = column_getIsResizing(column)
```
