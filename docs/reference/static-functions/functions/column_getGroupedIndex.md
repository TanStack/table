---
id: column_getGroupedIndex
title: column_getGroupedIndex
---

# Function: column\_getGroupedIndex()

```ts
function column_getGroupedIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L108)

Finds this column's position in the ordered grouping state.

The result is `-1` when the column is not grouped.

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
const index = column_getGroupedIndex(column)
```
