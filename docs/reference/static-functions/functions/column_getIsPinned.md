---
id: column_getIsPinned
title: column_getIsPinned
---

# Function: column\_getIsPinned()

```ts
function column_getIsPinned<TFeatures, TData, TValue>(column): ColumnPinningPosition;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L125)

Returns is pinned for a column.

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

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md)

## Example

```ts
const value = column_getIsPinned(column)
```
