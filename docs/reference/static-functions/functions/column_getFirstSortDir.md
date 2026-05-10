---
id: column_getFirstSortDir
title: column_getFirstSortDir
---

# Function: column\_getFirstSortDir()

```ts
function column_getFirstSortDir<TFeatures, TData, TValue>(column): "asc" | "desc";
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:290](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L290)

Returns first sort dir for a column.

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

`"asc"` \| `"desc"`

## Example

```ts
const value = column_getFirstSortDir(column)
```
