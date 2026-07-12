---
id: column_getFirstSortDir
title: column_getFirstSortDir
---

# Function: column\_getFirstSortDir()

```ts
function column_getFirstSortDir<TFeatures, TData, TValue>(column): "asc" | "desc";
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:329](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L329)

Resolves the first direction used when this column begins sorting.

Column-level `sortDescFirst` wins, then table-level `sortDescFirst`, then the
auto direction inferred from sampled values.

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
const firstDirection = column_getFirstSortDir(column)
```
