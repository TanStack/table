---
id: column_getAutoSortDir
title: column_getAutoSortDir
---

# Function: column\_getAutoSortDir()

```ts
function column_getAutoSortDir<TFeatures, TData, TValue>(column): "asc" | "desc";
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:183](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L183)

Chooses the default first sort direction from sampled filtered row values.

The first non-nullish value among the sampled rows decides: string columns
start ascending so alphabetical order is natural; other value types (or
columns with no non-nullish sample) start descending. Sampling past leading
nullish values keeps the toggle cycle stable when sorting or a data swap
moves an empty value into the first row.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`"asc"` \| `"desc"`

## Example

```ts
const direction = column_getAutoSortDir(column)
```
