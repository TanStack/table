---
id: column_getCanSort
title: column_getCanSort
---

# Function: column\_getCanSort()

```ts
function column_getCanSort<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:359](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L359)

Checks whether this accessor column can participate in sorting.

The column must have an accessor and sorting must be enabled by both the
column definition and table options.

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
const canSort = column_getCanSort(column)
```
