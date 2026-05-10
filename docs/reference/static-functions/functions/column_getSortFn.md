---
id: column_getSortFn
title: column_getSortFn
---

# Function: column\_getSortFn()

```ts
function column_getSortFn<TFeatures, TData, TValue>(column): SortFn<TFeatures, TData>;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:152](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L152)

Returns sort fn for a column.

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

[`SortFn`](../../index/interfaces/SortFn.md)\<`TFeatures`, `TData`\>

## Example

```ts
const value = column_getSortFn(column)
```
