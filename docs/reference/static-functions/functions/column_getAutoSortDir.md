---
id: column_getAutoSortDir
title: column_getAutoSortDir
---

# Function: column\_getAutoSortDir()

```ts
function column_getAutoSortDir<TFeatures, TData, TValue>(column): "asc" | "desc";
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L126)

Infers sort dir for a column.

The inference uses the column definition, table options, and sampled row values when needed.

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
const value = column_getAutoSortDir(column)
```
