---
id: column_getIsSorted
title: column_getIsSorted
---

# Function: column\_getIsSorted()

```ts
function column_getIsSorted<TFeatures, TData, TValue>(column): false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:388](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L388)

Returns is sorted for a column.

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

`false` \| [`SortDirection`](../../index/type-aliases/SortDirection.md)

## Example

```ts
const value = column_getIsSorted(column)
```
