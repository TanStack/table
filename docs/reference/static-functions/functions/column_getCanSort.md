---
id: column_getCanSort
title: column_getCanSort
---

# Function: column\_getCanSort()

```ts
function column_getCanSort<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:344](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L344)

Returns whether a column can use sort.

This combines column options, table options, and any required accessor or feature state for the capability.

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
const value = column_getCanSort(column)
```
