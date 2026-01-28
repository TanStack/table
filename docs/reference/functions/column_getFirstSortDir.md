---
id: column_getFirstSortDir
title: column_getFirstSortDir
---

# Function: column\_getFirstSortDir()

```ts
function column_getFirstSortDir<TFeatures, TData, TValue>(column): "asc" | "desc";
```

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts:211](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L211)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`"asc"` \| `"desc"`
