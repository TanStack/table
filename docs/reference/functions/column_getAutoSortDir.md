---
id: column_getAutoSortDir
title: column_getAutoSortDir
---

# Function: column\_getAutoSortDir()

```ts
function column_getAutoSortDir<TFeatures, TData, TValue>(column): "asc" | "desc";
```

Defined in: [packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L76)

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
