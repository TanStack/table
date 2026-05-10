---
id: column_getCanMultiSort
title: column_getCanMultiSort
---

# Function: column\_getCanMultiSort()

```ts
function column_getCanMultiSort<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:366](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L366)

Returns whether a column can use multi sort.

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
const value = column_getCanMultiSort(column)
```
