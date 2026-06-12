---
id: column_getIsSorted
title: column_getIsSorted
---

# Function: column\_getIsSorted()

```ts
function column_getIsSorted<TFeatures, TData, TValue>(column): false | SortDirection;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:405](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L405)

Reads this column's current sort direction.

The result is `false` when the column is not sorted, otherwise `'asc'` or
`'desc'` based on the column's entry in `state.sorting`.

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
const direction = column_getIsSorted(column)
```
