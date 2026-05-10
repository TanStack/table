---
id: column_getGroupedIndex
title: column_getGroupedIndex
---

# Function: column\_getGroupedIndex()

```ts
function column_getGroupedIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L104)

Returns grouped index for a column.

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
const value = column_getGroupedIndex(column)
```
