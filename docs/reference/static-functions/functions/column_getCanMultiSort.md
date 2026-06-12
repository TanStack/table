---
id: column_getCanMultiSort
title: column_getCanMultiSort
---

# Function: column\_getCanMultiSort()

```ts
function column_getCanMultiSort<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:382](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L382)

Checks whether this column can be added to a multi-sort state.

Column-level `enableMultiSort` wins over table-level `enableMultiSort`; if
neither is set, accessor columns can multi-sort by default.

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
const canMultiSort = column_getCanMultiSort(column)
```
