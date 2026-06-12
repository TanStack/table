---
id: column_getSortIndex
title: column_getSortIndex
---

# Function: column\_getSortIndex()

```ts
function column_getSortIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:426](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L426)

Finds this column's position in the ordered `state.sorting` array.

The result is `-1` when the column is not sorted.

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
const index = column_getSortIndex(column)
```
