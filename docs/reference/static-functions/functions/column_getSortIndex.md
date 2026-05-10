---
id: column_getSortIndex
title: column_getSortIndex
---

# Function: column\_getSortIndex()

```ts
function column_getSortIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:409](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L409)

Returns sort index for a column.

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

`number`

## Example

```ts
const value = column_getSortIndex(column)
```
