---
id: column_getFilterIndex
title: column_getFilterIndex
---

# Function: column\_getFilterIndex()

```ts
function column_getFilterIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:183](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L183)

Finds this column's position in the ordered `state.columnFilters` array.

The result is `-1` when the column has no active filter.

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
const index = column_getFilterIndex(column)
```
